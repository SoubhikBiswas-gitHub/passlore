# Contributing to Passlore

Help make password generation easier to use, test and understand. Start with a focused issue and a reproducible example. Never include a real password, credential or personal data.

## Propose work

Use the bug, feature or documentation form. Explain the problem and the result you want. Only `SoubhikBiswas-gitHub` approves implementation by applying `approved`; suggestions from other accounts do not grant approval. Approved issues become tasks on the [Passlore board](https://github.com/users/SoubhikBiswas-gitHub/projects/1).

## Set up and verify

Follow the [README quick start](README.md#quick-start). Use Node.js 22 and Yarn Classic. Run `yarn install --frozen-lockfile` to install dependencies.

Before requesting promotion, run:

```sh
yarn lint
yarn test
yarn build:play
yarn playwright install chromium
NEXT_PUBLIC_DEPLOYMENT_ENV=play yarn test:browser
```

Keep testing credentials and resources separate from production. Do not weaken testing noindex protections or enable production analytics in `play` builds.

## Send a pull request

Keep changes focused and fill in the PR template. Link an approved issue with `Closes #123` or `Tracks: #123`; include actual test results and screenshots for visible changes. Contributions target `play`. In your fork, use a descriptive branch; the upstream repository keeps `play` for testing and `main` for production.

The owner promotes tested work through a PR from `play` to `main`. The promotion PR must list all issues it delivers. A merge into `play` means “In testing”; a merge into `main` means “Merged”. Only verified production delivery means “Deployed”. See the [workflow guide](.github/COMMUNITY_WORKFLOW.md).

## Review and conduct

Be kind, concrete and open to revision. Explain tradeoffs, support accessibility and preserve existing attribution and dependency licences. See the [Code of Conduct](CODE_OF_CONDUCT.md). Report vulnerabilities through the [security policy](SECURITY.md), not public issues.

By submitting a contribution, you agree that it is available under the [MIT License](LICENSE).
