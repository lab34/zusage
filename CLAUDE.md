# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zusage is a minimal CLI tool that monitors and displays Z.ai API token usage. It's a single-file Node.js script (ES modules) with no external dependencies.

## Running the Script

```bash
# Make sure the script is executable
chmod +x token-usage.mjs

# Run the script
./token-usage.mjs

# Or with node directly
node token-usage.mjs
```

## Environment Variables

- `ANTHROPIC_AUTH_TOKEN` (required): Bearer token for Z.ai API authentication

## Architecture

The script is organized into pure functions with clear responsibilities:

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

- ES modules (`.mjs` extension)
- Async/await for API calls
- French language for comments and user-facing messages
- French locale formatting (`fr-FR`, `Europe/Paris` timezone)
- Shebang: `#!/usr/bin/env node`
