# Upcoming Newsletter Events

This website shows upcoming events from the public Firestore `events`
collection in lists that can be copied into a monthly newsletter. The active
[Lansing Codes website](https://github.com/lansingcodes/website) maintains the
event collection.

## Local development

The site is served directly by GitHub Pages; no build step or deployment
change is needed. Run `npm start` for a local static server. Use Node.js 24
and run `npm ci && npm test` to check the month query, Firestore response
parsing, and safe event link rendering. `vendor/moment.min.js` is the local
Moment 2.31.0 browser build, with its license alongside it.

## Code of Conduct

All participants are expected to treat others with respect and follow our
[Code of Conduct](https://www.lansing.codes/code-of-conduct/).

## Questions

For general support, direct your questions to the
[Lansing Codes Slack team](http://slack.lansing.codes). The issue list for this
project is exclusively for bug reports and feature requests.

## Stay in touch

- [Slack](http://slack.lansing.codes)
- [Twitter](https://twitter.com/lansingcodes)
- [Facebook](https://www.facebook.com/lansingcodes)
- [Website](https://www.lansing.codes)
- [Newsletter](http://bit.ly/lansing-codes-newsletter)

## License

[Hippocratic 2.1](https://firstdonoharm.dev)

Copyright (c) 2020-Present, Humanity Codes LLC
