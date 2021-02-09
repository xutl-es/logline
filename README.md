# @xutl/logline

A simple utility for formatting rich log lines and writing them to streams. It also includes a mechanism to froward log-lines via UDP as well as parse log-lines back into JSON.

## Install

`npm install --save @xutl/loglines`

## Usage

```typescript
import Logger from '@xutl/loglines';
import * as PKG from './package.json;
const logger = new Logger(PKG.name, PKG.version, process.stderr);

logger.log('a string');
logger.log(new Error('an error'));
logger.log({ a: 1, b: 'two', e: new Error('hallo') });
```

```typescript
import { Sender } from '@xutl/loglines';
import * as PKG from './package.json;

// port & host are optional and default to 127.0.0.1:8787
const sender = new Sender(PKG.name, PKG.version, 8787, '127.0.0.0');

sender.log('a string');
sender.log(new Error('an error'));
sender.log({ a: 1, b: 'two', e: new Error('hallo') });
```

```typescript
import { Receiver } from '@xutl/loglines';
import * as PKG from './package.json;

// port & host are optional and default to 127.0.0.1:8787
// if no stream is given, events are emitted
const receiver = new Receiver(8787, '127.0.0.0', process.stderrr);
const sender = new Sender(PKG.name, PKG.version, 8787, '127.0.0.0');

sender.log('a string');
sender.log(new Error('an error'));
sender.log({ a: 1, b: 'two', e: new Error('hallo') });
```

```typescript
import { format, parse } from '@xutl/loglines';
import * as PKG from './package.json;

// interface LogInfo {
//   [name: string]: string | number | boolean | null | Error;
// }

const line: string = format(PKG.name, PKG.version, 'my log message');
/*
2021-02-09T22:35:45.123Z @xutl/logline; version=1.0.0; message=my log message;
*/

const info: { pkg: string, info: LogInfo } = parse(line);
/*
{
  timestamp: 1612910145123,
  pkg: '@xutl/logline',
  info: {
    version: '1.0.0',
    message: 'my log message'
  }
}
*/
```
