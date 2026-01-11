# Zusage

A minimal CLI tool to monitor your Z.ai token usage when using a Claude Code coding plan.

## Overview

This tool connects to the Z.ai API to fetch and display your current token consumption, showing your usage progress within the 5-hour rolling window and the time until your next quota reset.

## Features

- Visual progress bar showing token usage percentage
- Current tokens used, remaining, and total limit
- Time remaining until next reset
- Next reset date and time (Paris timezone)

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
  📊 Z.AI - UTILISATION DES TOKENS
==================================================

  Progression: [███████████████████████░░░░] 72%

  📈 Utilisé:     145 000 tokens
  📉 Restant:     55 000 tokens
  🎯 Limite:      200 000 tokens

  ⏱️  Reset dans:  2h 15min
  📅 Prochain reset: lundi 11 janvier 2026 à 14:30

==================================================
```

## 5-Hour Rolling Window

Z.ai uses a 5-hour rolling window for token limits. This means your quota resets based on your usage over the past 5 hours, not at a fixed time. This tool shows when your next window reset will occur based on the API data.
