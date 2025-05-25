<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMarketStore } from '@/stores/market'
import PositionActions from './PositionActions.vue'
import { Badge } from '@/components/ui/badge'

const marketStore = useMarketStore()
const activeTab = ref('positions')

interface Position {
  symbol: string
  side: 'long' | 'short'
  size: number
  leverage: number
  entryPrice: number
  markPrice: number
  liquidationPrice: number
  margin: number
  pnl: number
  pnlPercentage: number
  roe: number
}

interface PositionHistory {
  id: string
  symbol: string
  side: 'long' | 'short'
  size: number
  leverage: number
  entryPrice: number
  closePrice: number
  pnl: number
  pnlPercentage: number
  roe: number
  openTime: string
  closeTime: string
  duration: string
}

// Sample positions data
const positions = ref<Position[]>([
  {
    symbol: 'BTCUSDT',
    side: 'long',
    size: 0.235,
    leverage: 10,
    entryPrice: 64250.25,
    markPrice: 66432.50,
    liquidationPrice: 58243.12,
    margin: 1509.88,
    pnl: 512.93,
    pnlPercentage: 3.4,
    roe: 34.0
  },
  {
    symbol: 'ETHUSDT',
    side: 'short',
    size: 1.85,
    leverage: 5,
    entryPrice: 3489.75,
    markPrice: 3451.25,
    liquidationPrice: 3767.23,
    margin: 1290.21,
    pnl: 71.17,
    pnlPercentage: 0.55,
    roe: 5.5
  }
])

// Sample position history data
const positionHistory = ref<PositionHistory[]>([
  {
    id: 'PH001',
    symbol: 'BTCUSDT',
    side: 'long',
    size: 0.5,
    leverage: 10,
    entryPrice: 62150.25,
    closePrice: 64532.50,
    pnl: 1191.125,
    pnlPercentage: 3.83,
    roe: 38.3,
    openTime: '2024-03-15 09:30:25',
    closeTime: '2024-03-15 14:45:12',
    duration: '5h 15m'
  },
  {
    id: 'PH002',
    symbol: 'ETHUSDT',
    side: 'short',
    size: 2.5,
    leverage: 5,
    entryPrice: 3550.75,
    closePrice: 3489.25,
    pnl: 153.75,
    pnlPercentage: 1.73,
    roe: 8.65,
    openTime: '2024-03-15 11:20:15',
    closeTime: '2024-03-15 13:15:45',
    duration: '1h 55m'
  },
  {
    id: 'PH003',
    symbol: 'SOLUSDT',
    side: 'long',
    size: 15,
    leverage: 3,
    entryPrice: 125.50,
    closePrice: 118.75,
    pnl: -101.25,
    pnlPercentage: -5.37,
    roe: -16.11,
    openTime: '2024-03-15 08:45:30',
    closeTime: '2024-03-15 12:30:15',
    duration: '3h 45m'
  }
])

// Sample open orders data
const openOrders = ref([
  {
    id: '125463892',
    symbol: 'BTCUSDT',
    side: 'buy',
    type: 'Limit',
    price: 62500.00,
    amount: 0.1,
    filled: 0,
    total: 6250.00,
    status: 'open',
    time: '10:32:45'
  },
  {
    id: '125463891',
    symbol: 'SOLUSDT',
    side: 'sell',
    type: 'Stop Limit',
    price: 150.00,
    amount: 5,
    filled: 0,
    total: 750.00,
    status: 'open',
    time: '09:15:22'
  }
])

