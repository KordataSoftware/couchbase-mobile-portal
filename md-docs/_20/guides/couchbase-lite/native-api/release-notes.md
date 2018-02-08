---
id: release-notes
title: Release notes
permalink: references/couchbase-lite/release-notes/index.html
---

<block class="all" />

## Deprecation notices

⚠️ The new protocol is **incompatible** with CouchDB-based databases. And since Couchbase Lite 2 only supports the new protocol, you will need to run a version of Sync Gateway that supports it. Refer to the Couchbase Lite [Replication API](../../../couchbase-lite/index.html) on the platform of your choice to learn more.

## New Features

This release introduces many new APIs including N1QL queries, full-text search and automated conflict resolution. See the [Couchbase Lite](../../../couchbase-lite/index.html) guides for usage examples.

## API Changes with Couchbase Lite 1.x

- The 1.x [Manager](https://developer.couchbase.com/documentation/mobile/1.5/guides/couchbase-lite/native-api/manager/index.html) class has been removed. Top level configuration is now performed on the Database class as static methods.
- Asynchronous conflict resolution: in Couchbase Lite 1.x, resolving conflicts is an optional part of the API. The API allows for multiple conflicting revisions to be stored in the database. In 2.0, a write operation will automatically invoke the conflict resolver if a conflicting revision already exists in the database.
- The [iOS Models](https://developer.couchbase.com/documentation/mobile/1.5/guides/couchbase-lite/native-api/model/index.html) API has been removed in Couchbase Lite 2.0.
- The [View](https://developer.couchbase.com/documentation/mobile/1.5/guides/couchbase-lite/native-api/view/index.html) query API has been removed and is replaced with the N1QL-like query syntax in Couchbase Lite 2.0.
- The experimental Geo query API has been removed and is replaced with the N1QL-like query syntax in Couchbase Lite 2.0.
- The [pluggable storage](https://developer.couchbase.com/documentation/mobile/1.5/guides/couchbase-lite/native-api/database/index.html#storage-engines) API has been removed.
- The [Facebook Authenticator](https://developer.couchbase.com/documentation/mobile/1.5/guides/authentication/static-providers/index.html) API has been removed.
- The [Revision](https://developer.couchbase.com/documentation/mobile/1.5/guides/couchbase-lite/native-api/revision/index.html) API is not longer available. The Couchbase Lite 2.0  conflict resolver API lets users pick which revision is the winner when a conflict occurs. There is a default conflict resolver if none are provided.
- The [Push filter](https://developer.couchbase.com/documentation/mobile/1.5/guides/couchbase-lite/native-api/replication/index.html#filtered-push-replications) API has been removed.
- The 1.x Attachment API has been renamed to Blob but the functionality remains the same.
- The 1.x `Database.inTransaction` method has been renamed to `Database.inBatch` to emphasize that Couchbase Lite does not offer transactional guarantees, and that the purpose of the method is to optimize batch operations rather than to enable ACID transactions.

## Known Issues

- The [OpenID Connect](https://developer.couchbase.com/documentation/mobile/1.5/guides/authentication/openid/index.html) authenticator API has been removed but may be re-introduced in a later version of Couchbase Lite 2.x.
- The [Listener](https://developer.couchbase.com/documentation/mobile/1.5/guides/couchbase-lite/native-api/peer-to-peer/index.html) component has been removed in Couchbase Lite 2.0. As a result, hybrid development frameworks such as Cordova and peer-to-peer replications are not supported in Couchbase Lite 2.0. Support for those features may be re-introduced in a later version of Couchbase Lite 2.x.

<block class="all" />

## Incremental API Changes

### Developer build 21

<block class="objc swift" />

- Major API updates, some highlighted changes include:
    - Database.getDocument(id) will also return nil if the document was deleted.
    - Use term ‘value’ instead of ‘object’ for value/object based type setters.
    - Allows to specify a dispatch queue for posting changes when adding a change listener. This change has applied to Database, Replicator, and Query.
    - Removed LiveQuery and Query itself can be listened for changes.
    - Reorganize Query expressions - having Meta, Array, and Full-text expression into separated classes.
    - Support Full-text match on multiple indexed properties.
- Revise all Objective-C and Swift API to inline with the standard naming convention.
- Default conflict resolver algorithm changes as follows:
    * Deletion always wins.
    * Longest generation wins or Max RevID wins if the generations are the same.
- Database is now thread safe.

<block class="java" />

- Major API updates, some highlighted changes include:
   - Database.getDocument(id) will also return nil if the document was deleted.
   - Use term `Value` instead of `Object` for `Value/Object` based typesetters.
   - Allows specifying an `Executor` for posting changes when adding a change listener. This change has applied to Database, Replicator, and Query.
   - Removed LiveQuery and Query itself can listen for changes.
   - Reorganize Query expressions - having Meta, Array, and Full-text expression into separated classes.
   - Support Full-text match on multiple indexed properties.
- Revise API to inline with the standard naming convention.
- Default conflict resolver algorithm changes as follows:
   - Deletion always wins.
   - Longest generation wins or Max RevID wins if the generations are the same.

<block class="net" />

- Fairly sweeping API changes to conform to the internal specification (in other words, to have as close to the same signatures as Java and Swift as possible).  A final review is underway and hopefully not too many more changes are needed.  Here are a few big ones:
    - Replication, Database, and IQuery `event`s are no longer events, but now have methods (with the same signature as event handlers) registered via `AddChangeListener` (with an overload to accept a `TaskScheduler`, and now where possible the support assemblies provide a main thread task scheduler for convenience).
    - `IQuery.Run()` -> `IQuery.Execute()`
    - Mutable objects `Set()`, `Add()`. and `Insert()` overloads have been renamed (`Set(string, object)` -> `SetValue(string, object)`, `Set(string, string)` -> `SetString(string, string)`, etc)
    - `Expression.Meta().ID` -> `Meta.ID`
    - Query functions that operate on arrays moved to `ArrayFunction` class
    - No more `ToLive()` function on queries, and no more `ILiveQuery`.  Queries are now automatically live if a change listener is added to them (No call to `Run()` needed for this behavior).  They will stop firing if all change listeners are removed, or they are disposed.
    - Full text searching has been fleshed out more, and `Match()` has been removed from `IExpression`.  Now the way to do it is to use `FullTextExpression.Index(string).Match(searchString)` where the `Index` argument is the name of the full text index you want to use.
    - Creating indexes now skips a step and takes arguments directly (`Index.ValueIndex().On(...)` -> `Index.ValueIndex(...)`)
    - `Fragment` and `MutableFragment` are replaced by interfaces `IFragment` and `IMutableFragment`.  The methods of getting and setting values have been converted to properties (`ToFloat()` / `SetFloat()` -> `Float`)

<block class="all" />

### Developer build 20

<block class="objc swift" />

- New Immutable Document API (Breaking API Changes)
- Bug fixes and performance improvement from LiteCore.

<block class="java" />

- Bug fixes

<block class="net" />

- **KNOWN ISSUE** Replication, and possibly other things, are broken by a Fleece deserialization bug.  This has been corrected and will be resolved as of DB021.
- The biggest change by far is the change to immutability rules.  By default, databases now return read only documents and the naming of these objects has changed.  In general, ReadOnlyXXX has become simply XXX, and XXX has become MutableXXX.  For example, ReadOnlyDocument has become Document, and Document has become MutableDocument.  To create a mutable document from a non-mutable one, use the `ToMutable()` function.  Mutable documents will not have any concurrency guarantees, but non-mutable ones will.  
- Couchbase.Lite.Support.NetDesktop has been changed so that it is no longer a .NET Standard 1.4 library, but a multi-targeted .NET Core 1.0+ / .NET Framework 4.6.1+ library.  There was a needed API that was not available in the .NET Standard 1.4 API, but moving the .NET Standard version up would have lost 4.6.1 support.  The assembly is still compatible with its intended targets.
- Fixes bugs: #925, #926, and other issues uncovered during testing

<block class="all" />

### Developer build 19

<block class="objc swift" />

- Fixed Replicator’s uncleaned socket disconnect warning (#1937).
- Fixed Session Cookie being overwritten (#1943).
- Fixed Carthage build failure on DB019 (#1947).
- Reimplemented Fragment API - API is now more light weight and has better performance.
- Improved performance of read/write document data with Mutable Fleece.

<block class="net" />

- `IReadOnlyDictionary` / `IDictionaryObject`, `IReadOnlyArray` / `IArray` now return `Dictionary<string, object>` and `List<object>` instead of `IDictionary<string, object>` and `IList<object>` so that the return value can be used in both read only and read write interface signatures (e.g. both `Foo(IDictionary<string, object>` and `Foo(IReadOnlyDictionary<string, object>`)
- Ensure that calls to `Activate` are only performed once (unclear on the impact on Android if the passed activity gets destroyed)

<block class="java" />

- Bug fixes

<block class="all" />

### Developer build 18

<block class="objc swift" />

- Added headers property to ReplicatorConfiguration for adding additional HTTP headers when sending HTTP requests to a remote server.
- Fixed invalid CFBundleShortVersionString.
- Updated Lite Core to uptake the following fixes:
    - Fixed replicator crashes when stopping replicator immediately after starting.
    - Fixed replicator staying in BUSY status after finish replicating.
    - Allowed MATCH operator nested inside multiple ANDs.

<block class="java" />

- Bug fixes

<block class="net" />

- Slight refactor to `ReplicatorConfiguration` (Put `Options` properties directly into the configuration) to bring it inline with other platforms
- Fix a bug in `SelectResult.All()` which would cause invalid queries if a `From` clause was added
- LiteCore bug fixes
- Bug fixes: [907](https://github.com/couchbase/couchbase-lite-net/issues/907) [912](https://github.com/couchbase/couchbase-lite-net/issues/912) [916](https://github.com/couchbase/couchbase-lite-net/issues/916)

<block class="all" />


### Developer build 17

<block class="net" />

- Simplify encryption API.  `IEncryptionKey` is now `EncryptionKey` (class instead of factory)
- Overhaul logging, API change from setting levels via `Log.Domains` to `Database.SetLogLevels` and flags.  Domains reduced.
- No text logging by default.  Text logging (to a default location depending on platform) can be enabled by calling `EnableTextLogging()` inside of the relevant support class (e.g. Couchbase.Lite.Support.UWP).  All logging will go to a binary file in the default directory for a given platform (as determined by `IDefaultDirectoryResolver`).

<block class="java" />

- Bug fixes

<block class="all" />

### Developer build 16

<block class="objc swift" />

- Support Database Encryption
- Implement a new index API
- Move FTS.rank expression to Function.rank()
- Make Replicator's User-Agent header that includes information about library version and platform.

<block class="java" />

- Thread-safe with Database operation. (Other operations will be a thread-safe with next DB release)

<block class="net" />

- Collation API now supported on Android
- Redid Index API (indexes are now identified by name).  See the new `Index` class documentation.
- Encryption is now supported.  Encryption keys can be added onto the `DatabaseConfiguration` class.  This will encrypt database files and attachments.
- Added in a `rank()` function for `IExpression` to order by FTS ranking result
- Made a consistent User-Agent string that gets info on which platform is running
- Changed the default Collation locale to be the one currently running on device

<block class="all" />

### Developer build 15

<block class="objc swift" />

- Support Collation Expression.
- Support FTS Ranking Value Expression.
- Support database copy to allow to install a canned database.
- Allow to set logging level.

<block class="java" />

* Thread-safe with Database operation. (Other operations will be a thread-safe with next DB release)

<block class="net" />

- Collation API now supported on Linux platforms (Android coming soon)
- Statically compile, so iOS 9 will work now
- Add a database copy API (note:  current behavior will replace an existing database, but this may change) to make copies of a database (useful for seeding and/or backup).

<block class="all" />

### Developer build 14

<block class="objc swift" />

* Support Select all properties.
* Support Quantified expression (Any, AnyAndEvery, and Every).
* Support Query's isNullOrMissing expression.
* Support more Query functions including array, mathematics, string, and type functions.
* Support type setters on Document, Dictionary, Array, and Query's parameters.
* Support Int64 getter on Document, Dictionary, Array.
* Added Connecting and Offline to the Replicator's ActivityLevel status.

<block class="net" />

- Select all properties via `SelectResult.All()`
- Lots of new functions (Check the `Function` class) for use in querying
- Collection functions (Any / Every / AnyAndEvery) for running predicates on array items during query
- Collation API (see `Collation` class) for locale and language based sorting of strings
- Typed setter functions (`SetString`, `SetInt`, etc) and added `GetFloat` for completion
- Expanded the replicator statuses

<block class="java" />

* Support Select all properties.
* Support Quantified expression (Any, AnyAndEvery, and Every).
* Support Query's isNullOrMissing expression.
* Support more Query functions including array, mathematics, string, and type functions.
* Support type setters on Document, Dictionary, Array, and Query's parameters.

<block class="all" />

### Developer build 13

<block class="objc swift" />

* Support query projection with alias names
* CBLQuery returns CBLQueryResultSet<CBLQueryResult> instead of NSEnumerator<CBLQueryRow>. Same for Swift, Query return ResultSet<Result> instead of QueryIterator<QueryRow>. CBLQueryRow is still used by CBLPredicateQuery.
* CBLQueryResult supports get values both by indexes and by keys. Same for Result in Swift.
* CBLDocument.documentID -> CBLDocument.id
* Bug fixes : [#1819](https://github.com/couchbase/couchbase-lite-ios/issues/1819), [#1824](https://github.com/couchbase/couchbase-lite-ios/issues/1824), [#1825](https://github.com/couchbase/couchbase-lite-ios/issues/1825), [#1835](https://github.com/couchbase/couchbase-lite-ios/issues/1835)

<block class="java" />

* More Query API -> Meta, Limit, Offset
* Changed CouchbaseLiteException extends from Exception instead of RuntimeException

<block class="net" />

* Queries can now make use of `Limit()` and `Offset()`
* *The internal synching mechanism has been altered in a breaking way*.  With this release you need to use Sync Gateway 1.5.0-477 or higher.
* `SelectResult` can now use `As` to create an alias for that particular column
* Columns can now be accessed by key instead of just by index (by default the key is the last element of the property name that was selected [e.g. contact.address.city -> city], or an arbitrary 1-based index string $1, $2, $3, etc for rows that are not based on a property such as min, sum, etc.  If an alias is provided, that will be used instead)
* Corrected a silly spelling mistake (`Support.NetDestkop`-> `Support.NetDesktop`)
* Removed `DocumentID`, `Document`, etc from `IQueryRow` and use `IResult` instead (see docs\examples\Program.cs for how to get the Document or ID, but `Document` might make a comeback before GA)

<block class="all" />

### Developer build 12

<block class="objc swift" />

* Unify change event API for Database, Replicator, and LiveQuery by using block
* More Replicator API -> Channel and DocumentID
* More Query API -> Aggregate Functions, OrderBy, GroupBy / Having, Join, Projection, Parameters, Meta

<block class="net" />

* More Query API -> GroupBy, Having, Select items, Join, Functions, Parameters, Meta

<block class="java" />

* More Replicator API -> Cookie support, Certificate pinning, immediate conflict resolving for pull replication, Channel/DocID filter
* More Query API -> GroupBy, Having, Select items, Join, Functions, Parameters

<block class="all" />

### Developer build 11

<block class="java objc swift net" />

* LiveQuery
* Authentication for Replicator 

<block class="all" />

### Developer build 10

<block class="objc" />

* Fixed replicator not correctly encoding documents when it saves the documents
* Added an ability to pin server certificate to a replicator
* Fixed custom functions not being registered in all opened SQLite connections
* Fixed unused blobs not being garbaged after compacting a database

<block class="swift" />

* Added an ability to pin server certificate to a replicator
* Fixed custom functions not being registered in all opened SQLite connections
* Fixed unused blobs not being garbaged after compacting a database
* Fixed replicator not correctly encoding documents when it saves the documents

<block class="net" />

* ReplicationOptions -> ReplicatorConfiguration
* IReplication -> Replicator
* TLS support for replication (blips)
* HTTP Basic auth support for replication (via `ReplicationOptionsDictionary` -> 'AuthOptionsDictionary`).  This API will probably change.
* Online / offline network change handling
* Channel replication support (waiting on SG fix)
* Make DI system public to allow third party support assemblies

<block class="java" />

* Replication API
* Replicator - Basic Authentication
* Replicator - Online / Offline network change handling
* Fixed replicator not correctly encoding documents when it saves the documents

<block class="all" />

### Developer build 8

<block class="objc" />

* CBLDatabaseOptions -> CBLDatabaseConfiguration
* New DocumentChangeNotification implementation
* CBLArray optimization
* New Replicator API with Online / Offline support
* LiveQuery support
* Minor changes to CBLDatabase and CBLDocument API including
  - CBLDatabase.compact()
  - CBLDatabase.count()
  - CBLDatabase.contains(id)
  - CBLDictionary.remove(key)
  - CBLDictionary nil value support

<block class="swift" />

* DatabaseOptions -> DatabaseConfiguration
* New DocumentChangeNotification implementation
* ArrayObject optimization
* New Replicator API with Online / Offline support
* LiveQuery support
* Minor changes to Database and Document API including
  - Database.compact()
  - Database.count()
  - Database.contains(id)
  - DictionaryObject.remove(key)
  - DictionaryObject nil value support

<block class="net" />

- New APIs on Database such as `Count` and `Compact()`
- DatabaseOptions -> DatabaseConfiguration
- New native library delivery mechanism (transparent, but now requires `Activate` call on .NET and .NET Core via `Couchbase.Lite.Support.NetDesktop.Activate()`)

<block class="java" />

- New APIs on Database such as `count()`, `compact()` and contains(String id)
- New APIs on Dictionary such as `remove(String key)`
- DatabaseOptions -> DatabaseConfiguration
- Bug fixes

<block class="all" />

### Developer build 7

<block class="objc" />

- New unified API for CBLDocument, CBLReadOnlyDocument, CBLDictionary, CBLReadOnlyDictionary, CBLArray, CBLReadOnlyArray.
- Replaced CBLSubdocument with CBLDictionary.
- Removed DocumentChangeNotification from CBLDocument. The DocumentChangeNotification will be reimplemented at the Database level in the next release.
- New ConflictResolver API that take a single Conflict object as a parameter. The target, source, and commonAncestor property are ReadOnlyDocument object.
- Bug fixes and performance improvement from LiteCore.

<block class="swift" />

- New unified API for Document, ReadOnlyDocument, DictionaryObject, ReadOnlyDictionaryObject, ArrayObject, ReadOnlyArrayObject.
- Replaced Subdocument with DictionaryObject.
- Removed DocumentChangeNotification from Document. The DocumentChangeNotification will be reimplemented at the Database level in the next release.
- Bug fixes and performance improvement from LiteCore.

<block class="net" />

- A new unified and simpler API
- Finally, the public replication API for creating replications!

<block class="java" />

- A new unified and simpler API

<block class="all" />


### Developer build 6

<block class="java" />

- Database & Document Notification

### Developer build 5

<block class="objc" />

- Support replicating attachments
- Support automatic 1.x database upgrade to 2.0

<block class="swift" />

- Support replicating attachments
- Support automatic 1.x database upgrade to 2.0
- Fixed Swift replication delegate not functional (#1699)

<block class="net" />

- Replication! The new replicator is faster, but the protocol has changed, and the class API isn't yet finalized.  Also, unfortunately there is no public way to create replications yet but this will come soon.  
- Support automatic 1.x database upgrade to 2.0.  
- Various other optimizations under the hood.

<block class="java" />

- Blob
- Conflict Resolver

<block class="all" />

### Developer build 4

<block class="objc" />

- Replication! The new replicator is faster, but the protocol has changed, and the class API isn't yet finalized. Please read the documentation for details.

<block class="swift" />

- Cross platform Query API
- Replication! The new replicator is faster, but the protocol has changed, and the class API isn't yet finalized. Please read the documentation for details.

<block class="net" />

- Cross platform Query API

<block class="java" />

- CRUD operations
- Document with property type accessors
- Cross platform Query API

<block class="all" />

### Developer build 3

<block class="objc" />

- Cross platform Query API

<block class="swift" />

N/A

<block class="csharp" />

- Sub-document API
- Some taming of the dispatch queue model. (A database gets a queue and all the objects associated with it share the same one. Callback queue has been removed, and callbacks now come over the action queue so that it is safe to access the DB directly from the callback). Thread safety checking has been made optional (default OFF) and can be enabled in the DatabaseOptions class.

<block class="java" />

N/A

<block class="all" />

### Developer build 2

<block class="swift" />

- CouchbaseLiteSwift framework for the Swift API

<block class="objc" />

- Sub-document API

<block class="csharp" />

- CRUD operations
- Document with property type accessors
- Blob data type
- Database and Document Change Notification

<block class="java" />

N/A

<block class="all" />

### Developer build 1

<block class="objc" />

- CRUD operations
- Document with property type accessors
- Blob data type
- Database and Document Change Notification
- Query
	- NSPredicate based API
	- Grouping and Aggregation support

<block class="swift" />

N/A

<block class="csharp" />

N/A

<block class="java" />

N/A
