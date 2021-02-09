import type { Writable } from "stream";
import { EOL } from "os";

import type { LogInfo } from "./format";
import { format } from "./format";

export class Logger {
  #stream: Writable;
  #pkg: string;
  #version: string;
  constructor(pkg: string, version: string, stream: Writable = process.stderr) {
    this.#stream = stream;
    this.#pkg = pkg;
    this.#version = version;
  }
  log(info: string | LogInfo | Error) {
    const line = format(this.#pkg, this.#version, info);
    this.#stream.write(line.trim() + EOL);
  }
}
