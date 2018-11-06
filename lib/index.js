'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gpsTimestampToWnTow = gpsTimestampToWnTow;
exports.utcTimestampToWnTow = utcTimestampToWnTow;
exports.wnTowToUtcTimestamp = wnTowToUtcTimestamp;
exports.wnTowToGpsTimestamp = wnTowToGpsTimestamp;
exports.gpsTimestampToUtcTimestamp = gpsTimestampToUtcTimestamp;
exports.utcTimestampToGpsTimestamp = utcTimestampToGpsTimestamp;
exports.currentGpsWnTow = currentGpsWnTow;
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

// Unix timestamp of the GPS epoch 1980-01-06 00:00:00 UTC
var gpsEpochSeconds = 315964800;

// number of seconds in a week
var weekSeconds = 60 * 60 * 24 * 7;
var daySeconds = 60 * 60 * 24;

// Leap UTC leap seconds since epoch (1970). UTC/GPS/Unix epoch starts with
// a +10 leap second offset relative to TAI. There are UTC 10 leap seconds before
// the first GPS time (not listed here).
var gpsLeapSeconds = [new Date('1981-07-01T00:00:00.000Z'), new Date('1982-07-01T00:00:00.000Z'), new Date('1983-07-01T00:00:00.000Z'), new Date('1985-07-01T00:00:00.000Z'), new Date('1988-01-01T00:00:00.000Z'), new Date('1990-01-01T00:00:00.000Z'), new Date('1991-01-01T00:00:00.000Z'), new Date('1992-07-01T00:00:00.000Z'), new Date('1993-07-01T00:00:00.000Z'), new Date('1994-07-01T00:00:00.000Z'), new Date('1996-01-01T00:00:00.000Z'), new Date('1997-07-01T00:00:00.000Z'), new Date('1999-01-01T00:00:00.000Z'), new Date('2006-01-01T00:00:00.000Z'), new Date('2009-01-01T00:00:00.000Z'), new Date('2012-07-01T00:00:00.000Z'), new Date('2015-07-01T00:00:00.000Z'), new Date('2017-01-01T00:00:00.000Z')].reverse();

/**
 * Convert GPS Date timestamp (in GPS time, without leap seconds) to { wn, tow }.
 *
 * If you have a UTC timestamp, use `utcTimestampToWnTow`.
 *
 * @param {Date} gpsTimestamp - A timestamp representing a GPS timestamp, without leap-seconds.
 * @return {object} { wn, tow }
 */
function gpsTimestampToWnTow(gpsTimestamp) {
  var gpsTimeMs = gpsTimestamp.getTime() / 1000 - gpsEpochSeconds;
  var wn = Math.floor(gpsTimeMs / weekSeconds);
  var tow = gpsTimeMs - wn * weekSeconds;
  var dow = Math.floor(tow / daySeconds);
  return { wn: wn, dow: dow, tow: tow };
}

/**
 * Convert UTC Date timestamp to { wn, tow }.
 *
 * @param {Date} utcTimestamp - A timestamp, with GPS leap-seconds.
 * @return {object} { wn, tow }
 */
function utcTimestampToWnTow(utcTimestamp) {
  return gpsTimestampToWnTow(utcTimestampToGpsTimestamp(utcTimestamp));
}

/**
 * Convert GPS tow (time of week) and wn (week number) to timestamp (in UTC time,
 * with leap seconds).
 *
 * @param {Number} wn - GPS week number
 * @param {Number} tow - GPS time of week, seconds (fractional seconds okay)
 * @returns {Date} - A `Date` object representing a UTC timestamp, with leap-seconds.
 */
function wnTowToUtcTimestamp(wn, tow) {
  return gpsTimestampToUtcTimestamp(wnTowToGpsTimestamp(wn, tow));
}

/**
 * Convert GPS tow (time of week) and wn (week number) to moment timestamp (in GPS time,
 * without leap seconds).
 *
 * @param {Number} wn - GPS week number
 * @param {Number} tow - GPS time of week, seconds (fractional seconds okay)
 * @returns {Date} - A `Date` object representing a GPS timestamp, without leap-seconds.
 */
function wnTowToGpsTimestamp(wn, tow) {
  return new Date((gpsEpochSeconds + weekSeconds * wn + tow) * 1000);
}

/**
 * Convert GPS timestamp without leap seconds to a UTC timestamps with leap seconds.
 *
 * @param {Date} timestamp - A `moment` object representing a GPS timestamp, w/o leap-seconds.
 * @returns {Date} - A `moment` object representing a UTC timestamp, with leap-seconds.
 */
function gpsTimestampToUtcTimestamp(gpsTimestamp) {
  // Get lastIndex for which our gpsTimestamp is greater
  var lastIndex = void 0;
  for (lastIndex = 0; lastIndex < gpsLeapSeconds.length; ++lastIndex) {
    if (gpsTimestamp - gpsLeapSeconds[lastIndex] > 0) {
      break;
    }
  }

  var leapSecondsOffset = gpsLeapSeconds.length - lastIndex;

  return new Date(gpsTimestamp.getTime() - leapSecondsOffset * 1000);
}

/**
 * Convert UTC timestamp with leap seconds to a GPS timestamps without leap seconds.
 *
 * @param {Date} timestamp - A `moment` object representing a GPS timestamp, w/o leap-seconds.
 * @returns {Date} - A `moment` object representing a UTC timestamp, with leap-seconds.
 */
function utcTimestampToGpsTimestamp(utcTimestamp) {
  // Get lastIndex for which our gpsTimestamp is greater
  var lastIndex = void 0;
  for (lastIndex = 0; lastIndex < gpsLeapSeconds.length; ++lastIndex) {
    if (utcTimestamp - gpsLeapSeconds[lastIndex] > 0) {
      break;
    }
  }

  var leapSecondsOffset = gpsLeapSeconds.length - lastIndex;

  return new Date(utcTimestamp.getTime() + leapSecondsOffset * 1000);
}

/**
 * Convert UTC timestamp with leap seconds to a GPS timestamps without leap seconds.
 *
 * @param {Date} timestamp - A `moment` object representing a GPS timestamp, w/o leap-seconds.
 * @returns {Date} - A `moment` object representing a UTC timestamp, with leap-seconds.
 */
function currentGpsWnTow() {
  return utcTimestampToWnTow(new Date());
}
