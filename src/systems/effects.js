/**
 * Generic effect stack.
 *
 * Each entry modifies matched actions through transparent multiplier layers.
 * Positive or negative values are allowed (e.g. additive -0.2, multiplicative 0.5).
 */

let effectSeq = 0

export function createEffectInstance(def, sourceActionId) {
  return {
    instanceId: `fx-${++effectSeq}`,
    id: def.id ?? `fx-${sourceActionId}`,
    label: def.label,
    sourceActionId,
    match: {
      actionIds: def.match?.actionIds ? [...def.match.actionIds] : null,
    },
    modifiers: (def.modifiers ?? []).map((m) => ({
      channel: m.channel,
      type: m.type === 'additive' ? 'additive' : 'multiplicative',
      value: m.value,
    })),
    charges: def.charges === undefined ? 1 : def.charges,
  }
}

export function matchesAction(effect, actionId) {
  const ids = effect.match?.actionIds
  if (!ids || ids.length === 0) return true
  return ids.includes(actionId)
}

export function getModifiersFor(stack, actionId, channel) {
  const layers = []
  for (const effect of stack) {
    if (!matchesAction(effect, actionId)) continue
    for (const mod of effect.modifiers) {
      if (mod.channel !== channel) continue
      layers.push({
        id: `${effect.instanceId}:${mod.channel}`,
        label: effect.label,
        type: mod.type,
        value: mod.value,
        effectInstanceId: effect.instanceId,
      })
    }
  }
  return layers
}

/** Resolve additive (summed then +1) and multiplicative layers into a total */
export function resolveLayers(layers) {
  let additive = 0
  let hasAdditive = false
  let multiplicative = 1

  for (const layer of layers) {
    if (layer.type === 'additive') {
      additive += layer.value
      hasAdditive = true
    } else {
      multiplicative *= layer.value
    }
  }

  const additiveTotal = hasAdditive ? 1 + additive : 1
  return {
    total: additiveTotal * multiplicative,
    layers,
    additiveTotal,
    multiplicative,
  }
}

export function resolveChannel(stack, actionId, channel) {
  return resolveLayers(getModifiersFor(stack, actionId, channel))
}

/**
 * Push an effect onto the stack.
 * If an effect with the same `id` already exists, replace it (refresh charges).
 */
export function pushEffect(state, def, sourceActionId) {
  const next = createEffectInstance(def, sourceActionId)
  const existing = state.effectStack.findIndex((e) => e.id === next.id)
  if (existing >= 0) {
    state.effectStack.splice(existing, 1, next)
  } else {
    state.effectStack.push(next)
  }

  if (!state.discovered.effects) state.discovered.effects = {}
  state.discovered.effects[next.id] = true
  return next
}

/**
 * Consume one charge from each stack entry that contributed to the given channels
 * for this action. Entries with charges === null are permanent until loop reset.
 */
export function consumeMatchedEffects(state, actionId, channels) {
  const channelSet = new Set(channels)
  const keep = []

  for (const effect of state.effectStack) {
    if (!matchesAction(effect, actionId)) {
      keep.push(effect)
      continue
    }

    const contributed = effect.modifiers.some((m) => channelSet.has(m.channel))
    if (!contributed || effect.charges === null) {
      keep.push(effect)
      continue
    }

    const charges = effect.charges - 1
    if (charges > 0) {
      keep.push({ ...effect, charges })
    }
    // else drop — charges exhausted
  }

  state.effectStack = keep
}

export function clearEffectStack(state) {
  state.effectStack = []
}

export function formatModifier(mod) {
  if (mod.type === 'additive') {
    const sign = mod.value >= 0 ? '+' : ''
    return `${sign}${mod.value}`
  }
  return `×${mod.value}`
}
