# Articleman

[![built with nix](https://builtwithnix.org/badge.svg)](https://builtwithnix.org)
![GitHub License](https://img.shields.io/github/license/LibArticles/articleman)


I don't like running things on spreadsheets - they're just not the best option. They work for one person, _maybe,_ but with two people suddenly either email or Google Workspace gets involved and things only go downhill from there.

"Please don't touch the A2:C13 range of cells!" -statements made by the utterly deranged.

Designed to be extraordinarily lightweight (the _entire_ backend stack, excluding the frontend server, is written in Rust, which lacks a garbage collector) and fast (aiming for <250ms round-trip response time on any given request)

Articleman is built in Rust and TypeScript, and uses:

## backend
1. [SurrealDB](https://surrealdb.com) as the database
2. [KanIDM](https://kanidm.com) as the IAM backend
3. [Meilisearch](https://www.meilisearch.com) as the search engine
4. [Coerce-rs](https://github.com/leonhartley/coerce-rs) as the actor framework

## frontend
1. [SvelteKit](https://kit.svelte.dev) as the web frontend
