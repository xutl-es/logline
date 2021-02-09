import { createSocket } from "dgram";
import type { Socket } from "dgram";
import type { Writable } from "stream";
import { EventEmitter } from "events";
import { EOL } from "os";
import { parse } from "./format";

export class Receiver extends EventEmitter {
  #stream?: Writable;
  #socket: Socket;
  constructor(port: number = 8787, host: string = "127.0.0.1", stream?: Writable) {
    super();
    this.#stream = stream;
    const onmessage = (msg: Buffer) => {
      const line = msg.toString().trim();
      if (this.#stream) {
        this.#stream.write(line + EOL);
      } else {
        try {
          const data = parse(line);
          if (data) {
            const { pkg, info } = data;
            if (pkg && info) {
              this.emit("log", pkg, info);
              this.emit(pkg, info);
            }
          }
        } catch (err) {
          this.emit("error", err);
        }
      }
    };
    const onerror = () => {};
    const onclose = () => {
      console.error("opening listener socket");
      this.#socket = createSocket("udp4");
      this.#socket.on("message", onmessage);
      this.#socket.on("error", onerror);
      this.#socket.on("close", onclose);
      this.#socket.bind(port, host, () => {});
      return this.#socket;
    };
    this.#socket = onclose();
  }
  unref() {
    this.#socket.unref();
  }
  close() {
    this.#socket.removeAllListeners("close");
    this.#socket.close();
  }
}
