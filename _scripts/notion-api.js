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
    return body.replace(regex, function (match, htmlBlock) {
        return "\n{% raw %}\n```" + htmlBlock.trim() + "\n```\n{% endraw %}\n";
    });
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
    const pages = response.results;
    while (response.has_more) {
        const nextCursor = response.next_cursor;
        response = await notion.databases.query({
            database_id: databaseId,
            start_cursor: nextCursor,
            filter: {
                property: "Publish",
                checkbox: {
                    equals: true,
                },
            },
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
            if (n) {
                tags.push(n);
            }
        }

        // categories
        let cats = [];
        let pcats = r.properties?.["Categories"]?.["multi_select"];
        for (const t of pcats) {
            const n = t?.["name"];
            if (n) {
                cats.push(n);
            }
        }

        // header
        /** let headerImg = [];
        let pheaderImg = r.properties?.["Header"]?.["files_and_media"];
        for (const t of pheaderImg) {
            const n = t?.["name"];
            if (n) {
                headerImg.push(n);
            }
        } */

        // frontmatter
        let fmtags = "";
        let fmcats = "";
        let fmheaderImg = "";
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
        /** if (headerImg.length > 0) {
            fmheaderImg += "\nheader:\n  overlay_image: assets/images/"
        } */
        const fm = `---
title: ${title}${fmcats}${fmtags} 
---
`;

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
            function (match, p1, p2, p3) {
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