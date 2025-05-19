<script setup lang="ts">
import { ref } from 'vue'
import { Moon, Sun, User } from 'lucide-vue-next'
import { useMarketStore } from '@/stores/market'
import { useTheme } from '@/composables/useTheme'
import NotificationList from '@/components/notifications/NotificationList.vue'
import SettingsDialog from '@/components/settings/SettingsDialog.vue'

const marketStore = useMarketStore()
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <header class="h-14 border-b border-border flex items-center justify-between px-4">
    <div class="flex items-center gap-6">
      <div class="font-bold text-xl text-primary">PipCanvas</div>
      
      <nav class="hidden md:flex items-center space-x-4">
        <a href="#" class="text-sm font-medium text-foreground hover:text-primary transition-colors">Spot</a>
        <a href="#" class="text-sm font-medium text-primary border-b-2 border-primary px-1">Futures</a>
        <a href="#" class="text-sm font-medium text-foreground hover:text-primary transition-colors">Markets</a>
        <a href="#" class="text-sm font-medium text-foreground hover:text-primary transition-colors">Tools</a>
      </nav>
    </div>
    
    <div class="flex items-center gap-4">
      <NotificationList />
      
      <button @click="toggleTheme" class="p-1 rounded-md hover:bg-secondary transition-colors">
        <Sun v-if="isDark" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
      </button>
      
      <SettingsDialog />
      
      <div class="flex items-center gap-2 ml-2">
        <div class="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
          <User class="h-5 w-5" />
        </div>
        <span class="text-sm font-medium hidden md:block">Account</span>
      </div>
    </div>
  </header>
</template>