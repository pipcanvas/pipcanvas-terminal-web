```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Star } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useInfiniteScroll } from '@vueuse/core'
import { useMarketStore } from '@/stores/market'

interface Asset {
  symbol: string
  lastPrice: number
  prevPrice: number
  change24h: number
  volume24h: number
  isFavorite: boolean
}

const marketStore = useMarketStore()

// Sample data - in a real app this would come from an API
const assets = ref<Asset[]>([
  { symbol: 'BTCUSDT', lastPrice: 66432.50, prevPrice: 66430.25, change24h: 2.31, volume24h: 32456789.21, isFavorite: true },
  { symbol: 'ETHUSDT', lastPrice: 3451.25, prevPrice: 3452.50, change24h: -0.54, volume24h: 15678923.45, isFavorite: true },
  { symbol: 'SOLUSDT', lastPrice: 138.76, prevPrice: 137.25, change24h: 4.21, volume24h: 8923456.78, isFavorite: true },
  { symbol: 'BNBUSDT', lastPrice: 584.32, prevPrice: 583.15, change24h: 1.08, volume24h: 5678234.56, isFavorite: false },
  { symbol: 'XRPUSDT', lastPrice: 0.5234, prevPrice: 0.5245, change24h: -1.23, volume24h: 4567823.45, isFavorite: false },
  { symbol: 'AVAXUSDT', lastPrice: 34.67, prevPrice: 34.25, change24h: 2.87, volume24h: 3456782.34, isFavorite: false },
  { symbol: 'ADAUSDT', lastPrice: 0.45, prevPrice: 0.452, change24h: -0.32, volume24h: 2345678.23, isFavorite: false },
  { symbol: 'DOGEUSDT', lastPrice: 0.12, prevPrice: 0.115, change24h: 5.46, volume24h: 1234567.89, isFavorite: false },
])

const searchQuery = ref('')
const activeTab = ref('favorites')
const page = ref(1)
const perPage = 20

// Filter assets based on search and favorites
const filteredAssets = computed(() => {
  let filtered = assets.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(asset => asset.symbol.toLowerCase().includes(query))
  }

  // Apply favorites filter if on favorites tab
  if (activeTab.value === 'favorites') {
    filtered = filtered.filter(asset => asset.isFavorite)
  }

  return filtered
})

// Paginated assets for infinite scroll
const paginatedAssets = computed(() => {
  return filteredAssets.value.slice(0, page.value * perPage)
})

const hasMoreAssets = computed(() => {
  return paginatedAssets.value.length < filteredAssets.value.length
})

// Infinite scroll
const containerRef = ref<HTMLElement | null>(null)
const { isScrolling } = useInfiniteScroll(
  containerRef,
  () => {
    if (hasMoreAssets.value) {
      page.value++
    }
  },
  { distance: 10 }
)

const toggleFavorite = (symbol: string) => {
  const asset = assets.value.find(a => a.symbol === symbol)
  if (asset) {
    asset.isFavorite = !asset.isFavorite
  }
}

const selectAsset = (symbol: string) => {
  // In a real app, this would update the market store and trigger data fetching
  marketStore.currentSymbol = symbol
}

const formatVolume = (volume: number) => {
  if (volume >= 1000000000) {
    return `${(volume / 1000000000).toFixed(2)}B`
  }
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(2)}M`
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K`
  }
  return volume.toFixed(2)
}

// Get current asset
const currentAsset = computed(() => {
  return assets.value.find(a => a.symbol === marketStore.currentSymbol)
})
</script>

<template>
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" class="gap-2 px-0">
        <Star
          class="h-4 w-4"
          :class="currentAsset?.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'"
        />
        <span class="font-bold text-lg">{{ marketStore.currentSymbol }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[400px] p-0 max-h-[calc(100vh-100px)]">
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
      <Tabs v-model="activeTab" class="flex flex-col">
        <div class="px-2 pt-2">
          <TabsList class="w-full grid grid-cols-2">
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent 
          value="favorites"
          class="flex-1 overflow-hidden m-0 data-[state=active]:flex flex-col"
        >
          <div 
            ref="containerRef"
            class="flex-1 overflow-y-auto"
          >
            <table class="w-full">
              <thead class="sticky top-0 bg-popover border-b border-border">
                <tr class="text-xs text-muted-foreground">
                  <th class="font-normal text-left p-2">Symbol</th>
                  <th class="font-normal text-right p-2">Last Price</th>
                  <th class="font-normal text-right p-2">24h Change</th>
                  <th class="font-normal text-right p-2">24h Volume</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="asset in paginatedAssets" 
                  :key="asset.symbol"
                  class="hover:bg-muted/50 cursor-pointer"
                  @click="selectAsset(asset.symbol)"
                >
                  <td class="p-2">
                    <div class="flex items-center gap-2">
                      <button 
                        @click.stop="toggleFavorite(asset.symbol)"
                        class="p-0.5 hover:bg-muted rounded"
                      >
                        <Star
                          class="h-4 w-4"
                          :class="asset.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'"
                        />
                      </button>
                      <span class="font-medium">{{ asset.symbol }}</span>
                    </div>
                  </td>
                  <td 
                    class="p-2 text-right font-medium tabular-nums"
                    :class="asset.lastPrice >= asset.prevPrice ? 'text-gain' : 'text-loss'"
                  >
                    {{ asset.lastPrice.toFixed(2) }}
                  </td>
                  <td 
                    class="p-2 text-right tabular-nums"
                    :class="asset.change24h >= 0 ? 'text-gain' : 'text-loss'"
                  >
                    {{ asset.change24h >= 0 ? '+' : '' }}{{ asset.change24h.toFixed(2) }}%
                  </td>
                  <td class="p-2 text-right text-muted-foreground">
                    {{ formatVolume(asset.volume24h) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent 
          value="all"
          class="flex-1 overflow-hidden m-0 data-[state=active]:flex flex-col"
        >
          <div 
            ref="containerRef"
            class="flex-1 overflow-y-auto"
          >
            <table class="w-full">
              <thead class="sticky top-0 bg-popover border-b border-border">
                <tr class="text-xs text-muted-foreground">
                  <th class="font-normal text-left p-2">Symbol</th>
                  <th class="font-normal text-right p-2">Last Price</th>
                  <th class="font-normal text-right p-2">24h Change</th>
                  <th class="font-normal text-right p-2">24h Volume</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="asset in paginatedAssets" 
                  :key="asset.symbol"
                  class="hover:bg-muted/50 cursor-pointer"
                  @click="selectAsset(asset.symbol)"
                >
                  <td class="p-2">
                    <div class="flex items-center gap-2">
                      <button 
                        @click.stop="toggleFavorite(asset.symbol)"
                        class="p-0.5 hover:bg-muted rounded"
                      >
                        <Star
                          class="h-4 w-4"
                          :class="asset.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'"
                        />
                      </button>
                      <span class="font-medium">{{ asset.symbol }}</span>
                    </div>
                  </td>
                  <td 
                    class="p-2 text-right font-medium tabular-nums"
                    :class="asset.lastPrice >= asset.prevPrice ? 'text-gain' : 'text-loss'"
                  >
                    {{ asset.lastPrice.toFixed(2) }}
                  </td>
                  <td 
                    class="p-2 text-right tabular-nums"
                    :class="asset.change24h >= 0 ? 'text-gain' : 'text-loss'"
                  >
                    {{ asset.change24h >= 0 ? '+' : '' }}{{ asset.change24h.toFixed(2) }}%
                  </td>
                  <td class="p-2 text-right text-muted-foreground">
                    {{ formatVolume(asset.volume24h) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </PopoverContent>
  </Popover>
</template>
```