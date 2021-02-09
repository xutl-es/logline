import * as Timer from "@xutl/test-timers";
Timer.default(Date.now());
const timestamp = Date.now();

import { describe, it, after } from "@xutl/test";
import assert from "assert";

import { Writable } from "stream";

import { Sender, Receiver, parse } from "../lib";

class Buffer {
  constructor() {
    const { promise, resolve } = this.clear();
    this.next = promise;
    this.resolve = resolve;
  }
  clear() {
    const { promise, resolve } = Buffer.defer();
    this.next = promise;
    this.resolve = resolve;
    return { resolve, promise };
  }
  write(data: string) {
    this.resolve(data);
  }
  public next: Promise<string>;
  private resolve: (data: string) => void;
  static defer() {
    let resolve;
    const promise = new Promise<string>((res) => (resolve = res));
    return { resolve: (resolve as any) as (data: string) => void, promise };
  }
}

describe("send - receive", () => {
  const buffer = new Buffer();
  const sender = new Sender("pkg", "1.0.0");
  const receiver = new Receiver(undefined, undefined, (buffer as any) as Writable);
  it("receives(string)", async () => {
    sender.log("hallo");
    assert.deepStrictEqual(parse(await buffer.next), { pkg: "pkg", timestamp, info: { version: "1.0.0", message: "hallo" } });
    buffer.clear();
  });
  it("receives(Error)", async () => {
    const err = new Error("hallo");
    sender.log(err);
    assert.deepStrictEqual(parse(await buffer.next), { pkg: "pkg", timestamp, info: { version: "1.0.0", error: err.stack } });
    buffer.clear();
  });
  it("receives(info)", async () => {
    const err = new Error("hallo");
    sender.log({ value: err });
    assert.deepStrictEqual(parse(await buffer.next), { pkg: "pkg", timestamp, info: { version: "1.0.0", value: err.stack } });
    buffer.clear();
  });
  after(() => {
    sender.close();
    receiver.close();
  });
});