// Sample order history data
const orderHistory = ref([
  {
    id: '125463890',
    symbol: 'ETHUSDT',
    side: 'buy',
    type: 'Market',
    price: 3451.25,
    amount: 0.5,
    filled: 0.5,
    total: 1725.63,
    status: 'filled',
    time: '09:12:45'
  },
  {
    id: '125463889',
    symbol: 'BTCUSDT',
    side: 'sell',
    type: 'Limit',
    price: 67500.00,
    amount: 0.05,
    filled: 0.05,
    total: 3375.00,
    status: 'filled',
    time: '08:45:33'
  },
  {
    id: '125463888',
    symbol: 'SOLUSDT',
    side: 'buy',
    type: 'Limit',
    price: 135.00,
    amount: 10,
    filled: 0,
    total: 1350.00,
    status: 'canceled',
    time: '08:30:11'
  }
])

const handleClose = (symbol: string) => {
  // In a real app, this would submit a request to close the position
  alert(`Closing position for ${symbol}`)
}

const handlePartialClose = (symbol: string, amount: number) => {
  // In a real app, this would submit a request to partially close the position
  alert(`Partially closing ${amount} ${symbol}`)
}

const handleReverse = (symbol: string) => {
  // In a real app, this would submit a request to reverse the position
  alert(`Reversing position for ${symbol}`)
}

const cancelOrder = (id: string) => {
  // In a real app, this would submit a request to cancel the order
  alert(`Canceling order ${id}`)
}
</script>

