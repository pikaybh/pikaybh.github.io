const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
// or
// import {NotionToMarkdown} from "notion-to-md";

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

function escapeCodeBlock(body) {
    // Null body pass
    if (!body) return "";

    const regex = /```([\s\S]*?)```/g;
    body = body.replace(regex, function (match, htmlBlock) {
        return "\n{% raw %}\n```" + htmlBlock.trim() + "\n```\n{% endraw %}\n";
    });

    // 이미지 태그 변환 (캡션 추가)
    /* const imageRegex = /!\[(.*?)\]\((.*?)\)(?:_([^_]*)_)?/g; */
    const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
    body = body.replace(imageRegex, function (match, altText, imageUrl, _) {
        let imgTag = "{% capture fig_img %}\n"
                    + `![${ altText }](${ imageUrl })`
                    + "\n{% endcapture %}\n\n<figure>\n  {{ fig_img | markdownify | remove: '<p>' | remove: '</p>' }}\n</figure>";
        
        return imgTag;
    });

    return body;
}

function replaceTitleOutsideRawBlocks(body) {
    const rawBlocks = [];
    const placeholder = "%%RAW_BLOCK%%";
    body = body.replace(/{% raw %}[\s\S]*?{% endraw %}/g, (match) => {
        rawBlocks.push(match);
        return placeholder;
    });

    const regex = /\n#[^\n]+\n/g;
    body = body.replace(regex, function (match) {
        return "\n" + match.replace("\n#", "\n##");
    });

    rawBlocks.forEach(block => {
        body = body.replace(placeholder, block);
    });

    return body;
}

// 이미지 처리
async function processImages(pImg) {
    if (!Array.isArray(pImg) || pImg.length === 0) return "";

    const savePaths = [];

    for (const img of pImg) {
        // 🔹 Notion API에서 URL이 "file.url" 또는 "external.url"에 들어 있을 수 있음.
        const name = img?.name || "unknown";
        const url = img?.file?.url || img?.external?.url;

        // 🔹 URL 유효성 검사
        if (!url || typeof url !== "string" || !url.startsWith("http")) {
            console.error(`Invalid URL for ${name}:`, url);
            continue;
        }

        // 저장할 디렉터리 경로
        const saveDir = path.join("assets/images/headers"); 

        // 🔹 디렉터리 존재 확인 후 생성 (없으면 생성)
        if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
        }

        // Path
        const savePath = path.join(saveDir, `${name}`);

        if (!fs.existsSync(savePath)){
            try {
                const response = await axios.get(url, { responseType: "stream" });
                const fileStream = fs.createWriteStream(savePath);
    
                await new Promise((resolve, reject) => {
                    response.data.pipe(fileStream);
                    fileStream.on("finish", resolve);
                    fileStream.on("error", reject);
                });
            } catch (error) {
                console.error(`Error downloading ${name}:`, error.message);
            }
        }

        savePaths.push(...savePath)
    }

    return savePaths;
}

// passing notion client to the option
const n2m = new NotionToMarkdown({ notionClient: notion });

