<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMarketStore } from '@/stores/market'

const marketStore = useMarketStore()

const orderType = ref('limit')
const orderSide = ref('buy')
const orderTypes = [
  { value: 'limit', label: 'Limit' },
  { value: 'market', label: 'Market' },
  { value: 'stop', label: 'Stop' },
  { value: 'stop_limit', label: 'Stop Limit' },
]

const leverage = ref(10)
const orderPrice = ref(marketStore.lastPrice)
const orderAmount = ref(0.1)
const availableBalance = ref(12450.32)

// Force orderPrice to update when market price changes
// This would happen via a proper store in a real application
const updateOrderPrice = () => {
  if (orderPrice.value === 0) {
    orderPrice.value = marketStore.lastPrice
  }
}

// For demonstration purposes, update the order price when market price changes
// In a real app, we would probably want to track the last price separately
setInterval(updateOrderPrice, 1000)

const orderValue = computed(() => {
  return orderPrice.value * orderAmount.value
})

const leveragedOrderValue = computed(() => {
  return orderValue.value * leverage.value
})

const maxAmount = computed(() => {
  if (orderPrice.value === 0) return 0
  return availableBalance.value / orderPrice.value
})

const increasePrice = () => {
  orderPrice.value = Math.round((orderPrice.value + 0.1) * 100) / 100
}

const decreasePrice = () => {
  if (orderPrice.value > 0.1) {
    orderPrice.value = Math.round((orderPrice.value - 0.1) * 100) / 100
  }
}

const changeAmountPercentage = (percentage: number) => {
  orderAmount.value = Math.round((maxAmount.value * percentage / 100) * 10000) / 10000
}

const increaseLeverage = () => {
  if (leverage.value < 125) {
    leverage.value++
  }
}

const decreaseLeverage = () => {
  if (leverage.value > 1) {
    leverage.value--
  }
}

const placeOrder = () => {
  // In a real app, this would submit the order to the API
  alert(`Placing ${orderSide.value} ${orderType.value} order for ${orderAmount.value} BTC at $${orderPrice.value} with ${leverage.value}x leverage`)
}
</script>

<template>
  <div class="h-full w-full flex flex-col rounded-md border border-border">
    <div class="px-3 py-2 border-b border-border">
      <div class="font-medium">Place Order</div>
    </div>
    
    <div class="flex-1 p-3 flex flex-col gap-4">
      <!-- Order Type Selection -->
      <div class="flex gap-2">
        <div class="flex flex-1 rounded-md overflow-hidden">
          <button 
            v-for="type in orderTypes" 
            :key="type.value"
            @click="orderType = type.value"
            class="flex-1 py-2 text-sm font-medium transition-colors"
            :class="orderType === type.value 
              ? 'bg-secondary text-foreground' 
              : 'text-muted-foreground hover:bg-secondary/50'"
          >
            {{ type.label }}
          </button>
        </div>
      </div>
      
      <!-- Buy/Sell Toggle -->
      <div class="grid grid-cols-2 gap-2">
        <button 
          @click="orderSide = 'buy'"
          class="py-2 rounded-md text-primary-foreground font-medium transition-colors"
          :class="orderSide === 'buy' ? 'bg-gain' : 'bg-secondary text-muted-foreground'"
        >
          Buy / Long
        </button>
        <button 
          @click="orderSide = 'sell'"
          class="py-2 rounded-md text-primary-foreground font-medium transition-colors"
          :class="orderSide === 'sell' ? 'bg-loss' : 'bg-secondary text-muted-foreground'"
        >
          Sell / Short
        </button>
      </div>
      
      <!-- Leverage Selection -->
      <div class="flex items-center gap-3">
        <div class="text-sm">Leverage:</div>
        <div class="flex-1 flex items-center">
          <button 
            @click="decreaseLeverage"
            class="h-8 w-8 flex items-center justify-center bg-secondary rounded-l-md hover:bg-secondary/80"
          >
            -
          </button>
          <div class="px-4 h-8 flex items-center justify-center border-t border-b border-border bg-background">
            {{ leverage }}x
          </div>
          <button 
            @click="increaseLeverage"
            class="h-8 w-8 flex items-center justify-center bg-secondary rounded-r-md hover:bg-secondary/80"
          >
            +
          </button>
        </div>
      </div>
      
      <!-- Price Input Field -->
      <div v-if="orderType !== 'market'" class="flex flex-col gap-1">
        <label class="text-sm">Price (USDT)</label>
        <div class="flex items-center">
          <button 
            @click="decreasePrice"
            class="h-10 w-10 flex items-center justify-center bg-secondary rounded-l-md hover:bg-secondary/80"
          >
            -
          </button>
          <input 
            v-model="orderPrice"
            type="number" 
            class="flex-1 h-10 px-3 bg-secondary/20 border-t border-b border-border focus:outline-none"
          />
          <button 
            @click="increasePrice"
            class="h-10 w-10 flex items-center justify-center bg-secondary rounded-r-md hover:bg-secondary/80"
          >
            +
          </button>
        </div>
      </div>
      
      <!-- Amount Input Field -->
      <div class="flex flex-col gap-1">
        <label class="text-sm">Amount (BTC)</label>
        <input 
          v-model="orderAmount"
          type="number" 
          class="h-10 px-3 bg-secondary/20 border border-border rounded-md focus:outline-none"
        />
        <div class="grid grid-cols-4 gap-1 mt-1">
          <button 
            v-for="percent in [25, 50, 75, 100]" 
            :key="percent"
            @click="changeAmountPercentage(percent)"
            class="text-xs py-1 bg-secondary/50 rounded hover:bg-secondary"
          >
            {{ percent }}%
          </button>
        </div>
      </div>
      
      <!-- Order Summary -->
      <div class="mt-auto flex flex-col gap-2 text-sm">
        <div class="flex justify-between">
          <span class="text-muted-foreground">Order Value:</span>
          <span>${{ orderValue.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted-foreground">Leveraged Value:</span>
          <span>${{ leveragedOrderValue.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted-foreground">Available Balance:</span>
          <span>${{ availableBalance.toFixed(2) }}</span>
        </div>
      </div>
      
      <!-- Place Order Button -->
      <button 
        @click="placeOrder"
        class="mt-2 py-3 rounded-md font-medium text-primary-foreground transition-colors"
        :class="orderSide === 'buy' ? 'bg-gain hover:bg-gain/90' : 'bg-loss hover:bg-loss/90'"
      >
        {{ orderSide === 'buy' ? 'Buy / Long' : 'Sell / Short' }} {{ marketStore.currentSymbol }}
      </button>
    </div>
  </div>
</template>