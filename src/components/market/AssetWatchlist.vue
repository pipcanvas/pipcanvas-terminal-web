<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Star, ChevronDown } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useInfiniteScroll } from '@vueuse/core'
import { useMarketStore } from '@/stores/market'
import { useTheme } from '@/composables/useTheme'

interface Asset {
  symbol: string
  lastPrice: number
  prevPrice: number
  change24h: number
  volume24h: number
  isFavorite: boolean
}

const marketStore = useMarketStore()
const { isDark } = useTheme()

const searchQuery = ref('')
const activeTab = ref('favorites')
const page = ref(1)
const loading = ref(false)

// Sample data
const allAssets = ref<Asset[]>([
  { symbol: 'BTCUSDT', lastPrice: 66432.50, prevPrice: 65000.00, change24h: 2.31, volume24h: 32456789.21, isFavorite: true },
  { symbol: 'ETHUSDT', lastPrice: 3451.25, prevPrice: 3489.75, change24h: -0.54, volume24h: 12345678.90, isFavorite: true },
  { symbol: 'SOLUSDT', lastPrice: 138.76, prevPrice: 133.15, change24h: 4.21, volume24h: 5678901.23, isFavorite: true },
  { symbol: 'BNBUSDT', lastPrice: 584.32, prevPrice: 578.05, change24h: 1.08, volume24h: 4567890.12, isFavorite: false },
  { symbol: 'XRPUSDT', lastPrice: 0.5234, prevPrice: 0.5298, change24h: -1.23, volume24h: 3456789.01, isFavorite: false },
  { symbol: 'AVAXUSDT', lastPrice: 34.67, prevPrice: 33.70, change24h: 2.87, volume24h: 2345678.90, isFavorite: false },
  { symbol: 'ADAUSDT', lastPrice: 0.45, prevPrice: 0.4515, change24h: -0.32, volume24h: 1234567.89, isFavorite: false },
  { symbol: 'DOGEUSDT', lastPrice: 0.12, prevPrice: 0.1139, change24h: 5.46, volume24h: 987654.32, isFavorite: false },
])

// Filtered assets based on search and favorites
const filteredAssets = computed(() => {
  let filtered = allAssets.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(asset => 
      asset.symbol.toLowerCase().includes(query)
    )
  }
  
  if (activeTab.value === 'favorites') {
    filtered = filtered.filter(asset => asset.isFavorite)
  }
  
  return filtered
})

const currentAsset = computed(() => {
  return allAssets.value.find(asset => asset.symbol === marketStore.currentSymbol)
})

// Load more assets on scroll
const scrollEl = ref<HTMLElement | null>(null)

onMounted(() => {
  if (scrollEl.value) {
    useInfiniteScroll(
      scrollEl,
      async () => {
        if (loading.value) return
        
        loading.value = true
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        page.value++
        loading.value = false
      },
      { distance: 10 }
    )
  }
})

const toggleFavorite = (symbol: string) => {
  const asset = allAssets.value.find(a => a.symbol === symbol)
  if (asset) {
    asset.isFavorite = !asset.isFavorite
  }
}

const selectAsset = (symbol: string) => {
  marketStore.currentSymbol = symbol
}

const formatVolume = (volume: number) => {
  if (volume >= 1000000000) {
    return `${(volume / 1000000000).toFixed(1)}B`
  }
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`
  }
  return volume.toFixed(0)
}
</script>

<template>
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" class="gap-2">
        <Star
          class="h-4 w-4"
          :class="currentAsset?.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'"
        />
        <span class="font-bold text-lg">{{ marketStore.currentSymbol }}</span>
        <ChevronDown class="h-4 w-4 text-muted-foreground" />
      </Button>
    </PopoverTrigger>
    <PopoverContent 
      :class="[
        'w-[400px] p-0 max-h-[calc(100vh-100px)]',
        isDark ? 'dark' : ''
      ]"
    >
      <!-- Search Bar -->
      <div class="p-2 border-b border-border">
        <div class="relative">
          <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search markets..."
            class="w-full h-9 pl-8 pr-4 bg-transparent border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <!-- Tabs -->
      <Tabs v-model="activeTab" class="w-full">
        <div class="px-2 pt-2">
          <TabsList class="w-full grid grid-cols-2">
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </div>

        <!-- Asset List -->
        <div 
          ref="scrollEl"
          class="max-h-[400px] overflow-y-auto scrollbar-thin"
        >
          <table class="w-full">
            <thead class="sticky top-0 bg-background border-y border-border">
              <tr class="text-xs text-muted-foreground">
                <th class="text-left p-2 w-[140px]">Symbol</th>
                <th class="text-right p-2">Last Price</th>
                <th class="text-right p-2">24h Change</th>
                <th class="text-right p-2">Volume</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="asset in filteredAssets"
                :key="asset.symbol"
                @click="selectAsset(asset.symbol)"
                class="hover:bg-muted/50 cursor-pointer border-b border-border last:border-0"
              >
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <button
                      class="p-0.5 rounded hover:bg-muted"
                      @click.stop="toggleFavorite(asset.symbol)"
                    >
                      <Star
                        class="h-4 w-4"
                        :class="asset.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'"
                      />
                    </button>
                    <span>{{ asset.symbol }}</span>
                  </div>
                </td>
                <td 
                  class="text-right p-2"
                  :class="asset.lastPrice >= asset.prevPrice ? 'text-gain' : 'text-loss'"
                >
                  {{ asset.lastPrice.toFixed(2) }}
                </td>
                <td 
                  class="text-right p-2"
                  :class="asset.change24h >= 0 ? 'text-gain' : 'text-loss'"
                >
                  {{ asset.change24h >= 0 ? '+' : '' }}{{ asset.change24h.toFixed(2) }}%
                </td>
                <td class="text-right p-2 text-muted-foreground">
                  {{ formatVolume(asset.volume24h) }}
                </td>
              </tr>
            </tbody>
          </table>

          <div 
            v-if="loading" 
            class="p-4 text-center text-muted-foreground"
          >
            Loading more assets...
          </div>
        </div>
      </Tabs>
    </PopoverContent>
  </Popover>
</template>