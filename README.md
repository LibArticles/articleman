# Articleman

[![built with nix](https://builtwithnix.org/badge.svg)](https://builtwithnix.org)
![GitHub License](https://img.shields.io/github/license/LibArticles/articleman)

## Project management for creators and journalists that doesn't suck.
Lightweight, monolithic and easy to use.

To develop without Flakes enabled:
```bash
	$ nix-shell -A devShells.x86_64-linux.backend

	# --or--

	$ nix-shell -A devShells.x86_64-linux.frontend

	# where the architecture is whatever your computer is running, typically x86_64-linux
```

To develop with Flakes enabled:
```bash
	$ nix develop .#backend

	# --or--

	$ nix develop .#frontend
```

Once you're there, just use Cargo or the Yarn package manager in the corresponding directory as you usually would.

To build the frontend through nix, just run `nix build .#frontend`.