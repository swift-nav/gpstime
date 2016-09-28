# gpstime
Some simple GPS time-related utilities for JavaScript.

# Terms, and purpose
GPS time is measured using a "week number" (or WN) and a "time of week" (or TOW). See more information [here][csgnetwork-gpstime].

GPS time started in January 1980, and does not account for leap seconds like UTC time does. There have been 17 leap seconds in UTC time
since 1980, so GPS time is ahead of UTC by 17 seconds.

This library has utilities for converting UTC and GPS-relative `Date` objects to `{ wn, tow }` pairs and back.

# CLI Usage
`gpstime` also comes with a few handy CLI tools:

* `current-gps-wn-tow` returns the current week number and TOW.
* `utc-to-wn-tow` accepts a single argument, an ISO8601-formatted UTC date string, and returns the corresponding week number and TOW.
* `gps-to-wn-tow` accepts a single argument, an ISO8601-formatted GPS-relative date string, and returns the corresponding week number and TOW.
* `wn-tow-to-utc` accepts a week number and TOW, and returns an ISO8601-formatted date string representing the UTC time.
* `wn-tow-to-gps` accepts a week number and TOW, and returns an ISO8601-formatted date string representing the GPS-relative time.
* `utc-to-gps` accepts a single argument, an ISO8601-formatted UTC date string, and returns an ISO8601-formatted GPS-relative date string.
* `gps-to-utc` accepts a single argument, an ISO8601-formatted GPS-relative date string, and returns an ISO8601-formatted UTC date string.

## Examples

```
$ current-gps-wn-tow
1916 327239.06999993324
$ utc-to-wn-tow 2016-09-28T18:43:25.208Z
1916 326622.2079999447
$ gps-to-wn-tow 2016-09-28T18:43:25.208Z
1916 326605.2079999447
$ utc-to-gps 2016-09-28T18:43:25.208Z
2016-09-28T18:43:42.208Z
$ utc-to-gps 2016-09-28T18:43:25.208Z
2016-09-28T18:43:42.208Z
$ gps-to-utc 2016-09-28T18:43:25.208Z
2016-09-28T18:43:08.208Z
```

# Functions

The following functions are available:

* `utcTimestampToWnTow` - takes a `Date` object and returns GPS time as `{ wn, tow }` dictionary.
* `gpsTimestampToWnTow` - takes a `Date` object and returns GPS time as `{ wn, tow }` dictionary. Assumes that this object is in GPS time, without accounting for leap seconds.
* `wnTowToUtcTimestamp` - takes a GPS week number and TOW, and returns a `Date` object in UTC time, with leap-seconds accounted.
* `wnTowToGpsTimestamp` - takes a GPS week number and TOW, and returns a `Date` object in GPS-relative time, without leap-seconds accounted.
* `utcTimestampToGpsTimestamp` - takes a UTC timestamp and removes leap-seconds from it, returning a GPS-relative timestamp.
* `gpsTimestampToUtcTimestamp` - takes a GPS timestamp and adds leap-seconds from it, returning a UTC timestamp.
* `currentGpsWnTow` - convenience function that returns the current time as `{ wn, tow }`.

# Install

You can use these utilities programatically or via the CLI.

To install globally:

```bash
npm install -g gpstime
```

Or to save it to a project:

```bash
npm install --save gpstime
```

# License

MIT license. See `LICENSE` file.

[csgnetwork-gpstime]: http://www.csgnetwork.com/gpstimeconv.html
