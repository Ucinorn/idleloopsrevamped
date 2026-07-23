import {
  attributeSpeedBonus,
  attributeExpBonus,
} from '../constants/attributes.js'
import { getModifiersFor, resolveLayers } from './effects.js'

/**
 * Build transparent multiplier layers for action speed.
 * Attribute levels + matching effect-stack entries on channel `speed`.
 */
export function getSpeedMultipliers(action, attributes, effectStack = []) {
  const layers = []

  for (const attrId of action.attributes) {
    const loopLevel = attributes[attrId]?.loopLevel ?? 1
    layers.push({
      id: `attr-speed-${attrId}`,
      label: `${attrId} (Lv ${loopLevel})`,
      type: 'multiplicative',
      value: attributeSpeedBonus(loopLevel),
    })
  }

  layers.push(...getModifiersFor(effectStack, action.id, 'speed'))
  return layers
}

export function getExpMultipliers(action, attributes, effectStack = []) {
  const layers = []

  if (action.expMultiplier && action.expMultiplier !== 1) {
    layers.push({
      id: 'action-exp',
      label: 'Action bonus',
      type: 'multiplicative',
      value: action.expMultiplier,
    })
  }

  for (const attrId of action.attributes) {
    const globalLevel = attributes[attrId]?.globalLevel ?? 1
    layers.push({
      id: `attr-exp-${attrId}`,
      label: `${attrId} global (Lv ${globalLevel})`,
      type: 'multiplicative',
      value: attributeExpBonus(globalLevel),
    })
  }

  layers.push(...getModifiersFor(effectStack, action.id, 'exp'))
  return layers
}

export function resolveMultipliers(layers) {
  return resolveLayers(layers)
}

export function getActionDuration(action, attributes, effectStack = []) {
  const { total } = resolveMultipliers(
    getSpeedMultipliers(action, attributes, effectStack)
  )
  return action.duration / total
}

export function getActionExp(action, attributes, effectStack = []) {
  const base = action.duration
  const { total } = resolveMultipliers(
    getExpMultipliers(action, attributes, effectStack)
  )
  return base * total
}

/** Explore Woods scales base discovery chance */
export function scaledChance(baseChance, exploreWoodsPercent) {
  const scale = 1 + (exploreWoodsPercent * 5) / 100
  return Math.min(1, baseChance * scale)
}
