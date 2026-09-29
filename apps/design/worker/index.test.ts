import assert from "node:assert/strict";
import { test } from "node:test";

import { cacheControlFor, fileFor, routeAt, routeOfFile, variantFor } from "./index.ts";

test("clean paths", () => {
  assert.equal(routeAt("/")?.name, "Home");
  assert.equal(routeAt("/Button/")?.name, "Button");
  assert.equal(routeAt("/pattern-action-bar")?.name, "Pattern Action Bar");
  assert.equal(routeAt("/ui-spec/metaroom-components")?.name, "Metaroom Components");
  assert.equal(routeAt("/site-header"), undefined, "partials are not pages");
  assert.equal(routeAt("/home"), undefined, "Home lives at /");
});

test("old export file URLs", () => {
  assert.equal(routeOfFile("/Button.dc.html")?.path, "/button");
  assert.equal(routeOfFile("/ui-spec/Metaroom%20Components.dc.html")?.path, "/ui-spec/metaroom-components");
  assert.equal(routeOfFile("/Site%20Header.dc.html"), undefined);
});

test("the cookie picks the build; English and light by default", () => {
  assert.equal(variantFor(null), "");
  assert.equal(variantFor("a=1; cosx-site=en-light"), "");
  assert.equal(variantFor("cosx-site=zh-light"), "zh");
  assert.equal(variantFor("cosx-site=en-ink"), "ink");
  assert.equal(variantFor("x=y; cosx-site=zh-ink; z=w"), "zh-ink");
  const button = routeAt("/button")!;
  assert.equal(fileFor(button, "zh-ink"), "/p/button/zh-ink/index.html");
  assert.equal(fileFor(routeAt("/")!, ""), "/p/home/index.html");
  const spec = routeAt("/ui-spec/metaroom-components")!;
  assert.equal(fileFor(spec, "zh"), "/p/ui-spec/metaroom-components/index.html", "spec pages have one build");
});

test("cache policy", () => {
  assert.match(cacheControlFor("/_astro/Button.abc.js"), /immutable/);
  assert.doesNotMatch(cacheControlFor("/assets/logo.svg"), /immutable/);
});
