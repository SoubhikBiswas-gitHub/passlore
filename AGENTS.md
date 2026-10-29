# Passlore development and deployment

- Use `play` for testing and `main` for production. Promote changes through a pull request from `play` to `main`.
- Run `yarn lint`, `yarn test`, `yarn build:play`, and `NEXT_PUBLIC_DEPLOYMENT_ENV=play yarn test:browser` before promotion. Browser checks require `yarn playwright install chromium`.
- Testing uses `play.passlore.com` and Worker `passlore-play`. Production uses `passlore.com` and Worker `passlore`.
- Keep testing resources and credentials separate from production. There is currently no server database, object storage, or payment integration. Add separate resources before introducing any of those services.
- Testing builds must retain noindex response headers, noindex metadata, a disallow-all robots file, and disabled production analytics.
- Configure `play.passlore.com` as a proxied CNAME to `passlore-play.soubhik481.workers.dev`; retain its Worker route.
- Use `soubhik481@gmail.com` for hosting and Cloudflare. Verify the account email before deploying. Access GoDaddy through the domain account.
- Use neutral, product-specific names. Do not add generated-by notices or co-author trailers.
- Branch protection is not requested.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
