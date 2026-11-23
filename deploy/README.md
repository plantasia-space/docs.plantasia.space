# Where the docs are deployed

Two sites from this repo, both on Cloudflare Workers (static assets), built by Workers Builds from
GitHub on every push. Config: `wrangler.jsonc`. PLA-747.

| Branch | Site | Cloudflare Worker | Build command | Paired with |
| --- | --- | --- | --- | --- |
| `dev` | xplorer-docs.plantasia.space | `ps-xplorer-docs-dev` | `DOCS_SITE=dev npm run build:cf` | dev-root.plantasia.space, dev-events.plantasia.space |
| `main` | docs.plantasia.space | `ps-xplorer-docs` (moves from the DO app `ps-docs` at the next promotion) | `npm run build:cf` | plantasia.space, events.plantasia.space |

Deploy command for the dev Worker: `npx wrangler@4.166.0 deploy --env dev`.

`DOCS_SITE=dev` is what makes a build the dev site (`docusaurus.config.ts`: its `url`, `rootBase`,
`eventsBase`). `scripts/cf-headers.mjs` writes `build/_headers`: the dev site gets
`X-Robots-Tag: noindex, nofollow` and `X-Environment: Development`, as its nginx used to send.

The dev site is open, like the public docs: dev-root's Orchidea links to it, and mycelium reads its
`/_raw/docs/` pages server-side.

Not to confuse with **dev-docs.plantasia.space**, the internal dashboard (another repo).

History: until 23 Nov 2026 the dev docs were built on the dev droplet (GitHub Action → be-deploy →
`deploy/dev-site.sh`, served by nginx). That path is retired.
