# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

- `main` → docs.plantasia.space (GitHub Pages, `.github/workflows/deploy.yml`).
- `dev` → dev-userdocs.plantasia.space (the dev box, `.github/workflows/deploy-dev.yml`), the docs dev-root reads. See [deploy/README.md](deploy/README.md).
