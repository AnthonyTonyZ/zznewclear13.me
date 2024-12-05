const path = require('path');
const metamarked = require('meta-marked');
const fs = require('fs');

const PAGE_MARKDOWN_PATH = path.join(__dirname, './posts');
const PAGE_OUTPUT_PATH = path.join(__dirname, './webapp/posts');

//子目录处理
const loadMarkdownPage = (mdFilename) => {
    /*const mdPath = path.join(
      PAGE_MARKDOWN_PATH, mdFilename
    );*/
    const mdPath=mdFilename
    //读取文件
    const mdBuffer = fs.readFileSync(mdPath);
    return mdBuffer.toString();
}

const parseMarkdown = (mdString = '') => {
    return metamarked(mdString.toString());
}

/**
 * 读取路径
 * @param directoryPath
 * @returns {*[]}
 */
function readDirectoryFiles(directoryPath) {
    let files = [];

    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
    for (let entry of entries) {
        const entryPath = path.join(directoryPath, entry.name);
        if (entry.isDirectory()) {
            // 递归读取子目录
            files = files.concat(readDirectoryFiles(entryPath));
        } else {
            // 添加文件到列表
            files.push(entryPath);
        }
        console.log(entryPath)
    }
    return files;
}

//改1,读取子目录
// let routes = fs.readdirSync(PAGE_MARKDOWN_PATH)
let routes = readDirectoryFiles(PAGE_MARKDOWN_PATH)

module.exports = [
    ...routes.map((route) => {
        let mdString = loadMarkdownPage(route);
        let md = parseMarkdown(mdString);
        let MDtitle = md.meta.title
        let MDdisc = md.meta.disc
        let MDpath = md.meta.path

        return {
            title: `${MDtitle}`,
            disc: `${MDdisc}`,
            filename: path.join(PAGE_OUTPUT_PATH, `${MDpath}.html`),
            template: './src/postsTemplate.pug',
            inject: true,
            bodyHTML: md.html
        }
    })

];
