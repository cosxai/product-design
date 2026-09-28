import assert from "node:assert/strict";
import { test } from "node:test";

import { pageAt, pageOfFile, pathOf, slugOf } from "./index.ts";

test("slugs", () => {
  assert.equal(slugOf("Button"), "button");
  assert.equal(slugOf("Pattern Action Bar"), "pattern-action-bar");
});

test("clean paths map to pages", () => {
  assert.equal(pageAt("/"), "Home");
  assert.equal(pageAt("/button"), "Button");
  assert.equal(pageAt("/Button/"), "Button");
  assert.equal(pageAt("/pattern-action-bar"), "Pattern Action Bar");
  assert.equal(pageAt("/home"), undefined, "Home lives at /");
  assert.equal(pageAt("/site-header"), undefined, "partials are not pages");
  assert.equal(pageAt("/nope"), undefined);
  assert.equal(pageAt("/button/extra"), undefined);
});

test("old file URLs name their page", () => {
  assert.equal(pageOfFile("/Button.dc.html"), "Button");
  assert.equal(pageOfFile("/Pattern%20Action%20Bar.dc.html"), "Pattern Action Bar");
  assert.equal(pageOfFile("/Site%20Header.dc.html"), undefined, "partials stay files");
  assert.equal(pageOfFile("/support.js"), undefined);
});

test("page paths", () => {
  assert.equal(pathOf("Home"), "/");
  assert.equal(pathOf("Template Sign In"), "/template-sign-in");
});
