import * as Timer from "@xutl/test-timers";
Timer.default(Date.now());
const timestamp = Date.now();
const timestr = new Date().toISOString();

import { describe, it } from "@xutl/test";
import assert from "assert";

import { format, parse, extraction } from "../lib";

describe("formatting", () => {
  describe("format", () => {
    it("format is a function", () => assert.strictEqual(typeof format, "function"));
    it("format(pkg, vrs, string) => string", () => assert.strictEqual(format("pkg", "1.0.0", "hallo"), timestr + " pkg; version=1.0.0; message=hallo;"));
    it("format(pkg, vrs, error) => string", () => assert.strictEqual(typeof format("pkg", "1.0.0", new Error("hallo")), "string"));
    it("format(pkg, vrs, info) => string", () => assert.strictEqual(format("pkg", "1.0.0", { data: 123 }), timestr + " pkg; version=1.0.0; data=123;"));
  });
  describe("parse", () => {
    it("parse is a function", () => assert.strictEqual(typeof parse, "function"));
    it("parse(line) => info(string)", () => assert.deepStrictEqual(parse(format("pkg", "1.0.0", "hallo")), { pkg: "pkg", timestamp, info: { version: "1.0.0", message: "hallo" } }));
    it("parse(line) => info(Error)", () => {
      const err = new Error("hallo");
      assert.deepStrictEqual(parse(format("pkg", "1.0.0", err)), { pkg: "pkg", timestamp, info: { version: "1.0.0", error: err.stack } });
    });
    it("parse(line) => info(info)", () => assert.deepStrictEqual(parse(format("pkg", "1.0.0", { a: 1, b: "hallo" })), { pkg: "pkg", timestamp, info: { version: "1.0.0", a: "1", b: "hallo" } }));
  });
  describe("extraction", () => {
    it("extraction is a function", () => assert.strictEqual(typeof extraction, "function"));
    it("extraction(name) = regex", () => assert.strict(extraction("name") instanceof RegExp));
    it("extraction(message) matches", () => assert(extraction("message").exec('"' + format("pkg", "1.0.0", "value") + '"')));
    //@ts-expect-error
    it("extraction(message) result correct", () => assert.strictEqual(extraction("message").exec('"' + format("pkg", "1.0.0", "value") + '"')[1], "value"));
    it("extraction(version) matches", () => assert(extraction("version").exec('"' + format("pkg", "1.0.0", "value") + '"')));
    //@ts-expect-error
    it("extraction(version) result correct", () => assert.strictEqual(extraction("version").exec(format("pkg", "1.0.0", "value"))[1], "1.0.0"));
  });
});
