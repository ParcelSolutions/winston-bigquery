# winston-bigquery
[Bigquery](http://bigquery.cloud.google.com) transport for [winston logger](https://www.npmjs.com/package/winston)

[![CircleCI](https://circleci.com/gh/kaminskypavel/winston-bigquery.svg?style=svg)](https://circleci.com/gh/kaminskypavel/winston-bigquery)
[![npm version](http://img.shields.io/npm/v/winston-bigquery.svg?style=flat)](https://npmjs.org/package/winston-bigquery "View this project on npm")


## Usage
``` js
import {WinstonBigQuery} from 'winston-bigquery';
import winston, {format} from 'winston';

const logger = winston.createLogger({
	level: 'debug',
	transports: [
		.....
		new WinstonBigQuery({
			datasetId: 'logs'
			tableId: 'winston_logs',
		})
		.....
	]
});

logger.info('Hello World', {
	meta1: 1,
	meta2: 'string',
	meta3: {deepObj: 1}
});

```


## Motivation
Google has its own log solution, [Stackdriver Logging](https://cloud.google.com/logging/).
Unfortunately, I find it messy , inconvenient, and hard to query. On the other hand , Bigquery has an excellent UI
and easy sql-like querying capabilities, it is also optimized to search through HUGE amount of data. 

## Typescript Support
winston-bigquery comes with its' own type definitions, so you wont have to use [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)

## Schema
Bigquery need a schema for the its table, for now you will have to create it manually
you can read more [here](https://cloud.google.com/bigquery/docs/schemas)
 
``` js
[
  {
    "name": "timestamp",
    "type": "TIMESTAMP"
  },
  {
    "name": "level",
    "type": "STRING"
  },
  {
    "name": "message",
    "type": "STRING"
  },
  {
    "name": "meta",
    "type": "STRING"
  }
]
```
[![preview](https://user-images.githubusercontent.com/4253088/64213371-6f1bb500-ceb5-11e9-8142-1504a383f01d.png)]
 
### Installing Winston-Bigquery
`npm i winston-bigquery`

### Run Tests
`npm test`

### Author: [Pavel 'PK' Kaminsky](https://www.pavel-kaminsky.com)

[0]: https://cloud.google.com/logging/docs/setup/nodejs#using_winston
[1]: https://github.com/winstonjs/winston/blob/master/docs/transports.md
[2]: https://cloud.google.com/bigquery/docs/quickstarts/quickstart-client-libraries
[3]: https://github.com/googleapis/nodejs-bigquery/blob/master/samples/insertRowsAsStream.js
