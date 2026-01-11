#!/usr/bin/env node
/**
 * Programme simple pour afficher l'utilisation des tokens Z.ai
 */

const BASE_URL = 'https://api.z.ai';
const AUTH_TOKEN = process.env.ANTHROPIC_AUTH_TOKEN;

if (!AUTH_TOKEN) {
  console.error('❌ Erreur: La variable d\'environnement ANTHROPIC_AUTH_TOKEN n\'est pas définie');
  process.exit(1);
}

/**
 * Récupère les limites de tokens depuis l'API Z.ai
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

  // Trouver et retourner uniquement la partie TOKENS_LIMIT
  const tokensLimit = data.data.limits.find(limit => limit.type === 'TOKENS_LIMIT');

  if (!tokensLimit) {
    throw new Error('TOKENS_LIMIT non trouvé dans la réponse');
  }

  return tokensLimit;
}

/**
 * Formate un nombre avec séparateur de milliers
 */
function formatNumber(num) {
  return new Intl.NumberFormat('fr-FR').format(num);
}

/**
 * Formette un timestamp en date lisible
 */
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
    dateStyle: 'full',
    timeStyle: 'short',
  });
}

/**
 * Calcule le temps restant jusqu'au reset
 */
function getTimeRemaining(nextResetTime) {
  const now = Date.now();
  const remaining = nextResetTime - now;

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}j ${hours}h ${minutes}min`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}min`;
  } else {
    return `${minutes}min`;
  }
}

/**
 * Affiche les infos de manière stylisée
 */
function displayTokenInfo(info) {
  console.log('\n' + '='.repeat(50));
  console.log('  📊 Z.AI - UTILISATION DES TOKENS');
  console.log('='.repeat(50));

  // Barre de progression visuelle
  const barLength = 30;
  const filled = Math.round((info.percentage / 100) * barLength);
  const empty = barLength - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  console.log(`\n  Progression: [${bar}] ${info.percentage}%`);
  console.log(`\n  📈 Utilisé:     ${formatNumber(info.currentValue)} tokens`);
  console.log(`  📉 Restant:     ${formatNumber(info.remaining)} tokens`);
  console.log(`  🎯 Limite:      ${formatNumber(info.usage)} tokens`);

  const timeRemaining = getTimeRemaining(info.nextResetTime);
  console.log(`\n  ⏱️  Reset dans:  ${timeRemaining}`);
  console.log(`  📅 Prochain reset: ${formatDate(info.nextResetTime)}`);

  console.log('\n' + '='.repeat(50) + '\n');
}

// Point d'entrée
async function main() {
  try {
    const tokenInfo = await getTokenLimit();
    displayTokenInfo(tokenInfo);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

main();
