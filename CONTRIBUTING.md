# Contributing

## Setup

```bash
nvm use        # Node version from .nvmrc
npm install
```

## Workflow

1. Branch from `master`.
2. Make your change and add or update tests in `src/tests/`.
3. Run the checks CI runs on pull requests:
   ```bash
   npm run lint -- --max-warnings=0
   npm test
   npm run audit-ci
   ```
4. Open a pull request against `master`. Add a label (`feature`, `fix`, `security`, `docs`, `chore`, `test`, ...) so it lands in the right release-notes section; use `breaking-change` for API changes.

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`).

## Guidelines

- Keep the library free of Node built-ins and polyfills (`Buffer`, `crypto`, `TextEncoder`). It must run in browsers and React Native.
- Prettier config is in `.prettierrc`; ESLint must pass with no warnings.
- Comments are brief and neutral, with no ticket numbers.
- Changes to public exports or output formats are breaking; call them out in the PR.
- Report security issues privately to the maintainer, not in a public issue.

Agent-specific notes are in [`.agents/`](.agents/README.md).
