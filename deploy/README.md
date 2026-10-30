# The dev docs: xplorer-docs.plantasia.space

Two sites from this repo:

| Branch | Site | Built by | Paired with |
| --- | --- | --- | --- |
| `main` | docs.plantasia.space | `.github/workflows/deploy.yml` → GitHub Pages | plantasia.space, events.plantasia.space |
| `dev` | xplorer-docs.plantasia.space | `.github/workflows/deploy-dev.yml` → be-deploy's CI wrapper → `deploy/dev-site.sh` on the dev box, served by its nginx | dev-root.plantasia.space, dev-events.plantasia.space |

A push to `dev` rebuilds the dev site, so a page merged to `dev` is readable on dev-root (help links,
Orchidea's help pages, What's new) without promoting the docs. `DOCS_SITE=dev` is what makes a build
the dev site (`docusaurus.config.ts`: its `url`, `rootBase`, `eventsBase`).

The site is open, like the public docs: dev-root's Orchidea links to it and mycelium reads its
`/_raw/docs/` pages server-side. nginx sends `X-Robots-Tag: noindex` so search engines leave it out.

## One-time setup (dev box `161.35.206.36`, user `bruna`)

1. **DNS** (Cloudflare): `xplorer-docs.plantasia.space` → A `161.35.206.36`, DNS only (grey cloud).
2. **Checkout:**
   ```bash
   git clone https://github.com/plantasia-space/docs.plantasia.space.git /srv/xplorer-docs.plantasia.space
   cd /srv/xplorer-docs.plantasia.space && git checkout -B dev origin/dev
   ```
3. **nginx + TLS:**
   ```bash
   cd /srv/xplorer-docs.plantasia.space
   sudo cp deploy/nginx/xplorer-docs.bootstrap.conf /etc/nginx/sites-available/xplorer-docs.plantasia.space
   sudo ln -sf /etc/nginx/sites-available/xplorer-docs.plantasia.space /etc/nginx/sites-enabled/xplorer-docs.plantasia.space
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot certonly --webroot -w /var/www/html -d xplorer-docs.plantasia.space
   sudo cp deploy/nginx/xplorer-docs.plantasia.space.conf /etc/nginx/sites-available/xplorer-docs.plantasia.space
   sudo nginx -t && sudo systemctl reload nginx
   ```
4. **First build:** `bash /srv/xplorer-docs.plantasia.space/deploy/dev-site.sh`
5. **Automatic deploys** need nothing more. `.github/workflows/deploy-dev.yml` uses the be-deploy CI
   key the services use (`DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_USER`, already visible to this repo);
   be-deploy's `ci-deploy-command.sh` accepts `deploy xplorer-docs dev` and runs `deploy/dev-site.sh`
   under the shared pipeline lock.

The build needs the swap the box already has for dev-docs. Every deploy reports to the deploy status
dashboard as repo `xplorer-docs`, environment `dev` (through `/srv/be-deploy/lib/events.sh`); a failure
emails like any dev-box deploy.

Rebuild by hand any time: `bash /srv/xplorer-docs.plantasia.space/deploy/dev-site.sh`.
