import { default as snarkdown } from "/lib/snarkdown/snarkdown.es.js";
import DOMpurify from "/lib/dompurify/purify.es.mjs";

const textarea = document.querySelector("textarea");
const article = document.querySelector("article");

textarea.addEventListener("input", () => {
  const markdown = textarea.value;
  const fixedMarkdown = markdown.replace(
    /^((?!\s*([-+*]|\d+\.)\s).*\S.*)$/gm,
    "$1  "
  );
  const rawHtml = snarkdown(fixedMarkdown);
  article.innerHTML = DOMpurify.sanitize(rawHtml);

  updateLinkColors();
});

function updateLinkColors() {
  const textColor = document.getElementById("preview").style.color;
  document.querySelectorAll("#preview a").forEach((link) => {
    link.style.color = textColor;
  });
}
