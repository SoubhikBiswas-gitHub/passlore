# Passlore

## Development

Install dependencies with `yarn install`, then run `yarn dev`.
Run `yarn lint` and `yarn test` to check types and generator behavior.
The shield in `public/icon.svg` is the favicon source. Run `yarn icons` after
editing it to rebuild the multi-size browser icon and mobile PNG icons.

## Hosting

The site runs on Cloudflare Workers in the `soubhik481@gmail.com` account.

- Build: `yarn build:cloudflare`
- Preview in the Workers runtime: `yarn preview`
- Build and publish: `yarn deploy`
- Deployment URL: https://passlore.soubhik481.workers.dev

`wrangler.jsonc` configures the Worker and static assets. The OpenNext adapter
preserves the existing Next.js routes and server rendering.

Domain registration stays with GoDaddy. DNS setup for `passlore.com` uses
Cloudflare in the hosting account.

## Branch deployments

| Branch | Worker | Domain |
| --- | --- | --- |
| `play` | `passlore-play` | `play.passlore.com` |
| `main` | `passlore` | `passlore.com` |

Use `yarn deploy:play` for a testing deployment. Testing builds block indexing
with response headers, metadata, and robots.txt, and disable production analytics.
Production builds use `yarn deploy`. Promote tested changes through a pull
request from `play` to `main`.

The repository workflow runs lint, generator tests, a Cloudflare build, and
Chromium checks on both branches and on production pull requests. Install the
local browser once with `yarn playwright install chromium`, then run
`NEXT_PUBLIC_DEPLOYMENT_ENV=play yarn test:browser` after `yarn build:play`.

Automatic deployment requires these GitHub settings:

1. Create environments named `play` and `production`.
2. Add a separate `CLOUDFLARE_API_TOKEN` secret to each environment, scoped to the
   hosting account with Workers Scripts Edit, Workers Routes Edit, and Zone Read
   for `passlore.com`. Do not store a local OAuth session token in GitHub.
3. Set the repository variable `CLOUDFLARE_DEPLOY_ENABLED` to `true` after both
   environment secrets are configured. Until then, checks run and deployments
   are skipped.

For DNS, use proxied CNAME records: `@` and `www` to
`passlore.soubhik481.workers.dev`, and `play` to
`passlore-play.soubhik481.workers.dev`. The Worker routes in `wrangler.jsonc`
handle requests on those hostnames. Activate the domain with Cloudflare's
assigned nameservers before expecting the custom hostnames to resolve.

There are no server databases, object storage buckets, or payment services in
this project. If added later, give testing its own resources and sandbox
credentials. GitHub environment secrets keep deployment credentials separate.
Branch protection is intentionally omitted.
