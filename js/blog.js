import marked from "../node_modules/marked/lib";
import fs from "@/node_modules/fs";
var rendererMD = new marked.Renderer();
var mdFile = "blogMarkdown/" + window.location.search.split("=")[1] + ".md";
var file = fs.readFileSync(mdFile,"utf8");
console.log(file);

marked.setOptions({
    renderer: rendererMD,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

document.getElementById('content').innerHTML = marked('# Marked in browser\n\nRendered by **marked**.');