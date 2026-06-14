import { test } from "node:test";
import assert from "node:assert/strict";
import { clickToSource } from "../vite.js";

// Honestly lazily produced tests - this lib mostly for my one-off fun projects
function transform(code, id = "/project/src/App.tsx") {
  const plugin = clickToSource();
  plugin.configResolved({ root: "/project" });
  return plugin.transform(code, id)?.code;
}

test("injects data-cts-loc with relative path and line number", () => {
  const out = transform("const a = <Button>Hi</Button>\n");
  assert.match(out, /<Button data-cts-loc="src\/App\.tsx:1">/);
});

test("handles lowercase host elements and self-closing tags", () => {
  const out = transform('return (\n  <div>\n    <img src="x" />\n  </div>\n)');
  assert.match(out, /<div data-cts-loc="src\/App\.tsx:2">/);
  assert.match(out, /<img data-cts-loc="src\/App\.tsx:3" src="x" \/>/);
});

test("skips non-jsx and node_modules ids", () => {
  assert.equal(
    transform("<Button>Hi</Button>", "/project/src/util.ts"),
    undefined,
  );
  assert.equal(
    transform("<Button>Hi</Button>", "/project/node_modules/x/App.tsx"),
    undefined,
  );
});

test("exclude option skips matching ids (string and RegExp)", () => {
  const plugin = clickToSource({ exclude: ["generated/", /\.stories\.tsx$/] });
  plugin.configResolved({ root: "/project" });
  assert.equal(
    plugin.transform("return <A>x</A>", "/project/src/generated/App.tsx"),
    undefined,
  );
  assert.equal(
    plugin.transform("return <A>x</A>", "/project/src/Button.stories.tsx"),
    undefined,
  );
  assert.match(
    plugin.transform("return <A>x</A>", "/project/src/App.tsx").code,
    /data-cts-loc/,
  );
});
