export interface LogInfo {
  [name: string]: string | number | boolean | null | Error;
}

export function format(pkg: string, version: string, info: LogInfo | string | Error = {}) {
  if (info instanceof Error) info = { error: info };
  if ("string" === typeof info) info = { message: info };
  const vars = Object.entries(Object.assign({ version }, info))
    .map(([key, val]) => {
      key = key.trim();
      val = val instanceof Error ? `${(val && (val.stack || val.message)) || val}` : `${val}`;
      val = val
        .split(/\r?\n/)
        .map((l) => l.trim())
        .join(" ")
        .trim()
        .split("; ")
        .join(";")
        .split(';"')
        .join(';:"');
      return `${key}=${val}`;
    })
    .join("; ");
  return `${new Date().toISOString()} ${pkg}; ${vars};`;
}

export function parse(line: string) {
  line = line.trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z [\w@-_]+;/.test(line) || !/;$/.test(line)) throw new Error("invalid line");
  const [ts, ...rest] = line.split(" ");
  const timestamp = Date.parse(ts as string);
  const [pkg, ...args] = rest.join(" ").slice(0, -1).split("; ");
  const info: { [name: string]: string } = {};
  for (const arg of args) {
    const [name, ...val] = arg.split("=");
    if (!name) return;
    let value = val.join("=");
    if (/\sat\s\S+:\d+:\d+/.test(value)) {
      value = value.split(" at ").join("\n    at ");
    }
    info[name] = value;
  }
  return { pkg, timestamp, info };
}

export function extraction(name: string) {
  return new RegExp(`\\s${name}=(.*?);(?:\\s|\\"|$)`);
}
