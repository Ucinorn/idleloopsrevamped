import { TICK_MS, AREAS } from '../constants/areas.js'
import { tick } from './actions.js'
import { saveGame } from './saveLoad.js'

let intervalId = null
let saveCounter = 0

export function startGameLoop(store) {
  stopGameLoop()
  intervalId = setInterval(() => {
    const area = AREAS[store.currentArea]
    const dilation = area?.timeDilation ?? 1
    tick(store, dilation)

    saveCounter += 1
    if (saveCounter >= 50) {
      saveCounter = 0
      if (store.started) saveGame(store)
    }
  }, TICK_MS)
}

export function stopGameLoop() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}
