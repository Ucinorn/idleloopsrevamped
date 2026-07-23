import { ACTIONS } from '../constants/actions.js'
import { AREAS, HONEY_MAX } from '../constants/areas.js'
import { expToNextLevel } from '../constants/attributes.js'
import {
  getActionDuration,
  getActionExp,
  scaledChance,
} from './multipliers.js'
import {
  pushEffect,
  resolveChannel,
  consumeMatchedEffects,
  clearEffectStack,
} from './effects.js'

export function isActionUnlocked(action, state) {
  if (!action.unlock) return true
  const u = action.unlock

  if (u.type === 'actionCount') {
    return (state.actionCounts[u.actionId] ?? 0) >= u.count
  }
  if (u.type === 'flag') {
    return !!state.unlocks[u.flag]
  }
  if (u.type === 'skillMin') {
    return (state.skills[u.skillId] ?? 0) >= u.amount
  }
  return false
}

export function canStartAction(action, state) {
  if (!isActionUnlocked(action, state)) return false
  if (!action.requires) return true

  for (const req of action.requires) {
    if (req.type === 'item') {
      if ((state.items[req.itemId] ?? 0) < req.amount) return false
    }
  }
  return true
}

function addLoopExp(state, attrId, amount) {
  const attr = state.attributes[attrId]
  attr.loopExp += amount
  while (attr.loopExp >= expToNextLevel(attr.loopLevel)) {
    attr.loopExp -= expToNextLevel(attr.loopLevel)
    attr.loopLevel += 1
  }
}

function discover(state, kind, id) {
  if (!state.discovered[kind]) state.discovered[kind] = {}
  state.discovered[kind][id] = true
}

function channelMult(state, actionId, channel) {
  return resolveChannel(state.effectStack, actionId, channel).total
}

function applyEffects(action, state) {
  const usedChannels = new Set()

  for (const effect of action.effects ?? []) {
    if (effect.type === 'skillProgress') {
      const mult = channelMult(state, action.id, 'skillProgress')
      usedChannels.add('skillProgress')
      const amount = effect.amount * mult
      const prev = state.skills[effect.skillId] ?? 0
      state.skills[effect.skillId] = Math.min(100, prev + amount)
      discover(state, 'skills', effect.skillId)
    }

    if (effect.type === 'chanceUnlock') {
      if (state.unlocks[effect.unlockId]) continue
      let chance = effect.baseChance
      if (effect.skillScale) {
        chance = scaledChance(chance, state.skills[effect.skillScale] ?? 0)
      }
      const mult = channelMult(state, action.id, 'chance')
      usedChannels.add('chance')
      chance *= mult
      if (Math.random() < chance) {
        state.unlocks[effect.unlockId] = true
        discover(state, 'unlocks', effect.unlockId)
      }
    }

    if (effect.type === 'gainItem') {
      const max = effect.max ?? HONEY_MAX
      const prev = state.items[effect.itemId] ?? 0
      state.items[effect.itemId] = Math.min(max, prev + effect.amount)
      discover(state, 'items', effect.itemId)
    }

    if (effect.type === 'loseAllItem') {
      state.items[effect.itemId] = 0
    }

    if (effect.type === 'pushEffect') {
      pushEffect(state, effect.effect, action.id)
    }

    if (effect.type === 'completeArea') {
      state.unlocks.nextArea = true
      state.areaComplete = true
      state.isRunning = false
      discover(state, 'unlocks', 'nextArea')
    }
  }

  if (usedChannels.size > 0) {
    consumeMatchedEffects(state, action.id, [...usedChannels])
  }
}

export function currentQueueIndex(store) {
  if (store.queueIndex < 0 || store.queueIndex >= store.queue.length) return -1
  return store.queueIndex
}

export function completeCurrentAction(store) {
  const index = currentQueueIndex(store)
  if (index < 0) return

  const entry = store.queue[index]
  const action = ACTIONS[entry.actionId]
  if (!action) {
    store.queue.splice(index, 1, { ...entry, done: true, progress: 0 })
    store.queueIndex = index + 1
    return
  }

  if (!canStartAction(action, store)) {
    store.queue.splice(index, 1, { ...entry, done: true, progress: 0 })
    store.queueIndex = index + 1
    return
  }

  const exp = getActionExp(action, store.attributes, store.effectStack)
  const perAttr = exp / action.attributes.length
  for (const attrId of action.attributes) {
    addLoopExp(store, attrId, perAttr)
  }

  store.actionCounts[action.id] = (store.actionCounts[action.id] ?? 0) + 1

  applyEffects(action, store)

  const duration = getActionDuration(action, store.attributes, store.effectStack)
  store.queue.splice(index, 1, {
    ...entry,
    done: true,
    progress: duration,
  })
  store.queueIndex = index + 1
}

export function tick(store, seconds = 1) {
  if (!store.isRunning || store.areaComplete) return

  store.timeRemaining = Math.max(0, store.timeRemaining - seconds)
  if (store.timeRemaining <= 0) {
    const shouldReplay = store.replay
    resetLoop(store)
    if (shouldReplay) {
      store.isRunning = true
    }
    return
  }

  const index = currentQueueIndex(store)
  if (index < 0) return

  const entry = store.queue[index]
  const action = ACTIONS[entry.actionId]
  if (!action) {
    store.queue.splice(index, 1, { ...entry, done: true, progress: 0 })
    store.queueIndex = index + 1
    return
  }

  if (!canStartAction(action, store)) {
    store.queue.splice(index, 1, { ...entry, done: true, progress: 0 })
    store.queueIndex = index + 1
    return
  }

  const duration = getActionDuration(action, store.attributes, store.effectStack)
  const nextProgress = entry.progress + seconds

  if (nextProgress >= duration) {
    store.queue.splice(index, 1, { ...entry, progress: nextProgress })
    completeCurrentAction(store)
    return
  }

  store.queue.splice(index, 1, { ...entry, progress: nextProgress })
}

export function resetLoop(store) {
  const area = AREAS[store.currentArea]

  for (const attr of Object.values(store.attributes)) {
    const banked =
      (attr.loopLevel - 1) * 50 + attr.loopExp * 0.1
    attr.globalExp += banked
    while (attr.globalExp >= expToNextLevel(attr.globalLevel)) {
      attr.globalExp -= expToNextLevel(attr.globalLevel)
      attr.globalLevel += 1
    }
    attr.loopLevel = 1
    attr.loopExp = 0
  }

  store.items = { honey: 0 }
  clearEffectStack(store)
  store.queueIndex = 0
  store.queue = store.queue.map((entry) => ({
    ...entry,
    progress: 0,
    done: false,
  }))
  store.timeRemaining = area.duration
  store.isRunning = false
  store.areaComplete = false
}
