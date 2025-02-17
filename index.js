import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "src")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.post("/generate-pdf", async (req, res) => {
  console.log('Received PDF generation request');
  let browser;
  try {
    const { htmlContent, textColor, backgroundColor, textAlign } = req.body;
    
    browser = await puppeteer.launch({
      headless: true
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
              padding: 20px;
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
    
    await page.setContent(fullHtml);
    
    await page.waitForSelector('body');
    
    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      printBackground: true
    });
    
    res.contentType('application/pdf');
    res.send(pdf);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      error: error.message
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