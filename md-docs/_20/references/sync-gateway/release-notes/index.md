---
id: sg-release-notes
title: SG release notes
redirect_from:
  - guides/sync-gateway/bucket-shadowing/index.html
---

## Deprecation Notices

The following features are being deprecated and will be unsupported in an upcoming version of Sync Gateway.

- **Bucket shadowing** has been deprecated since 1.4 and has now become unsupported. The recommended approach to perform operations on a bucket dedicated to Couchbase Mobile is to enable [shared bucket access](../../../guides/sync-gateway/shared-bucket-access.html).

## New Features

### Views to GSI (N1QL)

Up until now, Sync Gateway has been using views for a variety of functionality, including authentication and replication. Starting in 2.1, Sync Gateway now relies on GSI and N1QL to perform those tasks. This change is enabled by default and there are 2 properties in the configuration file which can be adjusted:

- [`databases.$db.use_views`](../../../guides/sync-gateway/config-properties/index.html#2.1/databases-foo_db-use_views)
- [`databases.$db.num_index_replicas`](../../../guides/sync-gateway/config-properties/index.html#2.1/databases-foo_db-num_index_replicas)

### X.509 Authentication against Couchbase Server

Sync Gateway adds the ability to use x.509 certificates to authenticate against Couchbase Server 5.5 or higher. Certificate based authentication provides an additional layer of security; it relies on a certificate authority, CA, to validate identities and issue certificates. The Couchbase Server documentation provides [more detail](https://developer.couchbase.com/documentation/server/current/security/security-certs-auth.html) regarding this functionality. To enable certificate based authentication on Sync Gateway, paths to the client certificate, private key and root CA must be set in the configuration file:

- [`databases.$db.certpath`](../../../guides/sync-gateway/config-properties/index.html#2.1/databases-foo_db-certpath)
- [`databases.$db.keypath`](../../../guides/sync-gateway/config-properties/index.html#2.1/databases-foo_db-keypath)
- [`databases.$db.cacertpath`](../../../guides/sync-gateway/config-properties/index.html#2.1/databases-foo_db-cacertpath)

x.509 certificates provide an alternative method of authentication to the existing password-based authentication method. If the **username**/**password** properties are also specified in the configuration file then Sync Gateway will use password-based authentication and also include the client certificate in the TLS handshake.

### Continuous Logging

Continuous logging is a new feature in Sync Gateway 2.1 that allows the console log output to be separated from log files collected by Couchbase Support.

This allows system administrators running Sync Gateway to tweak log level, and log keys for the console output to suit their needs, whilst maintaining the level of logging required by Couchbase Support for investigation of issues.

The previous logging configuration (`logging.default`) is being deprecated, and Sync Gateway 2.1 will display warnings on startup of what is required to update your configuration.
Detailed information about continuous logging can be found in the [Logging guide](../../../guides/sync-gateway/logging/index.html).

### Log Redaction

All log outputs can be redacted, this means that user-data, considered to be private, is removed. This feature is optional and can be enabled in the configuration with the [`logging.redaction_level`](../../../guides/sync-gateway/config-properties/index.html#2.1/logging-redaction_level) property.

### sgcollect_info

#### Continuous logging

[sgcollect_info](../../../guides/sync-gateway/sgcollect-info/index.html) has been updated to read the [continuous logging](index.html#continuous-logging) feature introduced in 2.1, and collect the four levelled files (**sg_error.log**, **sg_warn.log**, **sg_info.log** and **sg_debug.log**).

These new log files are rotated and compressed by Sync Gateway, so `sgcollect_info` decompresses these rotated logs, and concatenates them back into a single file upon collection.

For example, if you have **sg_debug.log**, and **sg_debug-2018-04-23T16-57-13.218.log.gz** and then run `sgcollect_info` as normal, both of these files get put into a **sg_debug.log** file inside the zip output folder.

#### Log Redaction

`sgcollect_info` now supports [log redaction](index.html#log-redaction) post-processing. In order to utilise this, Sync Gateway needs to be run with the `logging.redaction_level` property set to "partial".

Two new command line options have been added to `sgcollect_info`:

- `--log-redaction-level=REDACT_LEVEL`: redaction level for the logs collected, `none` and `partial` supported. Defaults to `none`.

	When `--log-redaction-level` is set to partial, two zip files are produced, and tagged contents in the redacted one should be hashed in the same way as `cbcollect_info`:

	```bash
	$ ./sgcollect_info --log-redaction-level=partial sgout.zip
	...
	Zipfile built: sgout-redacted.zip
	Zipfile built: sgout.zip
	```

- `--log-redaction-salt=SALT_VALUE`: salt used in the hashing of tagged data when enabling redaction. Defaults to a random uuid.

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
