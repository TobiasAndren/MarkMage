import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "src")));

app.use(
  "/lib/snarkdown",
  express.static(path.join(__dirname, "node_modules/snarkdown/dist"))
);
app.use(
  "/lib/dompurify",
  express.static(path.join(__dirname, "node_modules/dompurify/dist"))
);
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.post("/generate-pdf", async (req, res) => {
  console.log("Received PDF generation request");
  let browser;
  try {
    const { htmlContent, textColor, backgroundColor, textAlign, fontFamily } =
      req.body;

    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              color: ${textColor};
              background-color: ${backgroundColor};
              text-align: ${textAlign};
              font-family: ${fontFamily};
              padding: 20px;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    await page.setContent(fullHtml);
    await page.waitForSelector("body");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    res.contentType("application/pdf");
    res.end(pdf);
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({
      error: error.message,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(port, () =>
  console.log(`Server is listening on http://localhost:${port}`)
);
