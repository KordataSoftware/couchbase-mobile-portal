---
id: sg
title: Sync Gateway
permalink: installation/sync-gateway/index.html
---

Before installing Sync Gateway, you should have completed the Getting Started instructions for Couchbase Lite on the platform of [your choice](../index.html) (iOS, Android, .NET or Xamarin). To begin synchronizing between Couchbase Lite and Sync Gateway follow the steps below.

## Installation

Install Sync Gateway on the operating system of your choice:

{% include install-tabs.html %}

<h3 class="tab">Ubuntu</h3>

Download Sync Gateway from the [Couchbase downloads page](http://www.couchbase.com/nosql-databases/downloads#couchbase-mobile) or using `wget`.

```bash
wget {{ site.sg_download_link }}{{ site.sg_package_name }}.deb
```

Install sync_gateway with the dpkg package manager e.g:

```bash
dpkg -i {{ site.sg_package_name }}.deb
```

When the installation is complete sync_gateway will be running as a service.

To stop/start the `sync_gateway` service, use the following.

```bash
sudo service sync_gateway start
sudo service sync_gateway stop
```

The config file and logs are located in `/home/sync_gateway`.

> **Note:** You can also run the **sync_gateway** binary directly from the command line. The binary is installed at `/opt/couchbase-sync-gateway/bin/sync_gateway`.

<h3 class="tab">Red Hat/CentOS</h3>

Download Sync Gateway from the [Couchbase downloads page](http://www.couchbase.com/nosql-databases/downloads#couchbase-mobile) or using the `wget`.

```bash
wget {{ site.sg_download_link }}{{ site.sg_package_name }}.rpm
```

Install sync_gateway with the rpm package manager e.g:

```bash
rpm -i {{ site.sg_package_name }}.rpm
```

When the installation is complete sync_gateway will be running as a service.

On CentOS 5:

```bash
service sync_gateway start
service sync_gateway stop
```

On CentOS 6:

```bash
initctl start sync_gateway
initctl stop sync_gateway
```

> **Note:** The `initctl restart sync_gateway` command does not work in CentOS 6. To restart Sync Gateway, the stop/start commands can be used instead.

On CentOS 7:

```bash
systemctl start sync_gateway
systemctl stop sync_gateway
```

The config file and logs are located in `/home/sync_gateway`.

<h3 class="tab">Debian</h3>

Download Sync Gateway from the [Couchbase downloads page](http://www.couchbase.com/nosql-databases/downloads#couchbase-mobile) or using the `wget`.

```bash
wget {{ site.sg_download_link }}{{ site.sg_package_name }}.deb
```

Install sync_gateway with the dpkg package manager e.g:

```bash
dpkg -i {{ site.sg_package_name }}.deb
```

When the installation is complete sync_gateway will be running as a service.

```bash
systemctl start sync_gateway
systemctl stop sync_gateway
```

The config file and logs are located in `/home/sync_gateway`.

<h3 class="tab">Windows</h3>

Download Sync Gateway from the [Couchbase downloads page](http://www.couchbase.com/nosql-databases/downloads#couchbase-mobile). Open the installer and follow the instructions. If the installation was successful you will see the following.

<img src="../img/windows-installation-complete.png" width="400" class="portrait" />

Sync Gateway runs as a service (reachable on [http://localhost:4985/](http://localhost:4985/)). To stop/start the service, you can use the Services application (**Control Panel --> Admin Tools --> Services**).

- The configuration file is located under **C:\Program Files\Couchbase\Sync Gateway\serviceconfig.json**.
- Logs are located under **C:\Program Files\Couchbase\Sync Gateway\var\lib\couchbase\logs**.

<h3 class="tab">macOS</h3>

Download Sync Gateway from the [Couchbase downloads page](http://www.couchbase.com/nosql-databases/downloads#couchbase-mobile) or using the `wget`.

```bash
wget {{ site.sg_download_link }}{{ site.sg_package_name }}.tar.gz
```

Install sync_gateway by unpacking the tar.gz installer.

```bash
sudo tar -zxvf {{ site.sg_package_name }}.tar.gz --directory /opt
```

Create the sync_gateway service.

```bash
$ sudo mkdir /Users/sync_gateway

$ cd /opt/couchbase-sync-gateway/service

$ sudo ./sync_gateway_service_install.sh
```

To restart sync_gateway (it will automatically start again).

```bash
$ sudo launchctl stop sync_gateway
```

To remove the service.

```bash
$ sudo launchctl unload /Library/LaunchDaemons/com.couchbase.mobile.sync_gateway.plist
```

The config file and logs are located in `/Users/sync_gateway`.

The following sections describe how to install and configure Sync Gateway to run with Couchbase Server.

### Network configuration

Sync Gateway uses specific ports for communication with the outside world, mostly Couchbase Lite databases replicating to and from Sync Gateway. The following table lists the ports used for different types of Sync Gateway network communication:

|Port|Description|
|:---|:----------|
|4984|Public port. External HTTP port used for replication with Couchbase Lite databases and other applications accessing the REST API on the Internet.|
|4985|Admin port. Internal HTTP port for unrestricted access to the database and to run administrative tasks.|

## Configure Couchbase Server

To configure Couchbase Server before connecting Sync Gateway, run through the following.

- [Download](https://www.couchbase.com/nosql-databases/downloads) and install Couchbase Server.
- Open the Couchbase Server Admin Console on [http://localhost:8091](http://localhost:8091) and log on using your
administrator credentials.
- In the toolbar, select the **Data Buckets** tab and click the **Create New Data Bucket** button.
		<img src="../img/cb-create-bucket.png" class=center-image />
- Provide a bucket name, for example **staging**, and leave the other options to their defaults.
- Next, we must create an RBAC user with specific privileges for Sync Gateway to connect to Couchbase Server. Open the **Security** tab and click the **Add User** button.
		<img src="../img/create-user.png" class=center-image />
- In the pop-up window, provide a **Username**, **Password** and enable the **Bucket Full Access** role for the bucket of your choice.
		<img src="../img/user-settings.png" class=center-image />
- If you're installing Couchbase Server on the cloud, make sure that network permissions (or firewall settings) allow incoming connections to Couchbase Server ports. In a typical mobile deployment on premise or in the cloud (AWS, RedHat etc), the following ports must be opened on the host for Couchbase Server to operate correctly: 8091, 8092, 8093, 8094, 11207, 11210, 11211, 18091, 18092, 18093. You must verify that any firewall configuration allows communication on the specified ports. If this is not done, the Couchbase Server node can experience difficulty joining a cluster. You can refer to the [Couchbase Server Network Configuration](/documentation/server/current/install/install-ports.html) guide to see the full list of available ports and their associated services.

## Start Sync Gateway

The following steps explain how to connect Sync Gateway to the Couchbase Server instance that was configured in the previous section.

- Open a new file called **sync-gateway-config.json** with the following.

	```javascript
	{
		"log": ["*"],
		"databases": {
			"staging": {
				"server": "http://localhost:8091",
				"bucket": "staging",
				"username": "sync_gateway",
				"password": "secretpassword",
				"enable_shared_bucket_access": true,
				"import_docs": "continuous"
				"users": { "GUEST": { "disabled": false, "admin_channels": ["*"] } },
				"sync": `function (doc, oldDoc) {
					if (doc.sdk) {
						channel(doc.sdk);
					}
				}`
			}
		}
	}
	```

	This configuration contains the user credentials of the **sync_gateway** user you created previously. It also enables [shared bucket access](../../guides/sync-gateway/shared-bucket-access.html); this feature was introduced in Sync Gateway 1.5 to allow Couchbase Server SDKs to also perform operation on this bucket.

- Start Sync Gateway from the command line, or if Sync Gateway is running in a service replace the configuration file and restart the service.

	```bash
	~/Downloads/couchbase-sync-gateway/bin/sync_gateway ~/path/to/sync-gateway-config.json
	```

- Run the application where Couchbase Lite is installed. You should then see the documents that were replicated on the Sync Gateway admin UI at [http://localhost:4985/_admin/](http://localhost:4985/_admin/).

{% include experimental-label.html %}

<img src="../img/admin-ui-getting-started.png" class=center-image />

## Supported Platforms

Sync Gateway is supported on the following operating systems:

|Ubuntu|CentOS/RedHat|Debian|Windows|macOS|
|:-----|:------------|:-----|:------|:----|
|12, 14, 16|5, 6, 7|8|Windows 8, Windows 10, Windows Server 2012|Yosemite, El Capitan|