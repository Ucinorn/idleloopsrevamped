<script setup>
import { computed, ref } from 'vue'
import { useGameStore } from '../store/game'
import { ACTIONS } from '../constants/actions'
import { currentQueueIndex } from '../systems/actions'
import { getActionDuration } from '../systems/multipliers'
import ActionTiming from './ActionTiming.vue'

const store = useGameStore()
const dragFrom = ref(null)

const activeIndex = computed(() => currentQueueIndex(store))

const entries = computed(() =>
  store.queue.map((entry, index) => {
    const action = ACTIONS[entry.actionId]
    const duration = action
      ? getActionDuration(action, store.attributes, store.effectStack)
      : 1
    const done = entry.done || index < store.queueIndex
    const isCurrent = index === activeIndex.value
    const pct = done
      ? 100
      : Math.min(100, (entry.progress / duration) * 100)
    return {
      id: entry.id,
      actionId: entry.actionId,
      progress: entry.progress,
      done,
      index,
      action,
      pct,
      isCurrent,
    }
  })
)

function onDragStart(index, event) {
  dragFrom.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(index))
}

function onDragOver(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

function onDrop(toIndex, event) {
  event.preventDefault()
  const from = dragFrom.value ?? Number(event.dataTransfer.getData('text/plain'))
  dragFrom.value = null
  if (Number.isNaN(from)) return
  store.moveQueue(from, toIndex)
}

function onDropRemove(event) {
  event.preventDefault()
  const from = dragFrom.value ?? Number(event.dataTransfer.getData('text/plain'))
  dragFrom.value = null
  if (Number.isNaN(from)) return
  store.removeFromQueue(from)
}

function remove(index) {
  store.removeFromQueue(index)
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h3 class="h5 mb-0">Action Queue</h3>
      <span class="small text-muted">{{ store.queue.length }} / {{ store.queueLimit }}</span>
    </div>

    <div class="list-group mb-2">
      <div
        v-for="entry in entries"
        :key="entry.id"
        class="list-group-item"
        :class="{
          'list-group-item-secondary text-muted': entry.done,
          'border-primary shadow-sm': entry.isCurrent,
        }"
        draggable="true"
        @dragstart="onDragStart(entry.index, $event)"
        @dragover="onDragOver"
        @drop="onDrop(entry.index, $event)"
      >
        <div class="d-flex justify-content-between align-items-start mb-1">
          <div class="me-2 flex-grow-1">
            <div class="small fw-semibold mb-1">
              {{ entry.action?.name ?? entry.actionId }}
              <span v-if="entry.done" class="ms-1 fw-normal">(done)</span>
            </div>
            <ActionTiming
              v-if="entry.action"
              live
              :action="entry.action"
              :progress="entry.progress"
              :done="entry.done"
            />
          </div>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger py-0 px-1"
            @click="remove(entry.index)"
          >
            ×
          </button>
        </div>
        <div
          class="progress"
          role="progressbar"
          :aria-valuenow="entry.pct"
          aria-valuemin="0"
          aria-valuemax="100"
          style="height: 5px"
        >
          <div
            class="progress-bar"
            :class="entry.done ? 'bg-secondary' : 'bg-primary'"
            :style="{ width: entry.pct + '%' }"
          />
        </div>
      </div>
    </div>

    <div
      v-if="!store.queue.length"
      class="border rounded p-3 text-center text-muted small"
    >
      Click actions to add them to the queue.
    </div>

    <div
      class="border rounded p-2 text-center text-muted small"
      @dragover="onDragOver"
      @drop="onDropRemove"
    >
      Drag here to remove
    </div>
  </div>
</template>
