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
    const imageRegex = /!\[(.*?)\]\((.*?)\)(?:\n_([^_]*)_)?/g;
    body = body.replace(imageRegex, function (match, altText, imageUrl, caption) {
        let imgTag = `![${altText}](${imageUrl})`;
        // 캡션이 있을 경우 추가
        if (caption) {
            imgTag = `<figure>{{ ${imgTag} | markdownify | remove: "<p>" | remove: "</p>" }}<figcaption>${caption.trim()}</figcaption></figure>`;
        }
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
            start_cursor: nextCursor,
            /** filter: {
                property: "Publish",
                checkbox: {
                    equals: true,
                },
            }, */
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
        let headerImg = [];
        let pheaderImg = r.properties?.["Header"]?.["files"];
        for (const t of pheaderImg) {
            const n = t?.["name"];
            const url = t?.["file"]?.["url"]; // 파일 URL 가져오기
        
            if (n && url) {
                headerImg.push({ name: n, url: url });
            }
        }

        // author profile
        let profile = r.properties?.["Author Profile"]?.["checkbox"] ? "true" : "false";

        // frontmatter
        let fmtags = "";
        let fmcats = "";
        let fmheaderImg = "";
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
        // Header 이미지 처리
        async function processHeaderImages() {
            if (pheaderImg.length === 0) return ""; // 이미지 없으면 빈 문자열 반환

            let headerContent = "\nheader:";

            for (const { name, url } of pheaderImg) {
                const savePath = `assets/images/${name}.png`;
                headerContent += `\n  overlay_image: ${savePath}`;

                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        console.error(`Failed to download ${name}: ${response.statusText}`);
                        continue;
                    }

                    // 이미지 저장
                    const filePath = path.join("assets/images/", `${name}.png`);
                    const fileStream = fs.createWriteStream(filePath);
                    await new Promise((resolve, reject) => {
                        response.body.pipe(fileStream);
                        response.body.on("error", reject);
                        fileStream.on("finish", resolve);
                    });

                } catch (error) {
                    console.error(`Error downloading ${name}:`, error);
                }
            }

            return headerContent;
        }

        fmheaderImg = await processHeaderImages();

        if (profile) fmprofile += "\nauthor_profile: " + profile;

        const fm = "---\ntitle: "
            + title
            + fmcats
            + fmtags
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