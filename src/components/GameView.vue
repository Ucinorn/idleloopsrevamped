<script setup>
import { useGameStore } from '../store/game'
import GameHeader from './GameHeader.vue'
import TimeControls from './TimeControls.vue'
import ActionList from './ActionList.vue'
import ActionQueue from './ActionQueue.vue'
import AttributePanel from './AttributePanel.vue'
import ProgressPanel from './ProgressPanel.vue'

const store = useGameStore()
</script>

<template>
  <div class="container-fluid py-3">
    <GameHeader />

    <div class="row g-3 mt-1">
      <div class="col-lg-3">
        <AttributePanel />
        <ProgressPanel class="mt-3" />
      </div>

      <div class="col-lg-5">
        <div class="mb-2">
          <h2 class="h4 mb-1">{{ store.area.name }}</h2>
          <p class="small text-muted mb-0">{{ store.area.task }}</p>
        </div>
        <ActionList />
      </div>

      <div class="col-lg-4">
        <TimeControls />
        <ActionQueue />
      </div>
    </div>

    <div
      v-if="store.areaComplete"
      class="alert alert-success mt-3 mb-0"
      role="alert"
    >
      You offered the honey at the waterfall cave. The wizard's magic stirs —
      the next area awaits (coming soon).
    </div>
  </div>
</template>
