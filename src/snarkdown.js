import { default as snarkdown } from "/lib/snarkdown/snarkdown.es.js";
import DOMpurify from "/lib/dompurify/purify.es.mjs";

const textarea = document.querySelector("textarea");
const article = document.querySelector("article");

textarea.addEventListener("input", () => {
  const markdown = textarea.value;
  const fixedMarkdown = markdown.replace(/\n/g, "  \n");
  const rawHtml = snarkdown(fixedMarkdown);
  article.innerHTML = DOMpurify.sanitize(rawHtml);
});
