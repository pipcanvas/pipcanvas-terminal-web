<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight, Star, TrendingUp, History, Wallet, Layout } from 'lucide-vue-next'

const isCollapsed = ref(false)
const activeSymbol = ref('BTCUSDT')
const watchlist = ref([
  { symbol: 'BTCUSDT', price: 66432.50, change: 2.31 },
  { symbol: 'ETHUSDT', price: 3451.25, change: -0.54 },
  { symbol: 'SOLUSDT', price: 138.76, change: 4.21 },
  { symbol: 'BNBUSDT', price: 584.32, change: 1.08 },
  { symbol: 'XRPUSDT', price: 0.5234, change: -1.23 },
  { symbol: 'AVAXUSDT', price: 34.67, change: 2.87 },
  { symbol: 'ADAUSDT', price: 0.45, change: -0.32 },
  { symbol: 'DOGEUSDT', price: 0.12, change: 5.46 },
])

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const selectSymbol = (symbol: string) => {
  activeSymbol.value = symbol
}
</script>

<template>
  <aside 
    class="border-r border-border transition-all duration-300 flex flex-col"
    :class="[isCollapsed ? 'w-16' : 'w-64']"
  >
    <!-- Sidebar toggle -->
    <div class="h-10 flex items-center justify-end border-b border-border px-2">
      <button @click="toggleSidebar" class="p-1 rounded-md hover:bg-secondary transition-colors">
        <ChevronLeft v-if="!isCollapsed" class="h-5 w-5" />
        <ChevronRight v-else class="h-5 w-5" />
      </button>
    </div>
    
    <!-- Navigation -->
    <div class="p-2 border-b border-border">
      <div class="flex flex-col gap-1">
        <button class="flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors">
          <Star class="h-5 w-5 text-primary" />
          <span v-if="!isCollapsed" class="text-sm font-medium">Watchlist</span>
        </button>
        <button class="flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors">
          <TrendingUp class="h-5 w-5" />
          <span v-if="!isCollapsed" class="text-sm font-medium">Market Overview</span>
        </button>
        <button class="flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors">
          <History class="h-5 w-5" />
          <span v-if="!isCollapsed" class="text-sm font-medium">Trade History</span>
        </button>
        <button class="flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors">
          <Wallet class="h-5 w-5" />
          <span v-if="!isCollapsed" class="text-sm font-medium">Wallet</span>
        </button>
        <button class="flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors">
          <Layout class="h-5 w-5" />
          <span v-if="!isCollapsed" class="text-sm font-medium">Layout</span>
        </button>
      </div>
    </div>
    
    <!-- Watchlist -->
    <div class="flex-1 overflow-y-auto scrollbar-thin">
      <div v-if="!isCollapsed" class="p-3 flex justify-between items-center">
        <h3 class="text-sm font-bold text-muted-foreground">Favorite Pairs</h3>
        <span class="text-xs text-muted-foreground">24h</span>
      </div>
      
      <div class="flex flex-col">
        <button 
          v-for="item in watchlist" 
          :key="item.symbol"
          @click="selectSymbol(item.symbol)"
          class="px-3 py-2 hover:bg-secondary transition-colors flex items-center gap-2"
          :class="{ 'bg-secondary/50': activeSymbol === item.symbol }"
        >
          <Star 
            class="h-4 w-4 flex-shrink-0" 
            :class="activeSymbol === item.symbol ? 'text-primary' : 'text-muted-foreground'"
          />
          
          <template v-if="!isCollapsed">
            <div class="flex-1 flex justify-between">
              <span class="text-sm font-medium">{{ item.symbol }}</span>
              <span class="text-sm font-mono">{{ item.price.toFixed(2) }}</span>
            </div>
            <span 
              class="text-xs font-medium"
              :class="item.change >= 0 ? 'text-gain' : 'text-loss'"
            >
              {{ item.change >= 0 ? '+' : '' }}{{ item.change.toFixed(2) }}%
            </span>
          </template>
        </button>
      </div>
    </div>
    
    <!-- Account status -->
    <div class="p-3 border-t border-border" v-if="!isCollapsed">
      <div class="bg-secondary rounded-md p-3">
        <div class="text-xs text-muted-foreground mb-1">Total Balance</div>
        <div class="text-lg font-bold">$12,450.32</div>
        <div class="flex justify-between mt-2">
          <div>
            <div class="text-xs text-muted-foreground">Available</div>
            <div class="text-sm font-medium">$8,214.05</div>
          </div>
          <div>
            <div class="text-xs text-muted-foreground">In Orders</div>
            <div class="text-sm font-medium">$4,236.27</div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>