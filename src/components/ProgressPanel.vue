<script setup>
import { computed } from 'vue'
import { useGameStore } from '../store/game'
import { HONEY_MAX } from '../constants/areas'
import { ACTIONS } from '../constants/actions'
import { formatModifier } from '../systems/effects'

const store = useGameStore()

const hasAnything = computed(() => {
  const d = store.discovered
  return (
    Object.values(d.skills ?? {}).some(Boolean) ||
    Object.values(d.items ?? {}).some(Boolean) ||
    Object.values(d.unlocks ?? {}).some(Boolean) ||
    Object.values(d.effects ?? {}).some(Boolean) ||
    store.effectStack.length > 0
  )
})

function known(kind, id) {
  return !!store.discovered[kind]?.[id]
}

function matchLabel(effect) {
  const ids = effect.match?.actionIds
  if (!ids?.length) return 'all actions'
  return ids.map((id) => ACTIONS[id]?.name ?? id).join(', ')
}

function modifierSummary(effect) {
  return effect.modifiers
    .map((m) => `${m.channel} ${formatModifier(m)}`)
    .join(', ')
}

const visibleEffects = computed(() => store.effectStack)
</script>

<template>
  <div>
    <h3 class="h5 mb-2">Progress</h3>

    <p v-if="!hasAnything" class="small text-muted mb-0">
      Nothing discovered yet.
    </p>

    <template v-else>
      <div v-if="known('skills', 'exploreWoods')" class="mb-2">
        <div class="d-flex justify-content-between small">
          <span>Explore Woods</span>
          <span>{{ store.skills.exploreWoods.toFixed(1) }}%</span>
        </div>
        <div class="progress" style="height: 6px">
          <div
            class="progress-bar bg-success"
            :style="{ width: store.skills.exploreWoods + '%' }"
          />
        </div>
      </div>

      <ul class="list-unstyled small mb-2">
        <li v-if="known('items', 'honey')">
          Honey:
          <strong>{{ store.items.honey }}</strong> / {{ HONEY_MAX }}
        </li>
        <li v-if="known('unlocks', 'findBees')">
          Bees:
          <span class="text-success">Found</span>
        </li>
        <li v-if="known('unlocks', 'findWaterfall')">
          Waterfall:
          <span class="text-success">Found</span>
        </li>
        <li v-if="known('unlocks', 'findHut')">
          Hut:
          <span class="text-success">Found</span>
        </li>
      </ul>

      <div v-if="visibleEffects.length" class="small">
        <div class="fw-semibold mb-1">Active effects</div>
        <ul class="list-unstyled mb-0">
          <li
            v-for="effect in visibleEffects"
            :key="effect.instanceId"
            class="mb-1"
          >
            <span class="text-info">{{ effect.label }}</span>
            <span class="text-muted">
              — {{ modifierSummary(effect) }}
              on {{ matchLabel(effect) }}
              <template v-if="effect.charges !== null">
                ({{ effect.charges }} use<span v-if="effect.charges !== 1">s</span>)
              </template>
              <template v-else>
                (until reset)
              </template>
            </span>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