<template>
  <div class="h-full w-full flex flex-col rounded-md border border-border">
    <div class="px-1 py-2 border-b border-border">
      <div class="flex">
        <button 
          @click="activeTab = 'positions'"
          class="flex-1 py-1 text-sm font-medium rounded transition-colors"
          :class="activeTab === 'positions' 
            ? 'bg-secondary text-foreground' 
            : 'text-muted-foreground hover:bg-secondary/50'"
        >
          <div class="flex items-center justify-center gap-2">
            Open Positions
            <Badge 
              v-if="positions.length > 0"
              :variant="activeTab === 'positions' ? 'primary' : 'secondary'"
            >
              {{ positions.length }}
            </Badge>
          </div>
        </button>
        <button 
          @click="activeTab = 'position-history'"
          class="flex-1 py-1 text-sm font-medium rounded transition-colors"
          :class="activeTab === 'position-history' 
            ? 'bg-secondary text-foreground' 
            : 'text-muted-foreground hover:bg-secondary/50'"
        >
          Position History
        </button>
        <button 
          @click="activeTab = 'open-orders'"
          class="flex-1 py-1 text-sm font-medium rounded transition-colors"
          :class="activeTab === 'open-orders' 
            ? 'bg-secondary text-foreground' 
            : 'text-muted-foreground hover:bg-secondary/50'"
        >
          <div class="flex items-center justify-center gap-2">
            Open Orders
            <Badge 
              v-if="openOrders.length > 0"
              :variant="activeTab === 'open-orders' ? 'primary' : 'secondary'"
            >
              {{ openOrders.length }}
            </Badge>
          </div>
        </button>
        <button 
          @click="activeTab = 'order-history'"
          class="flex-1 py-1 text-sm font-medium rounded transition-colors"
          :class="activeTab === 'order-history' 
            ? 'bg-secondary text-foreground' 
            : 'text-muted-foreground hover:bg-secondary/50'"
        >
          Order History
        </button>
      </div>
    </div>
    
    <div class="flex-1 overflow-hidden">
      <!-- Positions Tab -->
      <div v-if="activeTab === 'positions'" class="h-full w-full overflow-auto scrollbar-thin">
        <table class="w-full">
          <thead class="text-xs text-muted-foreground sticky top-0 bg-background">
            <tr>
              <th class="font-normal text-left p-2">Symbol</th>
              <th class="font-normal text-left p-2">Size</th>
              <th class="font-normal text-right p-2">Entry</th>
              <th class="font-normal text-right p-2">Mark</th>
              <th class="font-normal text-right p-2">PNL</th>
              <th class="font-normal text-right p-2">ROE</th>
              <th class="font-normal text-right p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="position in positions" 
              :key="position.symbol"
              class="hover:bg-secondary/30 text-sm"
            >
              <td class="p-2">
                <div class="flex items-center gap-1">
                  <span 
                    class="w-2 h-2 rounded-full"
                    :class="position.side === 'long' ? 'bg-gain' : 'bg-loss'"
                  ></span>
                  <span>{{ position.symbol }}</span>
                  <span class="text-xs text-muted-foreground">{{ position.leverage }}x</span>
                </div>
              </td>
              <td class="p-2">{{ position.size }}</td>
              <td class="text-right p-2">{{ position.entryPrice.toFixed(2) }}</td>
              <td class="text-right p-2">{{ position.markPrice.toFixed(2) }}</td>
              <td
                class="text-right p-2"
                :class="position.pnl >= 0 ? 'text-gain' : 'text-loss'"
              >
                ${{ position.pnl.toFixed(2) }}
                <span class="text-xs block">{{ position.pnl >= 0 ? '+' : '' }}{{ position.pnlPercentage.toFixed(2) }}%</span>
              </td>
              <td
                class="text-right p-2"
                :class="position.roe >= 0 ? 'text-gain' : 'text-loss'"
              >
                {{ position.roe >= 0 ? '+' : '' }}{{ position.roe.toFixed(2) }}%
              </td>
              <td class="text-right p-2">
                <PositionActions 
                  :symbol="position.symbol"
                  :size="position.size"
                  @close="handleClose(position.symbol)"
                  @partial-close="handlePartialClose(position.symbol, $event)"
                  @reverse="handleReverse(position.symbol)"
                />
              </td>
            </tr>
            <tr v-if="positions.length === 0">
              <td colspan="7" class="text-center p-4 text-muted-foreground">
                No open positions
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Position History Tab -->
      <div v-else-if="activeTab === 'position-history'" class="h-full w-full overflow-auto scrollbar-thin">
        <table class="w-full">
          <thead class="text-xs text-muted-foreground sticky top-0 bg-background">
            <tr>
              <th class="font-normal text-left p-2">Symbol</th>
              <th class="font-normal text-left p-2">Size</th>
              <th class="font-normal text-right p-2">Entry</th>
              <th class="font-normal text-right p-2">Close</th>
              <th class="font-normal text-right p-2">PNL</th>
              <th class="font-normal text-right p-2">ROE</th>
              <th class="font-normal text-right p-2">Duration</th>
              <th class="font-normal text-right p-2">Close Time</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="position in positionHistory" 
              :key="position.id"
              class="hover:bg-secondary/30 text-sm"
            >
              <td class="p-2">
                <div class="flex items-center gap-1">
                  <span 
                    class="w-2 h-2 rounded-full"
                    :class="position.side === 'long' ? 'bg-gain' : 'bg-loss'"
                  ></span>
                  <span>{{ position.symbol }}</span>
                  <span class="text-xs text-muted-foreground">{{ position.leverage }}x</span>
                </div>
              </td>
              <td class="p-2">{{ position.size }}</td>
              <td class="text-right p-2">{{ position.entryPrice.toFixed(2) }}</td>
              <td class="text-right p-2">{{ position.closePrice.toFixed(2) }}</td>
              <td
                class="text-right p-2"
                :class="position.pnl >= 0 ? 'text-gain' : 'text-loss'"
              >
                ${{ position.pnl.toFixed(2) }}
                <span class="text-xs block">{{ position.pnl >= 0 ? '+' : '' }}{{ position.pnlPercentage.toFixed(2) }}%</span>
              </td>
              <td
                class="text-right p-2"
                :class="position.roe >= 0 ? 'text-gain' : 'text-loss'"
              >
                {{ position.roe >= 0 ? '+' : '' }}{{ position.roe.toFixed(2) }}%
              </td>
              <td class="text-right p-2 text-muted-foreground">{{ position.duration }}</td>
              <td class="text-right p-2 text-muted-foreground">{{ position.closeTime }}</td>
            </tr>
            <tr v-if="positionHistory.length === 0">
              <td colspan="8" class="text-center p-4 text-muted-foreground">
                No position history
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Open Orders Tab -->
      <div v-else-if="activeTab === 'open-orders'" class="h-full w-full overflow-auto scrollbar-thin">
        <table class="w-full">
          <thead class="text-xs text-muted-foreground sticky top-0 bg-background">
            <tr>
              <th class="font-normal text-left p-2">Symbol</th>
              <th class="font-normal text-left p-2">Type</th>
              <th class="font-normal text-right p-2">Price</th>
              <th class="font-normal text-right p-2">Amount</th>
              <th class="font-normal text-right p-2">Filled</th>
              <th class="font-normal text-right p-2">Time</th>
              <th class="font-normal text-right p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="order in openOrders" 
              :key="order.id"
              class="hover:bg-secondary/30 text-sm"
            >
              <td class="p-2">
                <div class="flex items-center gap-1">
                  <span 
                    class="w-2 h-2 rounded-full"
                    :class="order.side === 'buy' ? 'bg-gain' : 'bg-loss'"
                  ></span>
                  <span>{{ order.symbol }}</span>
                </div>
              </td>
              <td class="p-2">{{ order.type }}</td>
              <td class="text-right p-2">{{ order.price.toFixed(2) }}</td>
              <td class="text-right p-2">{{ order.amount }}</td>
              <td class="text-right p-2">{{ order.filled }}/{{ order.amount }}</td>
              <td class="text-right p-2 text-muted-foreground">{{ order.time }}</td>
              <td class="text-right p-2">
                <button 
                  @click="cancelOrder(order.id)"
                  class="px-2 py-1 text-xs rounded bg-secondary hover:bg-secondary/80"
                >
                  Cancel
                </button>
              </td>
            </tr>
            <tr v-if="openOrders.length === 0">
              <td colspan="7" class="text-center p-4 text-muted-foreground">
                No open orders
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Order History Tab -->
      <div v-else-if="activeTab === 'order-history'" class="h-full w-full overflow-auto scrollbar-thin">
        <table class="w-full">
          <thead class="text-xs text-muted-foreground sticky top-0 bg-background">
            <tr>
              <th class="font-normal text-left p-2">Symbol</th>
              <th class="font-normal text-left p-2">Type</th>
              <th class="font-normal text-right p-2">Price</th>
              <th class="font-normal text-right p-2">Amount</th>
              <th class="font-normal text-right p-2">Total</th>
              <th class="font-normal text-right p-2">Status</th>
              <th class="font-normal text-right p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="order in orderHistory" 
              :key="order.id"
              class="hover:bg-secondary/30 text-sm"
            >
              <td class="p-2">
                <div class="flex items-center gap-1">
                  <span 
                    class="w-2 h-2 rounded-full"
                    :class="order.side === 'buy' ? 'bg-gain' : 'bg-loss'"
                  ></span>
                  <span>{{ order.symbol }}</span>
                </div>
              </td>
              <td class="p-2">{{ order.type }}</td>
              <td class="text-right p-2">{{ order.price.toFixed(2) }}</td>
              <td class="text-right p-2">{{ order.amount }}</td>
              <td class="text-right p-2">${{ order.total.toFixed(2) }}</td>
              <td class="text-right p-2">
                <span
                  class="text-xs px-1.5 py-0.5 rounded"
                  :class="{
                    'bg-gain/10 text-gain': order.status === 'filled',
                    'bg-warning/10 text-warning': order.status === 'open',
                    'bg-secondary text-muted-foreground': order.status === 'canceled'
                  }"
                >
                  {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
                </span>
              </td>
              <td class="text-right p-2 text-muted-foreground">{{ order.time }}</td>
            </tr>
            <tr v-if="orderHistory.length === 0">
              <td colspan="7" class="text-center p-4 text-muted-foreground">
                No order history
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
