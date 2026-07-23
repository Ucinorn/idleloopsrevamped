<script setup>
import { computed } from 'vue'
import { useGameStore } from '../store/game'
import { ACTIONS, AREA_ACTIONS } from '../constants/actions'
import { isActionUnlocked, canStartAction } from '../systems/actions'
import { getSpeedMultipliers, resolveMultipliers } from '../systems/multipliers'
import ActionTiming from './ActionTiming.vue'

const store = useGameStore()

const actions = computed(() => {
  const ids = AREA_ACTIONS[store.currentArea] ?? []
  return ids.map((id) => ACTIONS[id]).filter(Boolean)
})

function speedHint(action) {
  const { total, layers } = resolveMultipliers(
    getSpeedMultipliers(action, store.attributes, store.effectStack)
  )
  const parts = layers.map((l) => `${l.label}: ×${l.value.toFixed(2)}`)
  return `Speed ×${total.toFixed(2)}\n${parts.join('\n')}`
}

function unlocked(action) {
  return isActionUnlocked(action, store)
}

function available(action) {
  return canStartAction(action, store)
}

function add(action) {
  if (!available(action)) return
  store.enqueue(action.id)
}

function count(action) {
  return store.actionCounts[action.id] ?? 0
}
</script>

<template>
  <div class="list-group">
    <button
      v-for="action in actions"
      :key="action.id"
      type="button"
      class="list-group-item list-group-item-action"
      :class="{
        disabled: !unlocked(action),
        'list-group-item-secondary': unlocked(action) && !available(action),
      }"
      :disabled="!unlocked(action) || store.queue.length >= store.queueLimit"
      :title="unlocked(action) ? `${action.description}\n\n${speedHint(action)}` : 'Locked'"
      @click="add(action)"
    >
      <div class="fw-semibold mb-1">
        <template v-if="unlocked(action)">
          {{ action.name }}
          <span v-if="count(action)" class="fw-normal text-muted small">
            · ×{{ count(action) }}
          </span>
        </template>
        <template v-else>???</template>
      </div>
      <ActionTiming v-if="unlocked(action)" :action="action" />
      <div v-else class="small text-muted">Locked</div>
    </button>
  </div>
</template>
