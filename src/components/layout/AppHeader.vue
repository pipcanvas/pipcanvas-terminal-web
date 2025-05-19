<script setup lang="ts">
import { ref } from 'vue'
import { Moon, Sun, BellRing, User, Settings } from 'lucide-vue-next'
import { useMarketStore } from '@/stores/market'

const marketStore = useMarketStore()
const isDarkMode = ref(true)
const notifications = ref(2)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  // In a real implementation, this would toggle the dark mode class
}
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
      <div class="relative">
        <BellRing class="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
        <span v-if="notifications > 0" class="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold">
          {{ notifications }}
        </span>
      </div>
      
      <button @click="toggleTheme" class="p-1 rounded-md hover:bg-secondary transition-colors">
        <Sun v-if="isDarkMode" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
      </button>
      
      <Settings class="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
      
      <div class="flex items-center gap-2 ml-2">
        <div class="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
          <User class="h-5 w-5" />
        </div>
        <span class="text-sm font-medium hidden md:block">Account</span>
      </div>
    </div>
  </header>
</template>