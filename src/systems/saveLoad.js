import { SAVE_KEY } from '../constants/areas.js'

export function serialize(store) {
  return {
    version: 2,
    started: store.started,
    currentArea: store.currentArea,
    timeRemaining: store.timeRemaining,
    isRunning: false,
    queue: store.queue,
    queueIndex: store.queueIndex,
    queueLimit: store.queueLimit,
    attributes: store.attributes,
    skills: store.skills,
    items: store.items,
    unlocks: store.unlocks,
    effectStack: store.effectStack,
    actionCounts: store.actionCounts,
    areaComplete: store.areaComplete,
    replay: store.replay,
    discovered: store.discovered,
    savedAt: Date.now(),
  }
}

export function saveGame(store) {
  const data = serialize(store)
  localStorage.setItem(SAVE_KEY, JSON.stringify(data))
  return data
}

export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function hasSave() {
  return !!localStorage.getItem(SAVE_KEY)
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY)
}

export function applySave(store, data) {
  if (!data || (data.version !== 1 && data.version !== 2)) return false

  store.started = data.started ?? true
  store.currentArea = data.currentArea ?? 'glade'
  store.timeRemaining = data.timeRemaining ?? store.timeRemaining
  store.isRunning = false
  store.queue = (data.queue ?? []).map((entry) => ({
    id: entry.id,
    actionId: entry.actionId,
    progress: entry.progress ?? 0,
    done: entry.done ?? false,
  }))
  store.queueIndex = data.queueIndex ?? store.queue.findIndex((e) => !e.done)
  if (store.queueIndex < 0) store.queueIndex = store.queue.length
  store.queueLimit = data.queueLimit ?? 4
  store.attributes = data.attributes ?? store.attributes
  store.skills = data.skills ?? store.skills
  store.items = data.items ?? store.items
  store.unlocks = data.unlocks ?? store.unlocks
  store.effectStack = data.effectStack ?? []
  store.actionCounts = data.actionCounts ?? store.actionCounts
  store.areaComplete = data.areaComplete ?? false
  store.replay = data.replay ?? false
  store.discovered = {
    skills: { ...(data.discovered?.skills ?? {}) },
    items: { ...(data.discovered?.items ?? {}) },
    unlocks: { ...(data.discovered?.unlocks ?? {}) },
    effects: { ...(data.discovered?.effects ?? {}) },
  }
  return true
}
