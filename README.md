# github-api-cli

A read-only CLI tool for fetching github resources from Github REST v3 API and
writing them stdout as JSON.

To install:

```console
npm install -g github-api-cli
```

## usage

Fetches and merges all pages of [code.search](https://octokit.github.io/rest.js/#api-Search-code) while obeying rate limits:

```console
github-api-cli get search code q='filename:package.json org:g-k' per_page=100
```

Optionally uses a Github PAT provided as the env var `GITHUB_TOKEN` to authenticate:

```console
GITHUB_TOKEN=mypat github-api-cli get search code q='filename:package.json org:g-k'
```
