<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TradingViewChart from '@/components/chart/TradingViewChart.vue'
import OrderEntry from '@/components/order/OrderEntry.vue'
import MarketInfo from '@/components/market/MarketInfo.vue'
import MarketData from '@/components/market/MarketData.vue'
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
  <div class="h-full w-full flex gap-2 p-2">
    <!-- Main content area -->
    <div class="flex-1 flex flex-col gap-2 min-h-0">
      <!-- Market info bar -->
      <div class="h-16">
        <MarketInfo />
      </div>
      
      <!-- Chart -->
      <div class="flex-1 min-h-0">
        <TradingViewChart />
      </div>
      
      <!-- Bottom panel -->
      <div class="h-[280px]">
        <Positions />
      </div>
    </div>
    
    <!-- Right sidebar -->
    <div class="w-[800px] flex gap-2 min-h-0">
      <!-- Market data (Order book + Trade history) -->
      <div class="w-[400px] min-h-0">
        <MarketData />
      </div>
      
      <!-- Order entry panel -->
      <div class="w-[400px] min-h-0">
        <OrderEntry />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fade-in animation for layout */
.flex {
  transition: opacity 0.3s ease;
  opacity: v-bind(isLayoutReady ? 1 : 0);
}
</style>
