```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Moon, Sun, User, ChevronDown } from 'lucide-vue-next'
import { useMarketStore } from '@/stores/market'
import { useTheme } from '@/composables/useTheme'
import NotificationList from '@/components/notifications/NotificationList.vue'
import SettingsDialog from '@/components/settings/SettingsDialog.vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

const marketStore = useMarketStore()
const { isDark, toggleTheme } = useTheme()

// Account data
const accountBalance = ref({
  total: 12450.32,
  available: 8214.05,
  inOrders: 4236.27
})
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
      <!-- Account Balance -->
      <Popover>
        <PopoverTrigger>
          <Button variant="outline" class="hidden md:flex items-center gap-2">
            <div class="text-left">
              <div class="text-xs text-muted-foreground">Total Balance</div>
              <div class="font-medium">${{ accountBalance.total.toLocaleString() }}</div>
            </div>
            <ChevronDown class="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-64">
          <div class="space-y-3">
            <div>
              <div class="text-xs text-muted-foreground">Available Balance</div>
              <div class="text-lg font-semibold">${{ accountBalance.available.toLocaleString() }}</div>
            </div>
            <div>
              <div class="text-xs text-muted-foreground">In Orders</div>
              <div class="text-lg font-semibold">${{ accountBalance.inOrders.toLocaleString() }}</div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

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
```