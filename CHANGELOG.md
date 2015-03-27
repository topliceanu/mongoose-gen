# Changelog

## Version 2.1.0 - Mar 27, 2015
* Enhancement: introduce support for Object type in schema definitions.

## Version 2.0.0 - Jan 27, 2015
* Fix bug: an instance of mongoose.Schema is somehow linked to the connection instance so it cannot be used for other connections.
* `.getSchema()` now requires an instance of mongoose.Connection

## Version 1.0.2 - Jan 27, 2015
* Fix nasty bug.

## Version 1.0.1 - Jan 27, 2015
* Support for nested documents in json schemas.
* Add jshint task for codebase and tests.
* Add examples to the repo

## Version 1.0.0 - Jan 27, 2015
* General cleanup of the api, implementation and tests.
* Better interoperation with mongoose
* __NOTE__ this module uses [semver](http://semver.org/) and thus this version is not backwards compatible with previous ones.

## Version 0.0.3 - Mar 20, 2013
* A long time ago!
