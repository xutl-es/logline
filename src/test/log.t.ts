import * as Timer from "@xutl/test-timers";
Timer.default(Date.now());
const timestamp = Date.now();

import { describe, it } from "@xutl/test";
import assert from "assert";

import { Writable } from "stream";

import Logger, { parse } from "../lib";

class Buffer {
  write(data: string) {
    this.data = data;
  }
  public data: string = "";
}
describe("log", () => {
  const buffer = new Buffer();
  const logger = new Logger("pkg", "1.0.0", (buffer as any) as Writable);
  it("log(string)", () => {
    logger.log("hallo");
    assert.deepStrictEqual(parse(buffer.data), { pkg: "pkg", timestamp, info: { version: "1.0.0", message: "hallo" } });
  });
  it("log(Error)", () => {
    const err = new Error("hallo");
    logger.log(err);
    assert.deepStrictEqual(parse(buffer.data), { pkg: "pkg", timestamp, info: { version: "1.0.0", error: err.stack } });
  });
  it("log(info)", () => {
    const err = new Error("hallo");
    logger.log({ phase: 1, err });
    assert.deepStrictEqual(parse(buffer.data), { pkg: "pkg", timestamp, info: { version: "1.0.0", phase: "1", err: err.stack } });
  });
});
