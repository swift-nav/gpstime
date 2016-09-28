#!/usr/bin/env node --harmony

/**
 * Copyright (C) 2016 Swift Navigation Inc.
 * Contact: Joshua Gross <josh@swift-nav.com>
 * This source is subject to the license found in the file 'LICENSE' which must
 * be distributed together with this source. All other rights reserved.
 *
 * THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND,
 * EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
 */

import * as utils from './index';

const modes = [
  "current-gps-wn-tow",
  "utc-to-wn-tow",
  "gps-to-wn-tow",
  "wn-tow-to-utc",
  "wn-tow-to-gps",
  "utc-to-gps",
  "gps-to-utc"
];

function iso8601 (s) {
  const ts = Date.parse(s);
  if (isNaN(ts)) {
    return new Error('invalid iso8601 string: ' + s);
  }
  return new Date(s);
}

function strictParseInt (s) {
  const n = parseInt(s);
  if (isNaN(n)) {
    return new Error('invalid integer: ' + s);
  }
  return n;
}

const argTypes = [
  [],
  [iso8601],
  [iso8601],
  [strictParseInt, strictParseInt],
  [strictParseInt, strictParseInt],
  [iso8601],
  [iso8601]
];

const argTypeNames = [
  [],
  ['iso8601'],
  ['iso8601'],
  ['week number (wn)', 'time of week (tow)'],
  ['week number (wn)', 'time of week (tow)'],
  ['iso8601'],
  ['iso8601']
];

const modeFns = [
  utils.currentGpsWnTow,
  utils.utcTimestampToWnTow,
  utils.gpsTimestampToWnTow,
  utils.wnTowToUtcTimestamp,
  utils.wnTowToGpsTimestamp,
  utils.utcTimestampToGpsTimestamp,
  utils.gpsTimestampToUtcTimestamp
];

function getMode () {
  let i = 0;
  if (/node$/.test(process.argv[i])) {
    i++;
  }
  if (/cli.js$/.test(process.argv[i])) {
    i++;
  }

  const arg = process.argv[i] || '';
  const slashIndex = arg.lastIndexOf('/');
  const mode = arg.slice(slashIndex !== -1 ? slashIndex + 1 : 0);
  return [modes.indexOf(mode), ...process.argv.slice(i+1)];
}

// Figure out our mode...
const [mode, ...argsRest] = getMode();
const modeName = modes[mode];
const modeArgTypes = argTypes[mode];
const modeArgNames = argTypeNames[mode];

if (mode === -1) {
  console.error('Unknown `gpstime` mode. Must be one of the following: ', modes.join(', '));
  process.exit(-1);
}

if (modeArgTypes.length !== argsRest.length) {
  console.error('Mode', modeName, 'requires', modeArgTypes.length, 'arguments, you provided', argsRest.length);
  console.error('Required args for', modeName, ':', modeArgNames.join(', '));
  process.exit(-1);
}

const parsedArgs = argsRest.map((arg, i) => modeArgTypes[i](arg));

parsedArgs.forEach(arg => {
  if (arg instanceof Error) {
    console.error('Invalid argument:', arg);
    process.exit(-1);
  }
});

const result = modeFns[mode](...parsedArgs);

if ("wn" in result && "tow" in result) {
  console.log(result.wn, result.tow);
  process.exit(0);
}
if (result instanceof Date) {
  console.log(result.toISOString());
  process.exit(0);
}

console.error('Unknown result type:', result);
process.exit(-1);
