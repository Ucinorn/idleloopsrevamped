<script setup>
import { computed } from 'vue'
import { useGameStore } from '../store/game'
import { formatDuration } from '../constants/attributes'
import { getActionDuration } from '../systems/multipliers'
import AttributeSymbol from './AttributeSymbol.vue'

const props = defineProps({
  action: { type: Object, required: true },
  live: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
  done: { type: Boolean, default: false },
})

const store = useGameStore()

const baseTime = computed(() => props.action.duration)

const effectiveDuration = computed(() =>
  getActionDuration(props.action, store.attributes, store.effectStack)
)

const remaining = computed(() => {
  if (props.done) return 0
  return Math.max(0, effectiveDuration.value - props.progress)
})
</script>

<template>
  <div class="d-flex flex-wrap align-items-center gap-1 small">
    <AttributeSymbol
      v-for="id in action.attributes"
      :key="id"
      :attribute-id="id"
    />
    <span class="text-muted ms-1">
      <span title="Base duration">{{ formatDuration(baseTime) }}</span>
      <template v-if="live">
        <span class="mx-1">·</span>
        <span title="Time remaining at current attribute speed">
          {{ formatDuration(remaining) }} left
        </span>
      </template>
      <template v-else>
        <span class="mx-1">·</span>
        <span title="Duration at current attribute speed">
          {{ formatDuration(effectiveDuration) }}
        </span>
      </template>
    </span>
  </div>
</template>
