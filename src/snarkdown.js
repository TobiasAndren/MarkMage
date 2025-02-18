import { default as snarkdown } from "/lib/snarkdown/snarkdown.es.js";
import DOMpurify from "/lib/dompurify/purify.es.mjs";

const textarea = document.querySelector("textarea");
const article = document.querySelector("article");

textarea.addEventListener("input", () => {
  const rawHtml = snarkdown(textarea.value);
  article.innerHTML = DOMpurify.sanitize(rawHtml);
});
