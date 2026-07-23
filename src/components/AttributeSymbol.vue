<script setup>
import { computed, ref } from 'vue'
import { useGameStore } from '../store/game'
import {
  ATTRIBUTES,
  attributeSpeedBonus,
  attributeExpBonus,
  expToNextLevel,
} from '../constants/attributes'

const props = defineProps({
  attributeId: { type: String, required: true },
  size: { type: String, default: 'sm' },
})

const store = useGameStore()
const hovering = ref(false)

const meta = computed(() => ATTRIBUTES[props.attributeId])
const attr = computed(() => store.attributes[props.attributeId])

const speedMult = computed(() =>
  attributeSpeedBonus(attr.value?.loopLevel ?? 1)
)
const expMult = computed(() =>
  attributeExpBonus(attr.value?.globalLevel ?? 1)
)
const loopNeed = computed(() =>
  expToNextLevel(attr.value?.loopLevel ?? 1)
)
const globalNeed = computed(() =>
  expToNextLevel(attr.value?.globalLevel ?? 1)
)
</script>

<template>
  <span
    v-if="meta"
    class="d-inline-flex position-relative align-middle"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @click.stop
  >
    <span
      class="badge rounded-pill fw-semibold"
      :class="size === 'md' ? 'px-2 py-1' : 'px-2 py-0'"
      :style="{
        backgroundColor: meta.color,
        color: meta.textColor,
        fontSize: size === 'md' ? '0.8rem' : '0.7rem',
      }"
      :aria-label="meta.name"
    >
      {{ meta.symbol }}
    </span>

    <div
      v-show="hovering"
      class="position-absolute top-100 start-0 mt-1 p-2 bg-white border rounded shadow-sm text-start text-body"
      style="z-index: 30; min-width: 14rem; white-space: normal"
      role="tooltip"
    >
      <div class="fw-semibold mb-1">{{ meta.name }}</div>
      <div class="small text-muted mb-2">{{ meta.description }}</div>
      <div class="small">
        <div>
          Loop Lv {{ attr.loopLevel }}
          <span class="text-muted">
            ({{ Math.floor(attr.loopExp) }}/{{ loopNeed }} EXP)
          </span>
        </div>
        <div>
          Global Lv {{ attr.globalLevel }}
          <span class="text-muted">
            ({{ Math.floor(attr.globalExp) }}/{{ globalNeed }} EXP)
          </span>
        </div>
        <div class="mt-1 text-muted">
          Speed ×{{ speedMult.toFixed(2) }} · EXP ×{{ expMult.toFixed(2) }}
        </div>
      </div>
    </div>
  </span>
</template>
