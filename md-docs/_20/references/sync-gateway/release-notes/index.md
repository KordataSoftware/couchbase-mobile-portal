---
id: sg-release-notes
title: SG release notes
redirect_from:
  - guides/sync-gateway/bucket-shadowing/index.html
---

## Deprecation notices

The following features are being deprecated and will be unsupported in an upcoming version of Sync Gateway.

- **Bucket shadowing** has been deprecated since 1.4 and has now become unsupported. The recommended approach to perform operations on a bucket dedicated to Couchbase Mobile is to enable [shared bucket access](../../../guides/sync-gateway/shared-bucket-access.html).

## New Features

### No Conflicts Mode

Sync Gateway 2.0 can be run in "no conflicts mode". When running in this mode, Sync Gateway will reject any updates that would otherwise create a conflict.  When using Couchbase Lite 2.0, these conflicts can be automatically detected and resolved by the client.

Details on how to configure this mode, along with additional information, is included at ([`databases.$db.allow_conflicts`](../../../guides/sync-gateway/config-properties/index.html#2.0/databases-foo_db-allow_conflicts)).

### Data Lifecycle Management

An expiry value can now be set for Couchbase Lite replication checkpoints (and local documents more generally), allowing users to configure how long these are retained. By default they will be retained for 90 days, but this can be customized using  ([`databases.$db.local_doc_expiry_secs`](../../../guides/sync-gateway/config-properties/index.html#2.0/databases-foo_db-local_doc_expiry_secs)).

Document expiry can now be set using the Sync Function. A new built-in function, ([`expiry()`](../../../guides/sync-gateway/sync-function-api-guide/index.html#expiry)) can be used to set the Couchbase Server expiry for the document.

## Upgrading

Starting in Sync Gateway 2.0, Sync Gateway’s design documents include the version number in the design document name. In this release for example, the design documents are named `_design/sync_gateway_2.0` and `_design/sync_housekeeping_2.0`.

On startup, Sync Gateway will check for the existence of these design documents, and only attempt to create them if they do not already exist. Then, Sync Gateway will wait until views are available and indexed before starting to serve requests. To evaluate this, Sync Gateway will issue a `stale=false&limit=1` query against the Sync Gateway views (channels, access and role_access).

If the view request exceeds the default timeout of 75s (which would be expected when indexing large buckets), Sync Gateway will log additional messages and retry. The logging output will look like this:

```bash
14:26:41.039-08:00 Design docs for current SG view version (2.0) found.
14:26:41.039-08:00 Verifying view availability for bucket default...
14:26:42.045-08:00 Timeout waiting for view "access" to be ready for bucket "default" - retrying...
14:26:42.045-08:00 Timeout waiting for view "channels" to be ready for bucket "default" - retrying...
14:26:42.045-08:00 Timeout waiting for view "role_access" to be ready for bucket "default" - retrying...
14:26:44.065-08:00 Timeout waiting for view "access" to be ready for bucket "default" - retrying...
14:26:44.065-08:00 Timeout waiting for view "role_access" to be ready for bucket "default" - retrying...
14:26:44.065-08:00 Timeout waiting for view "channels" to be ready for bucket "default" - retrying...
14:26:44.072-08:00 Views ready for bucket default.
```

Sync Gateway 2.0 will **not** automatically remove the previous design documents. Removal of the obsolete design documents is done via a call to the new  [`/_post_upgrade`](../admin-rest-api/index.html#/server/post__post_upgrade) endpoint in Sync Gateway’s Admin REST API. This endpoint can be run in preview mode (`?preview=true`) to see which design documents would be removed. To summarize, the steps to perform an upgrade to Sync Gateway 2.0 are:

1. Upgrade one node in the cluster to 2.0, and wait for it to be reachable via the REST API (for example at [http://localhost:4985/](http://localhost:4985/)).
2. Upgrade the rest of the nodes in the cluster.
3. Clean up obsolete views:
	- **Optional** Issue a call to `/_post_upgrade?preview=true` on any node to preview which design documents will be removed. To upgrade to 2.0, expect to see "sync_gateway" and "sync_housekeeping" listed.
	- Issue a call to `/_post_upgrade` to remove the obsolete design documents. The response should indicate that "sync\_gateway" and "sync\_housekeeping" were removed.

## GitHub issues

__Performance Improvements__

- [__#1850__](https://github.com/couchbase/sync_gateway/issues/1850) Avoid duplicate parsing of HTTP query string
- [__#2871__](https://github.com/couchbase/sync_gateway/issues/2871) Review bucket_gocb concurrent op limits
- [__#2928__](https://github.com/couchbase/sync_gateway/issues/2928) Optimize document unmarshalling for GetDoc
- [__#3102__](https://github.com/couchbase/sync_gateway/issues/3102) Use rev cache for _changes w/ include_docs

__Enhancements__

- [__#744__](https://github.com/couchbase/sync_gateway/issues/744) When try to put nonexistent document with rev: Document revision conflict
- [__#1280__](https://github.com/couchbase/sync_gateway/issues/1280) Auto-expire unused _local checkpoint documents 
- [__#1580__](https://github.com/couchbase/sync_gateway/issues/1580) Use latest version of Otto
- [__#2354__](https://github.com/couchbase/sync_gateway/issues/2354) Windows service wrapper should write to a configurable stderr log file
- [__#2709__](https://github.com/couchbase/sync_gateway/issues/2709) Conflict-free mode (allow_conflicts:false)
- [__#3015__](https://github.com/couchbase/sync_gateway/issues/3015) Set document expiry via Sync Function
- [__#3123__](https://github.com/couchbase/sync_gateway/issues/3123) Log _sync:seq on startup
- [__#3136__](https://github.com/couchbase/sync_gateway/issues/3136) Inter-document compression in BLIP replicator
- [__#3105__](https://github.com/couchbase/sync_gateway/issues/3105) Set document expiry via Sync Function

__Bugs__

- [__#1003__](https://github.com/couchbase/sync_gateway/issues/1003) SG with bucket shadowing doesn't work properly after CB restarted
- [__#1406__](https://github.com/couchbase/sync_gateway/issues/1406) Feedtype=DCP not working sometimes
- [__#1488__](https://github.com/couchbase/sync_gateway/issues/1488) Rebalance -in a CBS node results in timeouts which manifests as empty changes feed
- [__#2108__](https://github.com/couchbase/sync_gateway/issues/2108) Missing sequences in _changes feed causing sg-replicate missing documents replication
- [__#2223__](https://github.com/couchbase/sync_gateway/issues/2223) Wrong name being set for users
- [__#2371__](https://github.com/couchbase/sync_gateway/issues/2371) Logging - "Replicate" works when in *.json but not when you PUT _logging
- [__#2383__](https://github.com/couchbase/sync_gateway/issues/2383) Channel cache missing data when request instantiating cache times out
- [__#2410__](https://github.com/couchbase/sync_gateway/issues/2410) SG gets into a 100% cpu state, where restart is the only recovery
- [__#2441__](https://github.com/couchbase/sync_gateway/issues/2441) RedHat/Centos 6 'initctl restart sync_gateway' does not work as expected
- [__#2458__](https://github.com/couchbase/sync_gateway/issues/2458) Log rotation skipping BLIP keys
- [__#2717__](https://github.com/couchbase/sync_gateway/issues/2717) SG Blip handler not reloading user channels
- [__#3048__](https://github.com/couchbase/sync_gateway/issues/3048) Panic when attempting to make invalid update to a conflicting document
- [__#3049__](https://github.com/couchbase/sync_gateway/issues/3049) Allow non-winning tombstone revisions when running with allow_conflicts=false
- [__#3054__](https://github.com/couchbase/sync_gateway/issues/3054) Mobile import of SDK write doesn't preserve expiry
- [__#3107__](https://github.com/couchbase/sync_gateway/issues/3107) _revisions property is stored in rev cache after new_edits=false write
- [__#3108__](https://github.com/couchbase/sync_gateway/issues/3108) Channel grant to role doesn't trigger reload of user context during write
- [__#3146__](https://github.com/couchbase/sync_gateway/issues/3146) One-shot changes requests should log timing information
- [__#3174__](https://github.com/couchbase/sync_gateway/issues/3174) sgcollect_info crashes if error encountered getting expvars
- [__#3247__](https://github.com/couchbase/sync_gateway/issues/3247) Ensure one-shot sg-replicate replications don't start until views are indexed
- [__#3248__](https://github.com/couchbase/sync_gateway/issues/3248) CloseNotifier handling not being used for continuous changes
- [__#3307__](https://github.com/couchbase/sync_gateway/issues/3307) Pushing yet-unseen tombstoned doc to Sync Gateway returns error in XATTR mode
- [__#3344__](https://github.com/couchbase/sync_gateway/issues/3344) Sync Gateway 1.5.1 panics when querying a view

