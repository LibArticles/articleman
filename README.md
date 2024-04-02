# Articleman

[![built with nix](https://builtwithnix.org/badge.svg)](https://builtwithnix.org)
![GitHub License](https://img.shields.io/github/license/LibArticles/articleman)


I don't like running things on spreadsheets - they're just not the best option. They work for one person, _maybe,_ but with two people suddenly either email or Google Workspace gets involved and things only go downhill from there.

"Please don't touch the A2:C13 range of cells!" -statements made by the utterly deranged.

Designed to be extraordinarily lightweight (the _entire_ backend stack, excluding the frontend server, is written in Rust, which lacks a garbage collector) and fast (aiming for <250ms round-trip response time on any given request)

Articleman is built in Rust and TypeScript, and uses:

## backend
1. [FerretDB](https://ferretdb.io) as the database
2. [KanIDM](https://kanidm.com) as the IAM backend
3. [Meilisearch](https://www.meilisearch.com) as the search engine
4. [Coerce-rs](https://github.com/leonhartley/coerce-rs) as the actor framework

## frontend
1. [SvelteKit](https://kit.svelte.dev) as the web frontend

To get started building Articleman, all you need is the Nix package manager.

All of the dependencies you need to build Articleman are included in `flake.nix`, which can be automatically loaded by Nix with any of the below commands.

To run without Flakes enabled:
```bash
	$ nix-shell -A devShells.x86_64-linux.backend

	# --or--

	$ nix-shell -A devShells.x86_64-linux.frontend

	# where the architecture is whatever your computer is running, typically x86_64-linux
```

To run with Flakes enabled:
```bash
	$ nix develop .#backend

	# --or--

	$ nix develop .#frontend
```

Once you're there, just use Cargo or the Bun package manager in the corresponding directory as you usually would.