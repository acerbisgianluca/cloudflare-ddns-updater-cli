# CloudFlare DDNS Updater CLI

:globe_with_meridians: Cloudflare DDNS Updater CLI: Effortlessly manage DNS with automatic updates through this command-line tool. :rocket:

![npm](https://img.shields.io/npm/v/cloudflare-ddns-updater-cli)
![GitHub](https://img.shields.io/github/license/acerbisgianluca/cloudflare-ddns-updater-cli)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/acerbisgianluca/cloudflare-ddns-updater-cli/release.yml)
![Codecov branch](https://img.shields.io/codecov/c/github/acerbisgianluca/cloudflare-ddns-updater-cli/master)

## Installation

```bash
npm install -g cloudflare-ddns-updater-cli
```

## Usage

```bash
cf-ddns {--zone-id <zoneID> | --zone-name <zoneName>} --record-name <recordName> --token <apiToken>
```

### Options

- `-i, --zone-id <zoneId>`: The ID of the zone to update. You can find it at the bottom right on the overview page of you CloudFlare project. It conflicts with `--zone-name`. It also checks for `CF_ZONE_ID` environment variable.
- `-n, --zone-name <zoneName>`: The name of the zone to update (example: `domain.com`). It conflicts with `--zone-id`. It also checks for `CF_ZONE_NAME` environment variable.
- `-r, --record-name <recordName>`: The name of the record to update (example: `home.domain.com`). It also checks for `CF_RECORD_NAME` environment variable.
- `-t, --token <apiToken>`: The API token to use. It also checks for `CF_API_TOKEN` environment variable. See [Create CloudFlare API Token](#create-cloudflare-api-token) for more information.

> Note: either `-i, --zone-id` or `-n, --zone-name` must be specified.

### Alias

```bash
cloudflare-ddns
```

## Create CloudFlare API Token

- Open the [API Tokens](https://dash.cloudflare.com/profile/api-tokens) page on your CloudFlare dashboard.
- Click on `Create Token`.
- Select `Edit zone DNS` template.
- Select the Zone Resources you want to update.
- Click on `Continue to summary`.
- Click on `Create Token`.
- Copy the token and use it with the `-t, --token` option.