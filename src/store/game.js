import { defineStore } from 'pinia'
import { ATTRIBUTE_IDS } from '../constants/attributes.js'
import { AREAS, QUEUE_LIMIT_START } from '../constants/areas.js'
import { resetLoop } from '../systems/actions.js'
import { saveGame, loadGame, applySave, clearSave, hasSave as checkHasSave } from '../systems/saveLoad.js'

function blankAttributes() {
  const attrs = {}
  for (const id of ATTRIBUTE_IDS) {
    attrs[id] = { loopLevel: 1, loopExp: 0, globalLevel: 1, globalExp: 0 }
  }
  return attrs
}

let queueSeq = 0

export const useGameStore = defineStore('game', {
  state: () => ({
    started: false,
    currentArea: 'glade',
    timeRemaining: AREAS.glade.duration,
    isRunning: false,
    queue: [],
    queueIndex: 0,
    queueLimit: QUEUE_LIMIT_START,
    attributes: blankAttributes(),
    skills: { exploreWoods: 0 },
    items: { honey: 0 },
    unlocks: {
      findBees: false,
      findWaterfall: false,
      findHut: false,
      nextArea: false,
    },
    /** Active temporary / lasting modifiers applied by actions */
    effectStack: [],
    actionCounts: {},
    areaComplete: false,
    replay: false,
    discovered: {
      skills: {},
      items: {},
      unlocks: {},
      effects: {},
    },
  }),

  getters: {
    area(state) {
      return AREAS[state.currentArea]
    },
    hasSave() {
      return checkHasSave()
    },
  },

  actions: {
    startNewGame() {
      this.$reset()
      this.started = true
      this.timeRemaining = AREAS.glade.duration
      saveGame(this)
    },

    continueGame() {
      const data = loadGame()
      if (!data) return false
      applySave(this, data)
      this.started = true
      return true
    },

    save() {
      saveGame(this)
    },

    wipeSave() {
      clearSave()
      this.$reset()
    },

    setRunning(value) {
      this.isRunning = value
    },

    requestReset() {
      resetLoop(this)
      saveGame(this)
    },

    enqueue(actionId) {
      if (this.queue.length >= this.queueLimit) return
      this.queue.push({ id: `q-${++queueSeq}`, actionId, progress: 0, done: false })
    },

    removeFromQueue(index) {
      if (index < 0 || index >= this.queue.length) return
      this.queue.splice(index, 1)
      if (index < this.queueIndex) {
        this.queueIndex -= 1
      } else if (index === this.queueIndex) {
        if (this.queue[this.queueIndex]) {
          this.queue[this.queueIndex].progress = 0
          this.queue[this.queueIndex].done = false
        }
      }
      if (this.queueIndex > this.queue.length) {
        this.queueIndex = this.queue.length
      }
    },

    moveQueue(from, to) {
      if (from === to) return
      if (from < 0 || from >= this.queue.length) return
      if (to < 0 || to >= this.queue.length) return

      const activeId = this.queue[this.queueIndex]?.id
      const [item] = this.queue.splice(from, 1)
      this.queue.splice(to, 0, item)

      if (activeId) {
        const next = this.queue.findIndex((entry) => entry.id === activeId)
        this.queueIndex = next < 0 ? 0 : next
      }

      if (item.id === activeId) {
        item.progress = 0
      }
    },
  },
})
