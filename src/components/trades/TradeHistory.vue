<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useMarketStore } from '@/stores/market'

const marketStore = useMarketStore()

interface Trade {
  id: number
  price: number
  amount: number
  value: number
  time: string
  isBuyer: boolean
}

const recentTrades = ref<Trade[]>([])
const maxTrades = 50

// Generate initial trades
const generateTrade = (): Trade => {
  const id = Math.floor(Math.random() * 1000000)
  const price = marketStore.lastPrice + (Math.random() * 10 - 5)
  const amount = Math.random() * 0.5 + 0.1
  const isBuyer = Math.random() > 0.5
  
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  
  return {
    id,
    price,
    amount,
    value: price * amount,
    time: `${hours}:${minutes}:${seconds}`,
    isBuyer
  }
}

const addTrade = () => {
  const newTrade = generateTrade()
  recentTrades.value.unshift(newTrade)
  
  if (recentTrades.value.length > maxTrades) {
    recentTrades.value = recentTrades.value.slice(0, maxTrades)
  }
}

// Initialize with some trades
onMounted(() => {
  for (let i = 0; i < 20; i++) {
    recentTrades.value.push(generateTrade())
  }
  
  // Sort by time (newest first)
  recentTrades.value.sort((a, b) => 
    new Date(`1970/01/01 ${b.time}`).getTime() - new Date(`1970/01/01 ${a.time}`).getTime()
  )
  
  // Add new trade every 2 seconds
  const intervalId = setInterval(addTrade, 2000)
  
  onBeforeUnmount(() => {
    clearInterval(intervalId)
  })
})
</script>

<template>
  <div class="h-full w-full flex flex-col rounded-md border border-border">
    <div class="px-3 py-2 border-b border-border">
      <div class="font-medium">Recent Trades</div>
    </div>
    
    <div class="flex-1 overflow-hidden">
      <table class="w-full">
        <thead class="text-xs text-muted-foreground sticky top-0 bg-background">
          <tr>
            <th class="font-normal text-left p-2">Price</th>
            <th class="font-normal text-right p-2">Amount</th>
            <th class="font-normal text-right p-2">Value</th>
            <th class="font-normal text-right p-2">Time</th>
          </tr>
        </thead>
        <tbody class="overflow-y-auto">
          <tr 
            v-for="trade in recentTrades" 
            :key="trade.id" 
            class="hover:bg-secondary/30 text-sm"
          >
            <td 
              class="text-left p-2"
              :class="trade.isBuyer ? 'text-gain' : 'text-loss'"
            >
              {{ trade.price.toFixed(2) }}
            </td>
            <td class="text-right p-2">{{ trade.amount.toFixed(4) }}</td>
            <td class="text-right p-2">{{ trade.value.toFixed(2) }}</td>
            <td class="text-right p-2 text-muted-foreground">{{ trade.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>