import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
const routes = [
  "",
  "chi-siamo",
  "servizi",
  "pacchetti",
  "metodo",
  "contatti",
  "avvocati",
  "medici",
  "professionisti",
  "siti-web",
  "restyling-siti-web",
  "sviluppo-web",
  "seo-performance",
  "siti-multilingua",
  "assistenza-web",
  "progetti",
  "recensioni",
  "privacy",
  "cookie-policy",
  "termini-condizioni",
];
for (const locale of ["it", "en"])
  for (const route of routes) {
    const url = `${locale === "en" ? "en/" : ""}${route ? route + "/" : ""}`;
    test(`${locale}: /${url} and legacy index.html`, async () => {
      const html = await readFile(`out/${url}index.html`, "utf8");
      assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`));
      assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
      assert.ok(html.includes("CLM Automation"));
      assert.ok(html.includes(`https://clmautomation.it/${url}`));
      assert.match(html, /hrefLang="it"/i);
      assert.match(html, /hrefLang="en"/i);
    });
  }
test("Contact fields preserved for Netlify detection", async () => {
  const html = await readFile("out/__forms.html", "utf8");
  for (const field of [
    "form-name",
    "name",
    "email",
    "activity",
    "message",
    "service",
    "language",
    "bot-field",
  ])
    assert.ok(html.includes(`name="${field}"`));
  assert.ok(html.includes('data-netlify="true"'));
});
test("Legacy public documents and assets are available", async () => {
  for (const file of [
    "documents/laurea.pdf",
    "documents/abilitazione.pdf",
    "images/logo/logo.png",
    "favicon.ico",
    "sitemap.xml",
    "robots.txt",
  ])
    await access("out/" + file);
});
