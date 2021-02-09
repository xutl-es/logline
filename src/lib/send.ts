import { createSocket } from "dgram";
import type { Socket } from "dgram";

import { format } from "./format";
import type { LogInfo } from "./format";

export class Sender {
  #socket: Socket;
  #host: string;
  #port: number;
  #pkg: string;
  #version: string;
  constructor(pkg: string, version: string, port: number = 8787, host: string = "127.0.0.1") {
    this.#socket = createSocket("udp4");
    this.#host = host;
    this.#port = port;
    this.#pkg = pkg;
    this.#version = version;
  }
  log(info: string | LogInfo | Error) {
    const line = format(this.#pkg, this.#version, info);
    this.#socket.send(line.trim(), this.#port, this.#host);
  }
  unref() {
    this.#socket.unref();
  }
  close() {
    this.#socket.close();
  }
}
