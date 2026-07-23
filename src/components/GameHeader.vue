<script setup>
import { useGameStore } from '../store/game'
import { saveGame } from '../systems/saveLoad'

const store = useGameStore()

function save() {
  saveGame(store)
}

function toTitle() {
  saveGame(store)
  store.setRunning(false)
  store.started = false
}
</script>

<template>
  <div class="d-flex flex-wrap align-items-center gap-2 border-bottom pb-3 mb-1">
    <h1 class="h5 mb-0">Idle Loops Revamped</h1>
    <div class="ms-auto d-flex gap-2">
      <button type="button" class="btn btn-outline-primary btn-sm" @click="save">
        Save
      </button>
      <button type="button" class="btn btn-outline-secondary btn-sm" @click="toTitle">
        Title
      </button>
    </div>
  </div>
</template>
