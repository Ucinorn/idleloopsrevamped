<script setup>
import { useGameStore } from '../store/game'
import { ATTRIBUTES, ATTRIBUTE_IDS, expToNextLevel } from '../constants/attributes'
import AttributeSymbol from './AttributeSymbol.vue'

const store = useGameStore()

function pct(exp, level) {
  const need = expToNextLevel(level)
  return Math.min(100, (exp / need) * 100)
}
</script>

<template>
  <div>
    <h3 class="h5 mb-2">Attributes</h3>
    <div
      v-for="id in ATTRIBUTE_IDS"
      :key="id"
      class="mb-2"
    >
      <div class="d-flex justify-content-between small align-items-center">
        <span class="d-inline-flex align-items-center gap-1">
          <AttributeSymbol :attribute-id="id" />
          <span>{{ ATTRIBUTES[id].name }}</span>
        </span>
        <span class="text-muted">
          L{{ store.attributes[id].loopLevel }}
          <span class="ms-1">(G{{ store.attributes[id].globalLevel }})</span>
        </span>
      </div>
      <div
        class="progress mt-1"
        role="progressbar"
        style="height: 4px"
      >
        <div
          class="progress-bar"
          :style="{
            width: pct(store.attributes[id].loopExp, store.attributes[id].loopLevel) + '%',
            backgroundColor: ATTRIBUTES[id].color,
          }"
        />
      </div>
    </div>
    <p class="small text-muted mb-0">
      Loop levels reset each loop. Global levels bank EXP on reset and boost EXP gain.
    </p>
  </div>
</template>
