<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TradingViewChart from '@/components/chart/TradingViewChart.vue'
import OrderBook from '@/components/orderbook/OrderBook.vue'
import OrderEntry from '@/components/order/OrderEntry.vue'
import MarketInfo from '@/components/market/MarketInfo.vue'
import TradeHistory from '@/components/trades/TradeHistory.vue'
import Positions from '@/components/positions/Positions.vue'
import { useMarketStore } from '@/stores/market'

const marketStore = useMarketStore()
const isLayoutReady = ref(false)

onMounted(() => {
  // Initialize market data
  marketStore.initMarketData()
  
  // Set layout ready after a small delay to ensure components are mounted
  setTimeout(() => {
    isLayoutReady.value = true
  }, 100)
})
</script>

<template>
  <div class="h-full w-full grid grid-cols-12 grid-rows-[auto_1fr_auto] gap-2 p-2">
    <!-- Market info bar -->
    <div class="col-span-12 h-16">
      <MarketInfo />
    </div>
    
    <!-- Main content area -->
    <div class="col-span-12 lg:col-span-8 row-span-1 min-h-0">
      <TradingViewChart />
    </div>
    
    <!-- Right sidebar for order book and history -->
    <div class="col-span-12 lg:col-span-4 row-span-1 grid grid-rows-2 gap-2 min-h-0">
      <div class="min-h-0 overflow-hidden">
        <OrderBook />
      </div>
      <div class="min-h-0 overflow-hidden">
        <TradeHistory />
      </div>
    </div>
    
    <!-- Bottom panel for order entry and positions -->
    <div class="col-span-12 h-[280px] grid grid-cols-12 gap-2">
      <div class="col-span-12 lg:col-span-6 h-full">
        <OrderEntry />
      </div>
      <div class="col-span-12 lg:col-span-6 h-full">
        <Positions />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fade-in animation for layout */
.grid {
  transition: opacity 0.3s ease;
  opacity: v-bind(isLayoutReady ? 1 : 0);
}
</style>