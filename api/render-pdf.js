import express from "express";
import puppeteer from "puppeteer";
import { renderJSXToHTML } from "./jsxRenderer";

const router = express.Router();

router.post("/render-pdf", async (req, res) => {
  const { jsxCode } = req.body;

  try {
    const html = await renderJSXToHTML(jsxCode);
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({ format: "A4" });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
    });
    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).send("PDF generation failed");
  }
});

export default router;
