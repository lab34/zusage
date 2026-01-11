# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zusage is a minimal CLI tool that monitors and displays Z.ai API token usage. It's a single-file Node.js script (ES modules) with no external dependencies, published as an npm package.

## Running the Script

```bash
# Via npx (recommended)
npx -y zusage@latest

# Or run locally
node bin/index.js

# Or with npm script
npm test
```

## Environment Variables

- `ANTHROPIC_AUTH_TOKEN` (required): Bearer token for Z.ai API authentication

## Publishing

```bash
# Bump version in package.json
npm version patch  # or minor, major

# Publish to npm
npm publish

# Or to GitHub Packages (via GitHub Actions)
git push --follow-tags
```

## Architecture

The script is located in `bin/index.js` and is organized into pure functions with clear responsibilities:

- `getTokenLimit()`: Fetches quota data from `https://api.z.ai/api/monitor/usage/quota/limit`, extracts the `TOKENS_LIMIT` entry from the response
- `formatNumber()`: French locale number formatting with thousand separators
- `formatDate()`: Formats timestamps to French locale (Europe/Paris timezone)
- `getTimeRemaining()`: Calculates human-readable time until next reset
- `displayTokenInfo()`: Renders console output with ASCII progress bar
- `main()`: Entry point with error handling

## API Response Structure

The API returns a JSON response with this structure:
```json
{
  "success": true,
  "data": {
    "limits": [
      {
        "type": "TOKENS_LIMIT",
        "currentValue": number,
        "usage": number,
        "remaining": number,
        "percentage": number,
        "nextResetTime": timestamp
      }
    ]
  }
}
```

## Code Conventions

- ES modules (`.js` files with `"type": "module"` in package.json)
- Async/await for API calls
- French language for comments and user-facing messages
- French locale formatting (`fr-FR`, `Europe/Paris` timezone)
- Shebang: `#!/usr/bin/env node` in `bin/index.js`
