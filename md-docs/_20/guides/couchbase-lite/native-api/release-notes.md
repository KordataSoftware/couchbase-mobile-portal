---
id: release-notes
title: Release notes
permalink: references/couchbase-lite/release-notes/index.html
---

<block class="all" />

## Deprecation notices

⚠️ The new protocol is **incompatible** with CouchDB-based databases. And since Couchbase Lite 2 only supports the new protocol, you will need to run a version of Sync Gateway that [supports it](index.html#compatibility-matrix).

## New Features

This release introduces many new APIs including N1QL queries, full-text search and automated conflict resolution. See the [Couchbase Lite](../../../couchbase-lite/index.html) guides for usage examples.

## API Changes with Couchbase Lite 1.x

- The 1.x [Manager](https://developer.couchbase.com/documentation/mobile/1.5/guides/couchbase-lite/native-api/manager/index.html) class has been removed. Top level configuration is now performed on the Database class as static methods.
- The custom conflict resolution feature has been removed. When two conflicting changes occur, the conflict will be resolved using the default conflict resolver that ships with Couchbase Lite 2.0.
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

- [Database Encryption](https://developer.couchbase.com/documentation/mobile/1.5/guides/couchbase-lite/native-api/database/index.html#story-h2-3) is not available in Couchbase Lite 2.0 but may be re-introduced in a later version of Couchbase Lite 2.x.
- The [OpenID Connect](https://developer.couchbase.com/documentation/mobile/1.5/guides/authentication/openid/index.html) authenticator API has been removed but may be re-introduced in a later version of Couchbase Lite 2.x.
- The [Listener](https://developer.couchbase.com/documentation/mobile/1.5/guides/couchbase-lite/native-api/peer-to-peer/index.html) component has been removed in Couchbase Lite 2.0. As a result, hybrid development frameworks such as Cordova and peer-to-peer replications are not supported in Couchbase Lite 2.0. Support for those features may be re-introduced in a later version of Couchbase Lite 2.x.

## Compatibility Matrix

<div class="dp">
  {% include compat-matrix.html root='../../..' %}
</div>

## EE features

The following features are available in the [Couchbase Lite Enterprise Edition](https://www.couchbase.com/downloads?family=mobile&edition=enterprise) only:

- Database replicas

<block class="all" />

## Incremental API Changes

### Beta 2 (Developer build 23)

- The Document `save` API has changed based on user feedback. There are now two variants, one which will force the write to become current (default) and one which will return `false` and abort the save if there is a conflict.
- Database encryption has been removed.

<block class="net" />

- .NET Standard 1.4 -> .NET Standard 2.0
- A mountain of bug fixes regarding replication. .NET now passes through a wide scenario of 50+ functional scenarios.
- Library is now split into two editions:  Community Edition and Enterprise Edition.  Each has its own respective license and you are required to accept the Enterprise Edition license to use (short summary:  You can use it all you like in development, but need to pay for production use).
- Xamarin platforms have been removed from GA for enterprise edition due to the unavailable bandwidth for testing, as well as .NET Core for Mac and Linux.  They are still present in Beta 2 though.

<block class="all" />

### Beta 1 (Developer build 22)

<block class="all" />

- The new replication protocol is enabled by default in Sync Gateway 2.0.
- The target URI scheme has changed from `blip://` (`blips://`) to `ws://` (`wss://`) respectively.

<block class="net" />

- More API changes to conform to internal spec (in other words, to have as close to the same signatures as Java and Swift as possible).  The final review has been completed and there are no more anticipated changes.  See [Issue 941](https://github.com/couchbase/couchbase-lite-net/issues/941) for a list of most of the changes

<block class="objc swift" />

- API Updates:
    - Expression type safe API; new literal value based expression.
    - Removed CBLFullTextIndexOptions and moved all of CBLFullTextIndexOptions's properties into CBLFullTextIndex.
    - Renamed Query and Index factory class to QueryBuilder and IndexBuilder respectively.
    - Cleaned up Swift API function labels.
- Bug fixes and performance improvement.

<block class="java" />

- API Updates:
    - Expression type safe API; new literal value based expression.
    - Renamed Query and Index factory class to QueryBuilder and IndexBuilder respectively.
    - Cleaned up Swift API function labels.
- Bug fixes and performance improvement.

<block class="all" />

<a href="../release-notes-archive/index.html">Previous Developer Builds</a>
