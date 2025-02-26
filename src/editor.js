const standardText = "#000000";
const standardBg = "#ffffff";

const textPickr = Pickr.create({
  el: "#text-color-picker",
  theme: "classic",
  default: standardText,
  components: {
    preview: true,
    opacity: true,
    hue: true,
    interaction: {
      hex: true,
      rgba: true,
      input: true,
      clear: true,
      save: true,
    },
  },
});

const bgPickr = Pickr.create({
  el: "#bg-color-picker",
  theme: "classic",
  default: standardBg,
  components: {
    preview: true,
    opacity: true,
    hue: true,
    interaction: {
      hex: true,
      rgba: true,
      input: true,
      clear: true,
      save: true,
    },
  },
});

function updateLinkColors() {
  const textColor = document.getElementById("preview").style.color;
  document.querySelectorAll("#preview a").forEach((link) => {
    link.style.color = textColor;
  });
}

textPickr.on("save", (color) => {
  const preview = document.getElementById("preview");
  if (color) {
    const textColor = color.toRGBA().toString();
    preview.style.color = textColor;

    preview.querySelectorAll("a").forEach((link) => {
      link.style.color = textColor;
    });
  } else {
    preview.style.color = standardText;
    preview.querySelectorAll("a").forEach((link) => {
      link.style.color = standardText;
    });
  }
});

textPickr.on("clear", () => {
  textPickr.setColor(standardText);
});

bgPickr.on("save", (color) => {
  if (color) {
    document.getElementById("preview").style.backgroundColor = color
      .toRGBA()
      .toString();
  } else {
    document.getElementById("preview").style.backgroundColor = standardText;
  }
});

bgPickr.on("clear", () => {
  bgPickr.setColor(standardBg);
});

const alignButtons = {
  left: document.getElementById("align-left"),
  center: document.getElementById("align-center"),
  right: document.getElementById("align-right"),
};

function setAlignment(alignment) {
  document.getElementById("preview").style.textAlign = alignment;
  Object.values(alignButtons).forEach((btn) => btn.classList.remove("active"));
  alignButtons[alignment].classList.add("active");
}

alignButtons.left.addEventListener("click", () => setAlignment("left"));
alignButtons.center.addEventListener("click", () => setAlignment("center"));
alignButtons.right.addEventListener("click", () => setAlignment("right"));

setAlignment("left");

const fontSelector = document.getElementById("font-selector");

fontSelector.addEventListener("change", (e) => {
  document.getElementById("preview").style.fontFamily = e.target.value;
});

document.getElementById("export-pdf").addEventListener("click", async () => {
  const preview = document.getElementById("preview");
  const htmlContent = preview.innerHTML;
  const textColor = preview.style.color || "#000000";
  const backgroundColor = preview.style.backgroundColor || "#ffffff";
  const textAlign = preview.style.textAlign || "left";
  const fontFamily = preview.style.fontFamily || "Arial, sans-serif";

  console.log("Content being exported:", {
    htmlContent: htmlContent,
    contentLength: htmlContent.length,
    textColor: textColor,
    backgroundColor: backgroundColor,
    textAlign: textAlign,
    fontFamily: fontFamily,
  });

  try {
    const response = await fetch("/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        htmlContent,
        textColor,
        backgroundColor,
        textAlign,
        fontFamily,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData);
      throw new Error(errorData.error || "PDF generation failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown-export.pdf";
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error exporting PDF:", error);
    alert(`Failed to generate PDF: ${error.message}`);
  }
});
