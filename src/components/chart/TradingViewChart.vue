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
            @click="changeTimeframe(tf.value)"
            class="px-2 py-1 text-xs font-medium"
            :class="selectedTimeframe === tf.value ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'"
          >
            {{ tf.label }}
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

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Maximize, Minimize } from 'lucide-vue-next'
import { useMarketStore } from '@/stores/market'

const marketStore = useMarketStore()
const chartContainer = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)
const selectedTimeframe = ref('1h')

const timeframes = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '1h', label: '1h' },
  { value: '4h', label: '4h' },
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
]

let tvWidget: any = null

const initTradingView = () => {
  if (!chartContainer.value) return

  const widgetOptions = {
    symbol: marketStore.currentSymbol,
    datafeed: {
      onReady: (callback: Function) => {
        callback({
          supported_resolutions: ['1', '5', '15', '60', '240', '1D', '1W'],
          exchanges: [{ value: 'Binance', name: 'Binance', desc: 'Binance' }],
          symbols_types: [{ name: 'crypto', value: 'crypto' }],
        })
      },
      searchSymbols: () => {},
      resolveSymbol: (symbolName: string, onSymbolResolvedCallback: Function) => {
        onSymbolResolvedCallback({
          name: symbolName,
          full_name: symbolName,
          description: symbolName,
          type: 'crypto',
          session: '24x7',
          timezone: 'Etc/UTC',
          ticker: symbolName,
          minmov: 1,
          pricescale: 100,
          has_intraday: true,
          supported_resolutions: ['1', '5', '15', '60', '240', '1D', '1W'],
          volume_precision: 8,
          data_status: 'streaming',
        })
      },
      getBars: (symbolInfo: any, resolution: string, from: number, to: number, onHistoryCallback: Function) => {
        // In a real implementation, this would fetch historical data from your API
        onHistoryCallback([], { noData: true })
      },
      subscribeBars: () => {},
      unsubscribeBars: () => {},
    },
    interval: '60',
    container: chartContainer.value,
    library_path: 'https://charting-library.tradingview-widget.com/charting_library/',
    locale: 'en',
    datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo-feed-data.tradingview.com"),
    disabled_features: ['use_localstorage_for_settings'],
    enabled_features: ['study_templates'],
    charts_storage_url: 'https://saveload.tradingview.com',
    client_id: 'tradingview.com',
    user_id: 'public_user_id',
    fullscreen: false,
    autosize: true,
    theme: 'dark',
  }

  tvWidget = new (window as any).TradingView.widget(widgetOptions)
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (tvWidget) {
    setTimeout(() => {
      tvWidget.resize(
        chartContainer.value?.clientWidth || 800,
        chartContainer.value?.clientHeight || 500
      )
    }, 100)
  }
}

const changeTimeframe = (timeframe: string) => {
  selectedTimeframe.value = timeframe
  if (tvWidget && tvWidget.chart && typeof tvWidget.chart === 'function') {
    const chart = tvWidget.chart()
    if (chart) {
      const interval = timeframe.replace('m', '').replace('h', '60').replace('d', 'D').replace('w', 'W')
      chart.setResolution(interval)
    }
  }
}

onMounted(() => {
  initTradingView()
})

onUnmounted(() => {
  if (tvWidget) {
    tvWidget.remove()
  }
})
</script>