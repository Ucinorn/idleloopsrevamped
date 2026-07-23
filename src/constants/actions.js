/**
 * Action effect types:
 * - skillProgress, chanceUnlock, gainItem, loseAllItem, completeArea
 * - pushEffect: add a temporary (or lasting) modifier to the effect stack
 *
 * pushEffect.effect shape:
 * {
 *   id?: string,              // stable id for discovery / replace
 *   label: string,
 *   match?: { actionIds?: string[] },
 *   modifiers: [{ channel, type, value }],
 *   charges?: number | null,  // null = until loop reset; default 1
 * }
 *
 * channels: speed | exp | skillProgress | chance
 * type: multiplicative | additive (value may be negative)
 */
export const ACTIONS = {
  studySurroundings: {
    id: 'studySurroundings',
    name: 'Study Surroundings',
    area: 'glade',
    duration: 10,
    attributes: ['memory'],
    unlock: null,
    description: 'Look around carefully. Good practice for Memory.',
    effects: [],
  },
  contemplateSituation: {
    id: 'contemplateSituation',
    name: 'Contemplate Situation',
    area: 'glade',
    duration: 30,
    attributes: ['wisdom'],
    unlock: { type: 'actionCount', actionId: 'studySurroundings', count: 10 },
    description: 'Think through what has happened. Requires Study Surroundings ×10.',
    effects: [],
  },
  screamAndKickTrees: {
    id: 'screamAndKickTrees',
    name: 'Scream and Kick Trees',
    area: 'glade',
    duration: 120,
    attributes: ['charisma', 'reaction'],
    unlock: { type: 'actionCount', actionId: 'contemplateSituation', count: 100 },
    description: 'Vent your frustration. Earns 2× EXP. Requires Contemplate Situation ×100.',
    effects: [],
    expMultiplier: 2,
  },
  searchWoods: {
    id: 'searchWoods',
    name: 'Search Woods',
    area: 'glade',
    duration: 60,
    attributes: ['memory'],
    unlock: null,
    description: '+1% Explore Woods. Small chance to find bees.',
    effects: [
      { type: 'skillProgress', skillId: 'exploreWoods', amount: 1 },
      {
        type: 'chanceUnlock',
        unlockId: 'findBees',
        baseChance: 0.005,
        skillScale: 'exploreWoods',
      },
    ],
  },
  collectHoney: {
    id: 'collectHoney',
    name: 'Collect Honey',
    area: 'glade',
    duration: 60,
    attributes: ['wisdom', 'reaction', 'willpower'],
    unlock: { type: 'flag', flag: 'findBees' },
    description: 'Gather honeycomb from the bees. Requires Find Bees.',
    effects: [{ type: 'gainItem', itemId: 'honey', amount: 1, max: 3 }],
  },
  lookForWaterfall: {
    id: 'lookForWaterfall',
    name: 'Look for Waterfall',
    area: 'glade',
    duration: 120,
    attributes: ['memory', 'willpower'],
    unlock: null,
    description: '+1% Explore Woods. Chance to find the waterfall.',
    effects: [
      { type: 'skillProgress', skillId: 'exploreWoods', amount: 1 },
      {
        type: 'chanceUnlock',
        unlockId: 'findWaterfall',
        baseChance: 0.02,
        skillScale: 'exploreWoods',
      },
    ],
  },
  listenForWaterfall: {
    id: 'listenForWaterfall',
    name: 'Listen for Waterfall',
    area: 'glade',
    duration: 30,
    attributes: ['willpower'],
    unlock: null,
    description: 'Doubles the effects of your next Look for Waterfall.',
    effects: [
      {
        type: 'pushEffect',
        effect: {
          id: 'attentiveListening',
          label: 'Attentive Listening',
          match: { actionIds: ['lookForWaterfall'] },
          modifiers: [
            { channel: 'skillProgress', type: 'multiplicative', value: 2 },
            { channel: 'chance', type: 'multiplicative', value: 2 },
          ],
          charges: 1,
        },
      },
    ],
  },
  offerHoney: {
    id: 'offerHoney',
    name: 'Offer Honey',
    area: 'glade',
    duration: 60,
    attributes: ['memory'],
    unlock: { type: 'flag', flag: 'findWaterfall' },
    requires: [{ type: 'item', itemId: 'honey', amount: 1 }],
    description: 'Bring honey to the cave by the waterfall. Completes the area.',
    effects: [
      { type: 'loseAllItem', itemId: 'honey' },
      { type: 'completeArea' },
    ],
  },
  searchDeepWoods: {
    id: 'searchDeepWoods',
    name: 'Search Deep Woods',
    area: 'glade',
    duration: 240,
    attributes: ['memory', 'reaction', 'wisdom'],
    unlock: { type: 'skillMin', skillId: 'exploreWoods', amount: 75 },
    description: 'Venture deeper. 5% chance to find a hut. Requires 75% Explore Woods.',
    effects: [
      { type: 'chanceUnlock', unlockId: 'findHut', baseChance: 0.05 },
    ],
  },
  meditate: {
    id: 'meditate',
    name: 'Meditate',
    area: 'glade',
    duration: 300,
    attributes: ['wisdom', 'memory'],
    unlock: null,
    description: 'Quiet your mind. Earns 5× EXP.',
    effects: [],
    expMultiplier: 5,
  },
}

export const AREA_ACTIONS = {
  glade: [
    'studySurroundings',
    'contemplateSituation',
    'screamAndKickTrees',
    'searchWoods',
    'collectHoney',
    'lookForWaterfall',
    'listenForWaterfall',
    'offerHoney',
    'searchDeepWoods',
    'meditate',
  ],
}
