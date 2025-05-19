<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useTheme } from '@/composables/useTheme'

const isLoading = ref(true)
const router = useRouter()
const { isDark } = useTheme()

onMounted(() => {
  // Simulate initial loading
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<template>
  <div 
    class="h-screen flex flex-col overflow-hidden bg-background text-foreground"
    :class="{ 'dark': isDark }"
  >
    <div v-if="isLoading" class="h-screen w-screen flex items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <div class="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-muted-foreground">Loading PipCanvas...</p>
      </div>
    </div>
    
    <template v-else>
      <AppHeader />
      <main class="flex-1 overflow-hidden">
        <router-view />
      </main>
    </template>
  </div>
</template>