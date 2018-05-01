---
id: sg-release-notes
title: SG release notes
---

## New Features

### Views to GSI (N1QL)

Up until now, Sync Gateway has been using views for a variety of functionality, including authentication and replication. Starting in 2.1, Sync Gateway now relies on GSI and N1QL to perform those tasks. This change is enabled by default.

#### Installation and upgrade

The upgrade from views to GSI (N1QL) happens automatically when starting a Sync Gateway 2.1 node in a cluster that was previously using views.

Installation will follow the same approach implemented in 2.0 for view install/upgrade:

- On Sync Gateway startup, it will check for existence of required index versions, and create them if not present.
- As part of the existence check, SG will also check if `num_replica` for the existing indexes matches the value specified in SG’s config.  If not, will drop and recreate the index.
- Wait for the Sync Gateway node to be reachable via the REST API (for example at http://localhost:4985/).
- Remove obsolete index definitions once the upgrade has completed:
	- Issue a call to /_post_upgrade?preview=true on that node to preview which design documents will be removed. To upgrade to 2.1, expect to see "syncgateway" and "synchousekeeping" listed.
	- Issue a call to /post_upgrade to remove the obsolete design documents. The response should indicate that "syncgateway" and "synchousekeeping" were removed.

### Other changes

- [`databases.$db.bucket_op_timeout_ms`](../../../guides/sync-gateway/config-properties/index.html#2.1/databases-foo_db-bucket_op_timeout_ms): property to override the default timeout used by Sync Gateway to query Couchbase Server. It's generally not necessary to change this property unless there is a particularly heavy load on Couchbase Server which would increase the response time.