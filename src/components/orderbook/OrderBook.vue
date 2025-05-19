```vue
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ArrowDown, ArrowUp, BarChart2 } from 'lucide-vue-next'
import { useMarketStore } from '@/stores/market'

const marketStore = useMarketStore()
const orderBookDepth = ref(8)
const showSpread = ref(true)
const grouping = ref(0.1)

const asks = computed(() => {
  // In a real app, this would come from the API
  // Here we're generating sample data for demonstration
  const basePrice = marketStore.lastPrice
  const result = []
  
  for (let i = 0; i < orderBookDepth.value; i++) {
    const price = basePrice + (i + 1) * grouping.value
    const size = Math.random() * 20 + 1
    const total = size * price
    
    result.push({
      price,
      size,
      total,
      percentage: size / 50 * 100 // For visualization
    })
  }
  
  return result.reverse()
})

const bids = computed(() => {
  // In a real app, this would come from the API
  // Here we're generating sample data for demonstration
  const basePrice = marketStore.lastPrice
  const result = []
  
  for (let i = 0; i < orderBookDepth.value; i++) {
    const price = basePrice - (i + 1) * grouping.value
    const size = Math.random() * 20 + 1
    const total = size * price
    
    result.push({
      price,
      size,
      total,
      percentage: size / 50 * 100 // For visualization
    })
  }
  
  return result
})

const spread = computed(() => {
  if (asks.value.length === 0 || bids.value.length === 0) return 0
  const lowestAsk = asks.value[asks.value.length - 1].price
  const highestBid = bids.value[0].price
  return lowestAsk - highestBid
})

const spreadPercentage = computed(() => {
  if (marketStore.lastPrice === 0) return 0
  return (spread.value / marketStore.lastPrice) * 100
})

// Update orderbook data every second to simulate real-time updates
let intervalId: number

onMounted(() => {
  intervalId = setInterval(() => {
    // Force recomputation of computed properties
    marketStore.lastPrice = marketStore.lastPrice + (Math.random() * 10 - 5)
  }, 1000) as unknown as number
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

const increaseDepth = () => {
  if (orderBookDepth.value < 20) {
    orderBookDepth.value += 4
  }
}

const decreaseDepth = () => {
  if (orderBookDepth.value > 4) {
    orderBookDepth.value -= 4
  }
}

const changeGrouping = (value: number) => {
  grouping.value = value
}
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex items-center justify-between px-3 py-2">
      <div class="flex border border-border rounded-md overflow-hidden">
        <button 
          @click="changeGrouping(0.01)" 
          class="px-2 py-0.5 text-xs"
          :class="grouping === 0.01 ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'"
        >
          0.01
        </button>
        <button 
          @click="changeGrouping(0.1)" 
          class="px-2 py-0.5 text-xs"
          :class="grouping === 0.1 ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'"
        >
          0.1
        </button>
        <button 
          @click="changeGrouping(1)" 
          class="px-2 py-0.5 text-xs"
          :class="grouping === 1 ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'"
        >
          1
        </button>
      </div>
      
      <div class="flex items-center gap-2">
        <button @click="increaseDepth" class="p-1 rounded hover:bg-secondary text-muted-foreground">
          <ArrowDown class="h-4 w-4" />
        </button>
        <button @click="decreaseDepth" class="p-1 rounded hover:bg-secondary text-muted-foreground">
          <ArrowUp class="h-4 w-4" />
        </button>
        <BarChart2 class="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
    
    <div class="flex-1 overflow-hidden flex flex-col">
      <!-- Asks (Sell orders) -->
      <div class="flex-1 overflow-y-auto scrollbar-thin">
        <table class="w-full">
          <thead class="text-xs text-muted-foreground">
            <tr>
              <th class="font-normal text-left p-2">Price</th>
              <th class="font-normal text-right p-2">Size</th>
              <th class="font-normal text-right p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ask, index) in asks" :key="`ask-${index}`" class="relative hover:bg-secondary/30">
              <td class="text-left p-2 text-sm text-loss">{{ ask.price.toFixed(2) }}</td>
              <td class="text-right p-2 text-sm">{{ ask.size.toFixed(3) }}</td>
              <td class="text-right p-2 text-sm">{{ ask.total.toFixed(2) }}</td>
              <div 
                class="absolute top-0 right-0 h-full bg-loss/10"
                :style="`width: ${ask.percentage}%; max-width: 100%`"
              ></div>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Spread -->
      <div v-if="showSpread" class="py-2 px-3 border-y border-border text-center">
        <span class="text-xs text-muted-foreground">Spread: </span>
        <span class="text-xs">{{ spread.toFixed(2) }} ({{ spreadPercentage.toFixed(3) }}%)</span>
      </div>
      
      <!-- Bids (Buy orders) -->
      <div class="flex-1 overflow-y-auto scrollbar-thin">
        <table class="w-full">
          <tbody>
            <tr v-for="(bid, index) in bids" :key="`bid-${index}`" class="relative hover:bg-secondary/30">
              <td class="text-left p-2 text-sm text-gain">{{ bid.price.toFixed(2) }}</td>
              <td class="text-right p-2 text-sm">{{ bid.size.toFixed(3) }}</td>
              <td class="text-right p-2 text-sm">{{ bid.total.toFixed(2) }}</td>
              <div 
                class="absolute top-0 right-0 h-full bg-gain/10"
                :style="`width: ${bid.percentage}%; max-width: 100%`"
              ></div>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
```