<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useGameStore } from './store/game'
import { startGameLoop, stopGameLoop } from './systems/gameLoop'
import StartScreen from './components/StartScreen.vue'
import GameView from './components/GameView.vue'

const store = useGameStore()

onMounted(() => {
  startGameLoop(store)
})

onUnmounted(() => {
  stopGameLoop()
})

watch(
  () => store.started,
  (started) => {
    if (started) startGameLoop(store)
  }
)
</script>

<template>
  <StartScreen v-if="!store.started" />
  <GameView v-else />
</template>
