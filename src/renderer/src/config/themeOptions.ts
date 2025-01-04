import AuraDarkTheme from '../themes/aura-dark'

export const themes = {
  'aura-dark': {
    name: 'Aura Dark',
    config: AuraDarkTheme
  }
} as const

export const themeOptions = Object.entries(themes).map(([key, theme]) => ({
  value: key,
  label: theme.name
}))

export type EditorTheme = keyof typeof themes
