#!/usr/bin/env node
/**
 * Simple program to display Z.ai token usage
 */

const BASE_URL = 'https://api.z.ai';
const AUTH_TOKEN = process.env.ANTHROPIC_AUTH_TOKEN;

if (!AUTH_TOKEN) {
  console.error('❌ Error: ANTHROPIC_AUTH_TOKEN environment variable is not set');
  process.exit(1);
}

/**
 * Fetches token limits from Z.ai API
 */
async function getTokenLimit() {
  const response = await fetch(`${BASE_URL}/api/monitor/usage/quota/limit`, {
    method: 'GET',
    headers: {
      'accept': 'application/json, text/plain, */*',
      'origin': 'https://z.ai',
      'authorization': `Bearer ${AUTH_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(`API Error: ${data.msg}`);
  }

  // Find and return only the TOKENS_LIMIT part
  const tokensLimit = data.data.limits.find(limit => limit.type === 'TOKENS_LIMIT');

  if (!tokensLimit) {
    throw new Error('TOKENS_LIMIT not found in response');
  }

  return tokensLimit;
}

/**
 * Formats a number with thousand separators
 */
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Formats a timestamp into a readable date
 */
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
}

/**
 * Calculates time remaining until reset
 */
function getTimeRemaining(nextResetTime) {
  const now = Date.now();
  const remaining = nextResetTime - now;

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Displays token info in a stylized manner
 */
function displayTokenInfo(info) {
  console.log('\n' + '='.repeat(50));
  console.log('  📊 Z.AI - TOKEN USAGE');
  console.log('='.repeat(50));

  // Visual progress bar
  const barLength = 30;
  const filled = Math.round((info.percentage / 100) * barLength);
  const empty = barLength - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  console.log(`\n  Progress: [${bar}] ${info.percentage}%`);
  console.log(`\n  📈 Used:        ${formatNumber(info.currentValue)} tokens`);
  console.log(`  📉 Remaining:   ${formatNumber(info.remaining)} tokens`);
  console.log(`  🎯 Limit:       ${formatNumber(info.usage)} tokens`);

  const timeRemaining = getTimeRemaining(info.nextResetTime);
  console.log(`\n  ⏱️  Reset in:    ${timeRemaining}`);
  console.log(`  📅 Next reset:  ${formatDate(info.nextResetTime)}`);

  console.log('\n' + '='.repeat(50) + '\n');
}

// Entry point
async function main() {
  try {
    const tokenInfo = await getTokenLimit();
    displayTokenInfo(tokenInfo);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
