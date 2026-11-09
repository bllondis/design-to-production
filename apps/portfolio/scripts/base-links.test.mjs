import assert from "node:assert/strict";
import { test } from "node:test";
import { applyBase } from "./base-links.mjs";

const base = "/design-to-production";

test("moves links, images, forwards and island props under the base", () => {
  assert.equal(applyBase('<a href="/work/timeflow/">x</a>', base), `<a href="${base}/work/timeflow/">x</a>`);
  assert.equal(applyBase('<a href="/#top">x</a>', base), `<a href="${base}/#top">x</a>`);
  assert.equal(applyBase('<a href="/">x</a>', base), `<a href="${base}/">x</a>`);
  assert.equal(applyBase('<a href="/uk/#work">x</a>', base), `<a href="${base}/uk/#work">x</a>`);
  assert.equal(applyBase('<a href="/nl/">x</a>', base), `<a href="${base}/nl/">x</a>`);
  assert.equal(applyBase('<img src="/assets/a.jpg?v=2">', base), `<img src="${base}/assets/a.jpg?v=2">`);
  assert.equal(
    applyBase('<astro-island props="{&quot;src&quot;:[0,&quot;/assets/a.jpg&quot;]}">', base),
    `<astro-island props="{&quot;src&quot;:[0,&quot;${base}/assets/a.jpg&quot;]}">`,
  );
  assert.equal(
    applyBase('<meta http-equiv="refresh" content="0; url=/work/bookit/">', base),
    `<meta http-equiv="refresh" content="0; url=${base}/work/bookit/">`,
  );
  assert.equal(
    applyBase('<script>location.replace("/work/bookit/" + location.hash);</script>', base),
    `<script>location.replace("${base}/work/bookit/" + location.hash);</script>`,
  );
});

test("leaves text, full URLs and paths already under the base alone", () => {
  for (const html of [
    "<code>&lt;Button href=&quot;/work/timeflow/&quot;&gt;</code>",
    '<a href="https://github.com/bllondis">x</a>',
    '<a href="mailto:name@example.com">x</a>',
    '<a href="//example.com/a">x</a>',
    `<script src="${base}/_astro/a.js"></script>`,
    `<a href="${base}">x</a>`,
  ]) {
    assert.equal(applyBase(html, base), html);
  }
});

test("a folder that only starts like the base still moves", () => {
  assert.equal(applyBase(`<a href="${base}-notes/">x</a>`, base), `<a href="${base}${base}-notes/">x</a>`);
});
