const assert = require('assert');
const timeUtils = require('../lib/index.js');

describe('gps time converter', () => {
  it('should convert times to correct UTC time (1)', () => {
    const expected = '2016-07-15T17:18:44.000Z';
    const actual = timeUtils.wnTowToUtcTimestamp(1905, 494341).toISOString();
    assert.equal(actual, expected);
  });
  it('should convert times to correct UTC time (2)', () => {
    const expected = '2016-08-07T04:17:01.000Z';
    const actual = timeUtils.wnTowToUtcTimestamp(1909, 15438).toISOString();
    assert.equal(actual, expected);
  });
  it('should convert times to correct UTC time, pre-2015 leap second', () => {
    const expected = '2014-08-07T04:17:02.000Z';
    const actual = timeUtils.wnTowToUtcTimestamp(1804, 361038).toISOString();
    assert.equal(actual, expected);
  });
  it('should convert times to correct UTC time, pre-2012 leap second', () => {
    const expected = '2011-08-07T04:17:03.000Z';
    const actual = timeUtils.wnTowToUtcTimestamp(1648, 15438).toISOString();
    assert.equal(actual, expected);
  });
  it('should convert times to correct UTC time, pre-2009, 2006 leap seconds', () => {
    const expected = '2000-08-07T04:17:05.000Z';
    const actual = timeUtils.wnTowToUtcTimestamp(1074, 101838).toISOString();
    assert.equal(actual, expected);
  });
  it('should convert times to correct UTC time, 0 tow / 0 wn', () => {
    const expected = '1980-01-06T00:00:00.000Z';
    const actual = timeUtils.wnTowToUtcTimestamp(0, 0).toISOString();
    assert.equal(actual, expected);
  });
  it('should convert sample time from http://www.leapsecond.com/java/gpsclock.htm', () => {
    const expected = '2016-08-07T04:34:09.000Z';
    const actual = timeUtils.wnTowToUtcTimestamp(1909, 16466).toISOString();
    assert.equal(actual, expected);
  });

  it('UTC time and GPS time should be offset by leap seconds', () => {
    const expected = 17 * 1000;
    const utcTime = timeUtils.wnTowToUtcTimestamp(1905, 494341);
    const gpsTime = timeUtils.wnTowToGpsTimestamp(1905, 494341);
    const actual = gpsTime - utcTime;
    assert.equal(actual, expected);
  });
});

describe('gps timestamps to wn/tow', () => {
  it('should convert epoch date to 0, 0', () => {
    const timestamp = new Date('1980-01-06T00:00:00.000Z');
    const actual = timeUtils.gpsTimestampToWnTow(timestamp);
    const expected = { wn: 0, tow: 0 };

    assert.deepEqual(actual, expected);
  });
  it('should convert more recent time', () => {
    const timestamp = new Date('2000-08-07T04:17:05.000Z');
    const actual = timeUtils.gpsTimestampToWnTow(timestamp);
    const expected = { wn: 1074, tow: 101825 };

    assert.deepEqual(actual, expected);
  });
});

describe('utc timestamps to wn/tow', () => {
  it('should convert epoch date to 0, 0', () => {
    const timestamp = new Date('1980-01-06T00:00:00.000Z');
    const actual = timeUtils.utcTimestampToWnTow(timestamp);
    const expected = { wn: 0, tow: 0 };

    assert.deepEqual(actual, expected);
  });
  it('should convert more recent time', () => {
    const timestamp = new Date('2000-08-07T04:17:05.000Z');
    const actual = timeUtils.utcTimestampToWnTow(timestamp);
    const expected = { wn: 1074, tow: 101838 };

    assert.deepEqual(actual, expected);
  });
});

describe('get current wn/tow', () => {
  it('should get current week number and tow', () => {
    const { wn, tow } = timeUtils.currentGpsWnTow();
    const { wn: expectedWn, tow: expectedTow } = timeUtils.utcTimestampToWnTow(new Date());

    assert(wn >= 1916);

    assert.equal(wn, expectedWn);
    assert.equal(tow, expectedTow);
  });
});

describe('roundtrip times', () => {
  it('utc to wn/tow and back', () => {
    const utcTime = new Date();
    const { wn, tow } = timeUtils.utcTimestampToWnTow(utcTime);

    assert.equal(utcTime.getTime(), timeUtils.wnTowToUtcTimestamp(wn, tow).getTime());
  });
  it('utc to gps back', () => {
    const utcTime = new Date();
    const gpsTime = timeUtils.utcTimestampToGpsTimestamp(utcTime);

    assert.equal(utcTime.getTime(), timeUtils.gpsTimestampToUtcTimestamp(gpsTime).getTime());
  });
  it('gps to wn/tow and back', () => {
    const utcTime = new Date();
    const gpsTime = timeUtils.utcTimestampToGpsTimestamp(utcTime);
    const { wn, tow } = timeUtils.gpsTimestampToWnTow(gpsTime);

    assert.equal(gpsTime.getTime(), timeUtils.wnTowToGpsTimestamp(wn, tow).getTime());
  });
});
