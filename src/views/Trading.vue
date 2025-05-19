<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { GridLayout, GridItem } from 'vue-grid-layout'
import TradingViewChart from '@/components/chart/TradingViewChart.vue'
import OrderBook from '@/components/orderbook/OrderBook.vue'
import OrderEntry from '@/components/order/OrderEntry.vue'
import MarketInfo from '@/components/market/MarketInfo.vue'
import TradeHistory from '@/components/trades/TradeHistory.vue'
import Positions from '@/components/positions/Positions.vue'
import { useMarketStore } from '@/stores/market'

const marketStore = useMarketStore()
const isLayoutReady = ref(false)

// Define the layout configuration
const layout = ref([
  { i: 'market-info', x: 0, y: 0, w: 12, h: 2, static: true },
  { i: 'chart', x: 0, y: 2, w: 8, h: 16 },
  { i: 'orderbook', x: 8, y: 2, w: 4, h: 8 },
  { i: 'trades', x: 8, y: 10, w: 4, h: 8 },
  { i: 'order-entry', x: 0, y: 18, w: 6, h: 8 },
  { i: 'positions', x: 6, y: 18, w: 6, h: 8 }
])

onMounted(() => {
  // Initialize market data
  marketStore.initMarketData()
  
  // Set layout ready after a small delay to ensure components are mounted
  setTimeout(() => {
    isLayoutReady.value = true
  }, 100)
})

const onLayoutUpdated = (newLayout: any) => {
  layout.value = newLayout
}
</script>

<template>
  <div class="h-full w-full p-2">
    <GridLayout
      v-model:layout="layout"
      :col-num="12"
      :row-height="30"
      :margin="[8, 8]"
      :use-css-transforms="true"
      :vertical-compact="true"
      :responsive="true"
      class="min-h-full"
      @layout-updated="onLayoutUpdated"
    >
      <!-- Market Info -->
      <GridItem :i="layout[0].i" :x="layout[0].x" :y="layout[0].y" :w="layout[0].w" :h="layout[0].h">
        <MarketInfo />
      </GridItem>

      <!-- Chart -->
      <GridItem :i="layout[1].i" :x="layout[1].x" :y="layout[1].y" :w="layout[1].w" :h="layout[1].h">
        <TradingViewChart />
      </GridItem>

      <!-- Order Book -->
      <GridItem :i="layout[2].i" :x="layout[2].x" :y="layout[2].y" :w="layout[2].w" :h="layout[2].h">
        <OrderBook />
      </GridItem>

      <!-- Trade History -->
      <GridItem :i="layout[3].i" :x="layout[3].x" :y="layout[3].y" :w="layout[3].w" :h="layout[3].h">
        <TradeHistory />
      </GridItem>

      <!-- Order Entry -->
      <GridItem :i="layout[4].i" :x="layout[4].x" :y="layout[4].y" :w="layout[4].w" :h="layout[4].h">
        <OrderEntry />
      </GridItem>

      <!-- Positions -->
      <GridItem :i="layout[5].i" :x="layout[5].x" :y="layout[5].y" :w="layout[5].w" :h="layout[5].h">
        <Positions />
      </GridItem>
    </GridLayout>
  </div>
</template>

<style scoped>
.vue-grid-layout {
  transition: opacity 0.3s ease;
  opacity: v-bind(isLayoutReady ? 1 : 0);
}

:deep(.vue-grid-item) {
  transition: transform 200ms ease, opacity 0.3s ease;
}



:deep(.vue-resizable-handle) {
  @apply opacity-0 transition-opacity duration-200;
}

:deep(.vue-grid-item:hover .vue-resizable-handle) {
  @apply opacity-100;
}
</style>