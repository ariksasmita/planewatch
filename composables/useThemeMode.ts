export type ThemeMode = 'dark' | 'light' | 'system'

export function useThemeMode() {
  const mode = useState<ThemeMode>('theme-mode', () => 'dark')

  function applyTheme() {
    if (!import.meta.client) return
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = mode.value === 'system' ? (prefersDark ? 'dark' : 'light') : mode.value
    document.documentElement.classList.toggle('light', resolved === 'light')
    document.documentElement.classList.toggle('dark', resolved === 'dark')
  }

  function loadTheme() {
    if (!import.meta.client) return
    const stored = localStorage.getItem('planewatch-theme') as ThemeMode | null
    if (stored === 'dark' || stored === 'light' || stored === 'system') mode.value = stored
    applyTheme()
  }

  function setMode(next: ThemeMode) {
    mode.value = next
    if (import.meta.client) localStorage.setItem('planewatch-theme', next)
    applyTheme()
  }

  function cycleMode() {
    setMode(mode.value === 'dark' ? 'light' : mode.value === 'light' ? 'system' : 'light')
  }

  return { mode, loadTheme, setMode, cycleMode }
}
