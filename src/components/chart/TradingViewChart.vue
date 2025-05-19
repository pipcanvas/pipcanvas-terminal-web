<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { createChart, ColorType, UTCTimestamp } from 'lightweight-charts'
import { ChevronDown, Maximize, Minimize, LineChart, BarChart, CandlestickChart } from 'lucide-vue-next'
import { useMarketStore } from '@/stores/market'

const marketStore = useMarketStore()
const chartContainer = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)
const selectedTimeframe = ref('1h')
const selectedChartType = ref('candle')

const timeframes = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '1h', label: '1h' },
  { value: '4h', label: '4h' },
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
]

const chartTypes = [
  { value: 'candle', icon: CandlestickChart, label: 'Candlestick' },
  { value: 'bar', icon: BarChart, label: 'Bar' },
  { value: 'line', icon: LineChart, label: 'Line' },
]

let chart: any = null
let candleSeries: any = null

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  
  // In a real implementation, this would toggle fullscreen mode
  setTimeout(() => {
    if (chart) {
      chart.resize(
        chartContainer.value?.clientWidth || 800, 
        chartContainer.value?.clientHeight || 500
      )
    }
  }, 100)
}

onMounted(() => {
  if (!chartContainer.value) return
  
  chart = createChart(chartContainer.value, {
    width: chartContainer.value.clientWidth,
    height: chartContainer.value.clientHeight,
    layout: {
      background: { color: 'transparent' },
      textColor: '#D9D9D9',
    },
    grid: {
      vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
      horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
    },
    rightPriceScale: {
      borderVisible: false,
    },
    timeScale: {
      borderVisible: false,
      timeVisible: true,
    },
    crosshair: {
      horzLine: {
        visible: true,
        labelVisible: true,
      },
      vertLine: {
        visible: true,
        labelVisible: true,
      },
    },
  })
  
  candleSeries = chart.addCandlestickSeries({
    upColor: '#10B981',
    downColor: '#EF4444',
    borderVisible: false,
    wickUpColor: '#10B981',
    wickDownColor: '#EF4444',
  })
  
  // Initial data loading
  updateChartData()
  
  // Handle window resize
  const handleResize = () => {
    if (chart && chartContainer.value) {
      chart.resize(
        chartContainer.value.clientWidth,
        chartContainer.value.clientHeight
      )
    }
  }
  
  window.addEventListener('resize', handleResize)
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (chart) {
      chart.remove()
    }
  })
})

const updateChartData = () => {
  if (!candleSeries) return
  
  // In a real implementation, this would fetch data based on the selected timeframe
  const currentTime = Math.floor(Date.now() / 1000) as UTCTimestamp
  const sevenDaysAgo = (currentTime - 7 * 24 * 60 * 60) as UTCTimestamp
  
  // Generate sample data
  const sampleData = []
  let time = sevenDaysAgo
  let basePrice = 65000
  let lastClose = basePrice
  
  while (time < currentTime) {
    const volatility = Math.random() * 200 - 100
    const open = lastClose
    const close = Math.max(0, open + volatility)
    const high = Math.max(open, close) + Math.random() * 100
    const low = Math.min(open, close) - Math.random() * 100
    
    sampleData.push({
      time,
      open,
      high,
      low,
      close,
    })
    
    lastClose = close
    time = (time + 3600) as UTCTimestamp // 1 hour interval
  }
  
  candleSeries.setData(sampleData)
}

watch(selectedTimeframe, () => {
  updateChartData()
})

watch(selectedChartType, (newType) => {
  if (!chart || !chartContainer.value) return
  
  // Remove previous series
  chart.removeSeries(candleSeries)
  
  // Add new series based on type
  if (newType === 'candle') {
    candleSeries = chart.addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    })
  } else if (newType === 'bar') {
    candleSeries = chart.addBarSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
    })
  } else if (newType === 'line') {
    candleSeries = chart.addLineSeries({
      color: '#3B82F6',
      lineWidth: 2,
    })
  }
  
  updateChartData()
})
</script>

<template>
  <div 
    class="h-full w-full flex flex-col rounded-md border border-border overflow-hidden"
    :class="{ 'fixed inset-0 z-50 bg-background': isFullscreen }"
  >
    <div class="px-3 py-2 border-b border-border flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="font-semibold">{{ marketStore.currentSymbol }}</div>
        <div 
          class="text-xs px-1.5 py-0.5 rounded"
          :class="marketStore.priceChangePercent >= 0 ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'"
        >
          {{ marketStore.priceChangePercent >= 0 ? '+' : '' }}{{ marketStore.priceChangePercent.toFixed(2) }}%
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <!-- Timeframe selector -->
        <div class="flex border border-border rounded-md overflow-hidden">
          <button 
            v-for="tf in timeframes" 
            :key="tf.value"
            @click="selectedTimeframe = tf.value"
            class="px-2 py-1 text-xs font-medium"
            :class="selectedTimeframe === tf.value ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'"
          >
            {{ tf.label }}
          </button>
        </div>
        
        <!-- Chart type selector -->
        <div class="flex border border-border rounded-md overflow-hidden">
          <button 
            v-for="type in chartTypes" 
            :key="type.value"
            @click="selectedChartType = type.value"
            class="px-2 py-1 flex items-center justify-center"
            :class="selectedChartType === type.value ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'"
          >
            <component :is="type.icon" class="h-4 w-4" />
          </button>
        </div>
        
        <!-- Fullscreen toggle -->
        <button 
          @click="toggleFullscreen"
          class="p-1 rounded hover:bg-secondary text-muted-foreground transition-colors"
        >
          <Maximize v-if="!isFullscreen" class="h-4 w-4" />
          <Minimize v-else class="h-4 w-4" />
        </button>
      </div>
    </div>
    
    <div ref="chartContainer" class="flex-1 w-full"></div>
  </div>
</template>