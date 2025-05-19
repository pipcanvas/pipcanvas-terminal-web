<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMarketStore } from '@/stores/market'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Slider } from '@/components/ui/slider'
import { NumberField } from '@/components/ui/number-field'
import { ChevronDown } from 'lucide-vue-next'

const marketStore = useMarketStore()

const orderType = ref('limit')
const orderSide = ref('buy')
const orderTypes = [
  { value: 'limit', label: 'Limit' },
  { value: 'market', label: 'Market' },
  { value: 'stop', label: 'Stop' },
  { value: 'stop_limit', label: 'Stop Limit' },
]

const timeInForce = ref('GTC')
const timeInForceOptions = [
  { value: 'GTC', label: 'Good Till Cancel' },
  { value: 'IOC', label: 'Immediate or Cancel' },
  { value: 'FOK', label: 'Fill or Kill' },
  { value: 'GTX', label: 'Post Only' },
]

const leverage = ref(10)
const showLeverageDialog = ref(false)
const tempLeverage = ref(10)

const orderPrice = ref(marketStore.lastPrice)
const orderAmount = ref(0.1)
const availableBalance = ref(12450.32)

// Take Profit & Stop Loss
const useTakeProfit = ref(false)
const useStopLoss = ref(false)
const takeProfitPrice = ref(0)
const stopLossPrice = ref(0)

// Force orderPrice to update when market price changes
const updateOrderPrice = () => {
  if (orderPrice.value === 0) {
    orderPrice.value = marketStore.lastPrice
  }
}

// For demonstration purposes, update the order price when market price changes
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

const handleLeverageConfirm = () => {
  leverage.value = tempLeverage.value
  showLeverageDialog.value = false
}

const placeOrder = () => {
  // In a real app, this would submit the order to the API
  alert(`Placing ${orderSide.value} ${orderType.value} order for ${orderAmount.value} BTC at $${orderPrice.value} with ${leverage.value}x leverage`)
}
</script>

<template>
  <div class="h-full w-[400px] flex flex-col rounded-md border border-border">
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
        <Button 
          variant="outline" 
          class="flex-1"
          @click="showLeverageDialog = true"
        >
          {{ leverage }}x
        </Button>
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
          <NumberField 
            v-model="orderPrice"
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
        <NumberField 
          v-model="orderAmount"
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

      <!-- Take Profit & Stop Loss -->
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <input 
            type="checkbox" 
            v-model="useTakeProfit"
            class="rounded border-border"
          />
          <label class="text-sm">Take Profit</label>
          <NumberField 
            v-if="useTakeProfit"
            v-model="takeProfitPrice"
            placeholder="TP Price"
            class="flex-1 h-8 px-2 bg-secondary/20 border border-border rounded-md"
          />
        </div>
        
        <div class="flex items-center gap-2">
          <input 
            type="checkbox" 
            v-model="useStopLoss"
            class="rounded border-border"
          />
          <label class="text-sm">Stop Loss</label>
          <NumberField 
            v-if="useStopLoss"
            v-model="stopLossPrice"
            placeholder="SL Price"
            class="flex-1 h-8 px-2 bg-secondary/20 border border-border rounded-md"
          />
        </div>
      </div>

      <!-- Time In Force -->
      <div class="flex items-center gap-2">
        <label class="text-sm">Time In Force:</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" class="flex-1 justify-between">
              {{ timeInForceOptions.find(t => t.value === timeInForce)?.label }}
              <ChevronDown class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              v-for="option in timeInForceOptions"
              :key="option.value"
              @click="timeInForce = option.value"
            >
              {{ option.label }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

    <!-- Leverage Dialog -->
    <Dialog v-model:open="showLeverageDialog">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Leverage</DialogTitle>
          <DialogDescription>
            Adjust the leverage for your position. Higher leverage means higher risk.
          </DialogDescription>
        </DialogHeader>
        
        <div class="py-6 space-y-4">
          <div class="flex items-center gap-4">
            <NumberField
              v-model="tempLeverage"
              :min="1"
              :max="125"
              class="w-24 h-10 px-3 bg-secondary/20 border border-border rounded-md"
            />
            <span class="text-xl font-medium">×</span>
          </div>
          
          <Slider
            v-model="tempLeverage"
            :min="1"
            :max="125"
            :step="1"
            class="w-full"
          />
          
          <div class="flex justify-between text-sm text-muted-foreground">
            <span>1×</span>
            <span>25×</span>
            <span>50×</span>
            <span>75×</span>
            <span>100×</span>
            <span>125×</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showLeverageDialog = false">
            Cancel
          </Button>
          <Button @click="handleLeverageConfirm">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>