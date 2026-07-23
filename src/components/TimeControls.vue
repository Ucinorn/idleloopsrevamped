<script setup>
import { computed } from 'vue'
import { useGameStore } from '../store/game'

const store = useGameStore()

const timeLabel = computed(() => {
  const t = Math.max(0, Math.ceil(store.timeRemaining))
  const m = Math.floor(t / 60)
  const s = t % 60
  return `${m}:${String(s).padStart(2, '0')}`
})

function play() {
  store.setRunning(true)
}

function pause() {
  store.setRunning(false)
}

function reset() {
  store.requestReset()
}
</script>

<template>
  <div class="d-flex flex-wrap align-items-center gap-2 mb-2 pb-2 border-bottom">
    <span class="fw-semibold fs-5 font-monospace">{{ timeLabel }}</span>
    <span class="text-muted small">remaining</span>

    <div class="btn-group">
      <button
        type="button"
        class="btn btn-success btn-sm"
        :disabled="store.isRunning || store.areaComplete || store.timeRemaining <= 0"
        @click="play"
      >
        Play
      </button>
      <button
        type="button"
        class="btn btn-warning btn-sm"
        :disabled="!store.isRunning"
        @click="pause"
      >
        Pause
      </button>
      <button type="button" class="btn btn-danger btn-sm" @click="reset">
        Reset
      </button>
    </div>

    <div class="form-check mb-0 ms-1">
      <input
        id="replay-loop"
        v-model="store.replay"
        class="form-check-input"
        type="checkbox"
      />
      <label class="form-check-label small" for="replay-loop">
        Replay
      </label>
    </div>
  </div>
</template>
