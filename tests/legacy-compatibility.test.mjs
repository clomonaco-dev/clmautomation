import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const legacyRoot = path.resolve("legacy/src");
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const file = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(file) : [file];
    }),
  );
  return nested.flat();
}
const originalFiles = await walk(legacyRoot);
const relative = (file) =>
  path.relative(legacyRoot, file).split(path.sep).join("/");
const pages = originalFiles.filter((file) => file.endsWith(".html"));
const images = originalFiles.filter((file) =>
  relative(file).startsWith("images/"),
);
const digest = (buffer) => createHash("sha256").update(buffer).digest("hex");

test("All 9 legacy pages are exported at their original URLs", async () => {
  assert.equal(pages.length, 9);
  const sitemap = await readFile("out/sitemap.xml", "utf8");
  for (const file of pages) {
    const rel = relative(file);
    await access(path.join("out", rel));
    const url = "https://clmautomation.it/" + rel.replace(/index\.html$/, "");
    assert.ok(
      sitemap.includes(`<loc>${url}</loc>`),
      `Missing original URL in sitemap: ${url}`,
    );
    const html = await readFile(path.join("out", rel), "utf8");
    assert.ok(
      html.includes(`rel="canonical" href="${url}"`),
      `Changed canonical: ${url}`,
    );
  }
});

for (const file of images) {
  const rel = relative(file);
  test(`Original image preserved byte for byte: /${rel}`, async () => {
    const original = digest(await readFile(file));
    assert.equal(digest(await readFile(path.join("public", rel))), original);
    assert.equal(digest(await readFile(path.join("out", rel))), original);
  });
}

test("All 38 original images remain available, alongside optional optimised copies", () => {
  assert.equal(images.length, 38);
});

test("Original favicons and public documents retain their URLs and contents", async () => {
  for (const rel of [
    "favicon.ico",
    "favicon2.ico",
    "documents/laurea.pdf",
    "documents/abilitazione.pdf",
  ]) {
    assert.equal(
      digest(await readFile(path.join("out", rel))),
      digest(await readFile(path.join(legacyRoot, rel))),
    );
  }
});
