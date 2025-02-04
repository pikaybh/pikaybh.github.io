const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const axios = require("axios");


const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

function escapeCodeBlock(body) {
    // Null body pass
    if (!body || body == "undefined") return "";

    const regex = /```([\s\S]*?)```/g;
    return body.replace(regex, function (match, htmlBlock) {
        return "\n{% raw %}\n```" + htmlBlock.trim() + "\n```\n{% endraw %}\n";
    });
}

function replaceCalloutBlocks(md) {
    if (!md) return "";

    return md.replace(/^>\s*([\u{1F300}-\u{1F6FF}])\s*(.*)$/gum, '<p class="notice">$2</p>');
}

function replaceTitleOutsideRawBlocks(body) {
    // Null body pass
    if (!body) return "";

    const rawBlocks = [];
    const placeholder = "%%RAW_BLOCK%%";
    body = body.replace(/{% raw %}[\s\S]*?{% endraw %}/g, (match) => {
        rawBlocks.push(match);
        return placeholder;
    });

    rawBlocks.forEach(block => {
        body = body.replace(placeholder, block);
    });

    return body;
}

// 이미지 처리
async function processImages(pImg) {
    if (!Array.isArray(pImg) || pImg.length === 0) return [];

    // 저장할 디렉터리 경로
    const saveDir = path.join("assets/images/headers"); 
    let savePaths = [];

    // 🔹 디렉터리 존재 확인 후 생성 (없으면 생성)
    if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
    }

    for (const img of pImg) {
        // 🔹 Notion API에서 URL이 "file.url" 또는 "external.url"에 들어 있을 수 있음.
        const name = img?.name || "unknown";
        const url = img?.file?.url || img?.external?.url;

        // 🔹 URL 유효성 검사
        if (!url || typeof url !== "string" || !url.startsWith("http")) {
            console.error(`Invalid URL for ${name}:`, url);
            continue;
        }

        // 저장할 파일 경로
        const savePath = path.join(saveDir, name);

        // 파일이 이미 존재하면 건너뜀
        if (fs.existsSync(savePath)) {
            console.log(`File already exists, skipping: ${savePath}`);
            savePaths.push(savePath);
            continue;
        }

        try {
            const response = await axios.get(url, { responseType: "stream" });
            const fileStream = fs.createWriteStream(savePath);

            await new Promise((resolve, reject) => {
                response.data.pipe(fileStream);
                fileStream.on("finish", resolve);
                fileStream.on("error", reject);
            });

            savePaths.push(savePath);

        } catch (error) {
            console.error(`Error downloading ${name}:`, error.message);
        }
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

        // header caption
        let headerCaption = r.properties?.["Header Caption"]?.["rich_text"];

        // header caption
        let ctaUrl = r.properties?.["CTA URL"]?.["url"];

        // gallery
        let galleryImg = r.properties?.["Gallery"]?.["files"];

        // author profile
        let profile = r.properties?.["Author Profile"]?.["checkbox"] ? "true" : "false";

        // toc
        let toc = r.properties?.["ToC"]?.["checkbox"] ? "true" : "false";

        // frontmatter
        let fmtags = "";
        let fmcats = "";
        let fmheaderImg = "";
        let fmgalleryImgs = "";
        let fmprofile = "";
        let fmtoc = "";

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
            fmheaderImg += "\nheader:";

            if (headerImg.length > 0) {
                // 🔹 병렬 처리로 모든 이미지 다운로드
                const poverlayImg = await Promise.all(headerImg.map(img => processImages([img])));

                
                // 🔹 결과를 하나씩 추가
                for (const pimgArr of poverlayImg) {
                    for (const pimg of pimgArr) {
                        fmheaderImg += `\n  overlay_image: ${pimg}`;
                    }
                }
            }
            if (teaserImg.length > 0) {
                // 🔹 병렬 처리로 모든 이미지 다운로드
                const pteaserImg = await Promise.all(teaserImg.map(img => processImages([img])));
                
                // 🔹 결과를 하나씩 추가
                for (const pimgArr of pteaserImg) {
                    for (const pimg of pimgArr) {
                        fmheaderImg += `\n  teaser: ${pimg}`;
                    }
                }
            }
            fmheaderImg += headerCaption
                        ? `\n  caption: ${headerCaption}`
                        : "";
            fmheaderImg += ctaUrl
                        ? `\n  cta_url: ${ctaUrl}`
                        : "";
        }
        if (galleryImg.length > 0) {
            fmgalleryImgs += "\ngallery:";
        
            // 🔹 병렬 처리로 모든 이미지 다운로드
            const downloadedImages = await Promise.all(galleryImg.map(img => processImages([img])));
        
            // 🔹 결과를 하나씩 추가
            for (const pimgArr of downloadedImages) {
                for (const pimg of pimgArr) {
                    fmgalleryImgs += `\n  - url: /${pimg}`;
                    fmgalleryImgs += `\n    image_path: ${pimg}`;
                    fmgalleryImgs += `\n    alt: placeholder ${pimg}`;
                }
            }
        }        
        if (profile) fmprofile += "\nauthor_profile: " + profile;
        if (toc) fmtoc += "\ntoc: " + toc;

        const fm = "---\ntitle: "
            + title
            + fmcats
            + fmtags
            + fmheaderImg
            + fmgalleryImgs
            + fmprofile
            + fmtoc
            + "\n---";

        const mdblocks = await n2m.pageToMarkdown(id);
        let md = n2m.toMarkdownString(mdblocks)["parent"];
        if (md === "") {
            continue;
        }
        md = escapeCodeBlock(md);
        md = replaceTitleOutsideRawBlocks(md);
        md = replaceCalloutBlocks(md);

        const imgtitle = `${date}-${title.replaceAll(" ", "-").replaceAll(":", "")}`
        const ftitle = `${imgtitle}.md`;

        let index = 0;
        let edited_md = md.replace(
            /!\[(.*?)\]\((.*?)\)/g,
            function (match, altText, url) {
                const dirname = path.join("assets/images", imgtitle);
                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname, { recursive: true });
                }
                const filename = path.join(dirname, `${index++}.png`);

                axios({
                    method: "get",
                    url: url,
                    responseType: "stream",
                })
                .then(function (response) {
                    let file = fs.createWriteStream(`${filename}`);
                    response.data.pipe(file);
                })
                .catch(function (error) {
                    console.log(error);
                });

                
                let imgTag = "{% capture fig_img %}\n"
                            + `![${ altText }](/${ filename })`
                            + "\n{% endcapture %}\n\n<figure>\n  {{ fig_img | markdownify | remove: '<p>' | remove: '</p>' }}"
                            + `\n  <figcaption>${ altText }</figcaption>`
                            + "\n</figure>";

                return imgTag;
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