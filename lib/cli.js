#!/usr/bin/env node --harmony
"use strict";

var _index = require("./index");

var utils = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

var modes = ["current-gps-wn-tow", "utc-to-wn-tow", "gps-to-wn-tow", "wn-tow-to-utc", "wn-tow-to-gps", "utc-to-gps", "gps-to-utc"];

function iso8601(s) {
  var ts = Date.parse(s);
  if (isNaN(ts)) {
    return new Error('invalid iso8601 string: ' + s);
  }
  return new Date(s);
}

function strictParseInt(s) {
  var n = parseInt(s);
  if (isNaN(n)) {
    return new Error('invalid integer: ' + s);
  }
  return n;
}

var argTypes = [[], [iso8601], [iso8601], [strictParseInt, strictParseInt], [strictParseInt, strictParseInt], [iso8601], [iso8601]];

var argTypeNames = [[], ['iso8601'], ['iso8601'], ['week number (wn)', 'time of week (tow)'], ['week number (wn)', 'time of week (tow)'], ['iso8601'], ['iso8601']];

var modeFns = [utils.currentGpsWnTow, utils.utcTimestampToWnTow, utils.gpsTimestampToWnTow, utils.wnTowToUtcTimestamp, utils.wnTowToGpsTimestamp, utils.utcTimestampToGpsTimestamp, utils.gpsTimestampToUtcTimestamp];

function getMode() {
  var i = 0;
  if (/node$/.test(process.argv[i])) {
    i++;
  }
  if (/cli.js$/.test(process.argv[i])) {
    i++;
  }

  var arg = process.argv[i] || '';
  var slashIndex = arg.lastIndexOf('/');
  var mode = arg.slice(slashIndex !== -1 ? slashIndex + 1 : 0);
  return [modes.indexOf(mode)].concat(_toConsumableArray(process.argv.slice(i + 1)));
}

// Figure out our mode...

var _getMode = getMode(),
    _getMode2 = _toArray(_getMode),
    mode = _getMode2[0],
    argsRest = _getMode2.slice(1);

var modeName = modes[mode];
var modeArgTypes = argTypes[mode];
var modeArgNames = argTypeNames[mode];

if (mode === -1) {
  console.error('Unknown `gpstime` mode. Must be one of the following: ', modes.join(', '));
  process.exit(-1);
}

if (modeArgTypes.length !== argsRest.length) {
  console.error('Mode', modeName, 'requires', modeArgTypes.length, 'arguments, you provided', argsRest.length);
  console.error('Required args for', modeName, ':', modeArgNames.join(', '));
  process.exit(-1);
}

var parsedArgs = argsRest.map(function (arg, i) {
  return modeArgTypes[i](arg);
});

parsedArgs.forEach(function (arg) {
  if (arg instanceof Error) {
    console.error('Invalid argument:', arg);
    process.exit(-1);
  }
});

var result = modeFns[mode].apply(modeFns, _toConsumableArray(parsedArgs));

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