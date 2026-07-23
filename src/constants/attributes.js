export const ATTRIBUTES = {
  willpower: {
    id: 'willpower',
    name: 'Willpower',
    symbol: 'Wp',
    color: '#F5C6CB',
    textColor: '#6B2E36',
    description: 'Persistence and pushing through pain or boredom.',
  },
  wisdom: {
    id: 'wisdom',
    name: 'Wisdom',
    symbol: 'Ws',
    color: '#C8E0C8',
    textColor: '#2F5A2F',
    description: 'Good decision-making and common sense.',
  },
  intelligence: {
    id: 'intelligence',
    name: 'Intelligence',
    symbol: 'In',
    color: '#C5D8F0',
    textColor: '#2F4A6B',
    description: 'Calculations, logic, and careful reasoning.',
  },
  memory: {
    id: 'memory',
    name: 'Memory',
    symbol: 'Me',
    color: '#F0DFC0',
    textColor: '#6B5228',
    description: 'Retaining and working with lots of information.',
  },
  reaction: {
    id: 'reaction',
    name: 'Reaction',
    symbol: 'Re',
    color: '#C5E8E2',
    textColor: '#2A5C54',
    description: 'Speed and precision under pressure.',
  },
  charisma: {
    id: 'charisma',
    name: 'Charisma',
    symbol: 'Ch',
    color: '#E8CDE0',
    textColor: '#6B3A5A',
    description: 'Interactions with others and presence.',
  },
}

export const ATTRIBUTE_IDS = Object.keys(ATTRIBUTES)

export function expToNextLevel(level) {
  return Math.floor(100 * Math.pow(1.15, level - 1))
}

export function attributeSpeedBonus(loopLevel) {
  return 1 + (loopLevel - 1) * 0.1
}

export function attributeExpBonus(globalLevel) {
  return 1 + (globalLevel - 1) * 0.05
}

export function formatDuration(seconds) {
  const s = Math.max(0, seconds)
  if (s >= 60) {
    const m = Math.floor(s / 60)
    const rem = s - m * 60
    if (rem < 0.05) return `${m}m`
    return `${m}m ${rem.toFixed(rem >= 10 ? 0 : 1)}s`
  }
  if (s >= 10) return `${s.toFixed(0)}s`
  return `${s.toFixed(1)}s`
}
