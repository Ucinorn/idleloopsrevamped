<script setup>
import { computed } from 'vue'
import { useGameStore } from '../store/game'
import { hasSave } from '../systems/saveLoad'

const store = useGameStore()
const canContinue = computed(() => hasSave())

function begin() {
  store.startNewGame()
}

function resume() {
  store.continueGame()
}
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h1 class="display-5 mb-3">Idle Loops Revamped</h1>
        <p class="lead text-muted">
          A time-loop incremental. Finite time. Infinite resets. Break free.
        </p>

        <hr class="my-4" />

        <p>
          You are a peasant living in the woods as an apprentice woodsman. In a
          quiet glade you find a wooden stool, and on it, a small letter.
        </p>
        <p>
          Opening the letter warps time and space. A wizard has bound you to
          loop forever. Follow his instructions — complete task after task,
          grow in skill and knowledge — and perhaps you will break free.
        </p>
        <p class="mb-4">
          Or will you confront the wizard and win your freedom… or loop forever,
          slowly going mad?
        </p>

        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="btn btn-primary btn-lg" @click="begin">
            Open the Letter
          </button>
          <button
            v-if="canContinue"
            type="button"
            class="btn btn-outline-secondary btn-lg"
            @click="resume"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
