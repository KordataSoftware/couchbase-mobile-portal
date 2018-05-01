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

### Bucket operation timeout

The [`databases.$db.bucket_op_timeout_ms`](../../../guides/sync-gateway/config-properties/index.html#2.1/databases-foo_db-bucket_op_timeout_ms) property to override the default timeout used by Sync Gateway to query Couchbase Server. It's generally not necessary to change this property unless there is a particularly heavy load on Couchbase Server which would increase the response time.