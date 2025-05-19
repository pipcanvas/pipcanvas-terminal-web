<script setup lang="ts">
import { ref, computed } from 'vue'
import { Moon, Sun, BellRing, User, Settings } from 'lucide-vue-next'
import { useMarketStore } from '@/stores/market'
import { Dialog, DialogContent } from '@/components/ui/dialog'

const marketStore = useMarketStore()
const isDarkMode = ref(true)
const notifications = ref([
  { id: 1, title: 'Position Closed', message: 'BTCUSDT long position closed at $66,432.50', time: '2 mins ago' },
  { id: 2, title: 'Order Filled', message: 'Limit buy order filled: 0.1 BTC at $65,250.00', time: '5 mins ago' },
  { id: 3, title: 'Margin Call Warning', message: 'Your position is approaching liquidation price', time: '10 mins ago' },
  { id: 4, title: 'New Feature', message: 'Try our new advanced order types', time: '1 hour ago' },
  { id: 5, title: 'Welcome Bonus', message: 'You received 100 USDT trading bonus', time: '2 hours ago' },
  { id: 6, title: 'Price Alert', message: 'BTC reached your target price of $67,000', time: '3 hours ago' }
])
const currentPage = ref(1)
const itemsPerPage = 5

const showNotifications = ref(false)
const showSettings = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark')
}

const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return notifications.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(notifications.value.length / itemsPerPage))

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
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
      <!-- Notifications -->
      <div class="relative">
        <button 
          @click="showNotifications = !showNotifications"
          class="relative"
        >
          <BellRing class="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
          <span v-if="notifications.length > 0" class="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold">
            {{ notifications.length }}
          </span>
        </button>
        
        <!-- Notifications Popover -->
        <div 
          v-if="showNotifications"
          class="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-md shadow-lg z-50"
        >
          <div class="p-4">
            <h3 class="font-semibold mb-2">Notifications</h3>
            <div class="space-y-2">
              <div 
                v-for="notification in paginatedNotifications" 
                :key="notification.id"
                class="p-2 hover:bg-secondary/50 rounded-md"
              >
                <div class="font-medium text-sm">{{ notification.title }}</div>
                <div class="text-sm text-muted-foreground">{{ notification.message }}</div>
                <div class="text-xs text-muted-foreground mt-1">{{ notification.time }}</div>
              </div>
            </div>
            
            <!-- Pagination -->
            <div class="flex justify-between items-center mt-4">
              <button 
                @click="prevPage"
                class="px-2 py-1 text-xs rounded hover:bg-secondary disabled:opacity-50"
                :disabled="currentPage === 1"
              >
                Previous
              </button>
              <span class="text-sm">{{ currentPage }} / {{ totalPages }}</span>
              <button 
                @click="nextPage"
                class="px-2 py-1 text-xs rounded hover:bg-secondary disabled:opacity-50"
                :disabled="currentPage === totalPages"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Theme Toggle -->
      <button @click="toggleTheme" class="p-1 rounded-md hover:bg-secondary transition-colors">
        <Sun v-if="isDarkMode" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
      </button>
      
      <!-- Settings -->
      <Settings 
        @click="showSettings = true"
        class="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" 
      />
      
      <!-- Settings Dialog -->
      <Dialog v-model:open="showSettings">
        <DialogContent class="max-w-3xl">
          <template #title>
            <div class="text-lg font-semibold mb-4">Settings</div>
          </template>
          
          <div class="flex">
            <!-- Settings Categories -->
            <div class="w-48 border-r border-border pr-4">
              <div class="space-y-1">
                <button class="w-full text-left px-2 py-1.5 rounded-md bg-secondary text-sm font-medium">
                  General
                </button>
                <button class="w-full text-left px-2 py-1.5 rounded-md hover:bg-secondary/50 text-sm">
                  Trading
                </button>
                <button class="w-full text-left px-2 py-1.5 rounded-md hover:bg-secondary/50 text-sm">
                  Chart
                </button>
                <button class="w-full text-left px-2 py-1.5 rounded-md hover:bg-secondary/50 text-sm">
                  Interface
                </button>
                <button class="w-full text-left px-2 py-1.5 rounded-md hover:bg-secondary/50 text-sm">
                  API
                </button>
              </div>
            </div>
            
            <!-- Settings Content -->
            <div class="flex-1 pl-6">
              <div class="space-y-6">
                <div>
                  <h3 class="text-sm font-medium mb-2">Theme</h3>
                  <div class="flex items-center space-x-2">
                    <button 
                      class="px-3 py-1.5 rounded-md text-sm"
                      :class="isDarkMode ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'"
                      @click="isDarkMode = true"
                    >
                      Dark
                    </button>
                    <button 
                      class="px-3 py-1.5 rounded-md text-sm"
                      :class="!isDarkMode ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'"
                      @click="isDarkMode = false"
                    >
                      Light
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium mb-2">Default Order Type</h3>
                  <select class="w-full bg-secondary/20 border border-border rounded-md px-3 py-1.5 text-sm">
                    <option>Limit</option>
                    <option>Market</option>
                    <option>Stop</option>
                    <option>Stop Limit</option>
                  </select>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium mb-2">Default Leverage</h3>
                  <input 
                    type="number" 
                    class="w-full bg-secondary/20 border border-border rounded-md px-3 py-1.5 text-sm"
                    value="10"
                  />
                </div>
                
                <div>
                  <h3 class="text-sm font-medium mb-2">Position Mode</h3>
                  <div class="flex items-center space-x-2">
                    <button class="px-3 py-1.5 rounded-md text-sm bg-primary text-primary-foreground">
                      One-way
                    </button>
                    <button class="px-3 py-1.5 rounded-md text-sm hover:bg-secondary">
                      Hedge
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <div class="flex items-center gap-2 ml-2">
        <div class="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
          <User class="h-5 w-5" />
        </div>
        <span class="text-sm font-medium hidden md:block">Account</span>
      </div>
    </div>
  </header>
</template>