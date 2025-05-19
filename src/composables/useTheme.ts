import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

const isDark = useStorage('theme-dark', true)

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    toggleTheme
  }
}