(async () => {
    // Call DB
    const databaseId = process.env.DATABASE_ID;
    let response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: "Publish",
            checkbox: {
                equals: true,
            },
        },
    });

    // Fetch into pages
    const pages = [...response.results];
    /** const pages = response.results; */
    while (response.has_more) {
        const nextCursor = response.next_cursor;
        response = await notion.databases.query({
            database_id: databaseId,
            start_cursor: nextCursor
        });
        pages.push(...response.results);
    }

    for (const r of pages) {
        const id = r.id;

        // ensure directory exists
        let post_type = r.properties?.["Type"]?.["select"];
        let root = "_" + post_type?.["name"];
        if(!fs.existsSync(root)) {
            fs.mkdirSync(root, { recursive: true })
        }

        // date
        let date = moment(r.created_time).format("YYYY-MM-DD");
        let pdate = r.properties?.["Date"]?.["date"]?.["start"];
        if (pdate) {
            date = moment(pdate).format("YYYY-MM-DD");
        }

        // title
        let title = id;
        let ptitle = r.properties?.["Title"]?.["title"];
        if (ptitle?.length > 0) {
            title = ptitle[0]?.["plain_text"];
        }

        // tags
        let tags = [];
        let ptags = r.properties?.["Tags"]?.["multi_select"];
        for (const t of ptags) {
            const n = t?.["name"];
            if (n) tags.push(n);
        }

        // categories
        let cats = [];
        let pcats = r.properties?.["Categories"]?.["multi_select"];
        for (const t of pcats) {
            const n = t?.["name"];
            if (n) cats.push(n);
        }

        // header
        let headerImg = r.properties?.["Header"]?.["files"];

        // teaser
        let teaserImg = r.properties?.["Teaser"]?.["files"];

        // gallery
        let galleryImg = r.properties?.["Gallery"]?.["files"];

        // author profile
        let profile = r.properties?.["Author Profile"]?.["checkbox"] ? "true" : "false";

        // frontmatter
        let fmtags = "";
        let fmcats = "";
        let fmheaderImg = "";
        let fmgalleryImg = "";
        let fmprofile = "";

        if (tags.length > 0) {
            fmtags += "\ntags:";
            for (const t of tags) {
                fmtags += "\n  - " + t;
            }
        }
        if (cats.length > 0) {
            fmcats += "\ncategories:";
            for (const t of cats) {
                fmcats += "\n  - " + t;
            }
        }
        if (headerImg.length > 0 || teaserImg.length > 0) {
            fmheaderImg = "\nheader:";

            if (headerImg.length > 0) {
                let poverlayImg = await processImages(headerImg[0]);
                fmheaderImg += `\n  ${poverlayImg}`;
            }
            if (teaserImg > 0) {
                let pteaserImg = await processImages(teaserImg[0]);
                fmheaderImg += `\n  ${pteaserImg}`;
            }
        }
        if (galleryImg.length > 0) {
            fmgalleryImg += "\ngallery:";

            for (const img of galleryImg) {
                let pimg = await processImages(img);
                fmgalleryImg += `\n  - url: /${pimg}`;
                fmgalleryImg += `\n  - image_path: ${pimg}`;
                fmgalleryImg += `\n  - alt: placeholder ${pimg}`;
            }
        }
        if (profile) fmprofile += "\nauthor_profile: " + profile;

        const fm = "---\ntitle: "
            + title
            + fmcats
            + fmtags
            + fmheaderImg
            + fmgalleryImg
            + fmprofile
            + "\n---";

        const mdblocks = await n2m.pageToMarkdown(id);
        let md = n2m.toMarkdownString(mdblocks)["parent"];
        if (md === "") {
            continue;
        }
        md = escapeCodeBlock(md);
        md = replaceTitleOutsideRawBlocks(md);

        const ftitle = `${date}-${title.replaceAll(" ", "-")}.md`;

        let index = 0;
        let edited_md = md.replace(
            /!\[(.*?)\]\((.*?)\)/g,
            /** function (match, p1, p2, p3) { */
            function (match, p1, p2) {
                const dirname = path.join("assets/images", ftitle);
                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname, { recursive: true });
                }
                const filename = path.join(dirname, `${index}.png`);

                axios({
                    method: "get",
                    url: p2,
                    responseType: "stream",
                })
                .then(function (response) {
                    let file = fs.createWriteStream(`${filename}`);
                    response.data.pipe(file);
                })
                .catch(function (error) {
                    console.log(error);
                });

                let res;
                if (p1 === "") res = "";
                else res = `_${p1}_`;

                return `![${index++}](/${filename})${res}`;
            }
        );

        //writing to file
        fs.writeFile(path.join(root, ftitle), fm + edited_md, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
})();