# Zusage

A minimal CLI tool to monitor your Z.ai token usage when using a Claude Code coding plan.

## Overview

This tool connects to the Z.ai API to fetch and display your current token consumption, showing your usage progress within the 5-hour rolling window and the time until your next quota reset.

## Features

- Visual progress bar showing token usage percentage
- Current tokens used, remaining, and total limit
- Time remaining until next reset
- Next reset date and time

## Installation

### Via npx (recommended)

No installation needed - just run:

```bash
npx -y zusage@latest
```

### Or install globally

```bash
npm install -g zusage
```

## Usage

Set your `ANTHROPIC_AUTH_TOKEN` environment variable (found in your browser's localStorage when logged into Z.ai):

```bash
export ANTHROPIC_AUTH_TOKEN="your_token_here"

# Via npx
npx -y zusage@latest

# Or if installed globally
zusage
```

## Example Output

```
==================================================
  📊 Z.AI - TOKEN USAGE
==================================================

  Progress: [███████████████████████░░░░] 72%

  📈 Used:        145,000 tokens
  📉 Remaining:   55,000 tokens
  🎯 Limit:       200,000 tokens

  ⏱️  Reset in:    2h 15m
  📅 Next reset:  Monday, January 11, 2026 at 2:30 PM

==================================================
```

## 5-Hour Rolling Window

Z.ai uses a 5-hour rolling window for token limits. This means your quota resets based on your usage over the past 5 hours, not at a fixed time. This tool shows when your next window reset will occur based on the API data.
