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

### Views to GSI (N1QL)

Up until now, Sync Gateway has been using views for a variety of functionality, including authentication and replication. Starting in 2.1, Sync Gateway now relies on GSI and N1QL to perform those tasks. This change is enabled by default and there are 2 properties in the configuration file which can be adjusted:

- [`databases.$db.use_views`](../../../guides/sync-gateway/config-properties/index.html#2.1/databases-foo_db-use_views)
- [`databases.$db.num_index_replicas`](../../../guides/sync-gateway/config-properties/index.html#2.1/databases-foo_db-num_index_replicas)

### Continuous logging

Continuous logging is a new feature in Sync Gateway 2.1 that allows the console log output to be separated from log files collected by Couchbase Support.

This allows system administrators running Sync Gateway to tweak log level, and log keys for the console output to suit their needs, whilst maintaining the level of logging required by Couchbase Support for investigation of issues.

The previous logging configuration (`logging.default`) is being deprecated, and Sync Gateway 2.1 will display warnings on startup of what is required to update your configuration.
Detailed information about continuous logging can be found in the [Logging guide](../../../guides/sync-gateway/logging/index.html).

### Log redaction

All log outputs can be redacted, this means that user-data, considered to be private, is removed. This feature is optional and can be enabled in the configuration with the [`logging.redaction_level`](../../../guides/sync-gateway/config-properties/index.html#2.1/logging-redaction_level) property.

### Bucket operation timeout

The [`databases.$db.bucket_op_timeout_ms`](../../../guides/sync-gateway/config-properties/index.html#2.1/databases-foo_db-bucket_op_timeout_ms) property to override the default timeout used by Sync Gateway to query Couchbase Server. It's generally not necessary to change this property unless there is a particularly heavy load on Couchbase Server which would increase the response time.

### Support for IPv6

Sync Gateway now officially supports IPv6.

## Upgrading

The upgrade from views to GSI (N1QL) happens automatically when starting a Sync Gateway 2.1 node in a cluster that was previously using views.

Installation will follow the same approach implemented in 2.0 for view changes. On startup, Sync Gateway will check for the existence of the GSI indexes, and only attempt to create them if they do not already exist. As part of the existence check, Sync Gateway will also check if [`databases.$db.num_index_replicas`](../../../guides/sync-gateway/config-properties/index.html#2.1/databases-foo_db-num_index_replicas) for the existing indexes matches the value specified in the configuration file. If not, Sync Gateway will drop and recreate the index. Then, Sync Gateway will wait until indexes are available before starting to serve requests.

Sync Gateway 2.1 will **not** automatically remove the previously used design documents. Removal of the obsolete design documents is done via a call to the new  [`/{db}/_post_upgrade`](../admin-rest-api/index.html#/server/post__post_upgrade) endpoint in Sync Gateway’s Admin REST API. This endpoint can be run in preview mode (`?preview=true`) to see which design documents would be removed. To summarize, the steps to perform an upgrade to Sync Gateway 2.1 are:

1. Upgrade one node in the cluster to 2.1, and wait for it to be reachable via the REST API (for example at [http://localhost:4985/](http://localhost:4985/)).
2. Upgrade the rest of the nodes in the cluster.
3. Clean up obsolete views:
	- **Optional** Issue a call to `/_post_upgrade?preview=true` on any node to preview which design documents will be removed. To upgrade to 2.1, expect to see "sync_gateway" and "sync_housekeeping" listed.
	- Issue a call to `/post_upgrade` to remove the obsolete design documents. The response should indicate that "sync_gateway" and "sync_housekeeping" were removed.
