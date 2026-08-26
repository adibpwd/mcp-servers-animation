import { ANIMATION_CONFIG } from './animationConfig'

const { COLORS } = ANIMATION_CONFIG

export const COLOR_MAP = {
  cyan: COLORS.PRIMARY_CYAN,
  pink: COLORS.SECONDARY_PINK,
  gold: COLORS.GOLD
}

export const NODE_COLOR = {
  'ai-model': COLORS.PRIMARY_CYAN,
  tool: COLORS.SECONDARY_PINK
}

export const getColor = (name) => COLOR_MAP[name] || COLORS.PRIMARY_CYAN