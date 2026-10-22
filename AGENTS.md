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
