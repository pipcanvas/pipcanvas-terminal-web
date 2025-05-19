<script setup lang="ts">
import { computed } from 'vue'
import { Star, ChevronDown } from 'lucide-vue-next'
import { useMarketStore } from '@/stores/market'
import AssetWatchlist from './AssetWatchlist.vue'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/composables/useTheme'

const marketStore = useMarketStore()
const { isDark } = useTheme()

const isFavorite = computed(() => {
  return marketStore.isFavorite(marketStore.currentSymbol)
})
</script>

<template>
  <div class="h-full w-full flex items-center border border-border rounded-md px-4">
    <div class="flex items-center gap-2">
      <AssetWatchlist />
      
      <div 
        class="text-sm px-2 py-0.5 rounded-sm"
        :class="marketStore.priceChangePercent >= 0 ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'"
      >
        {{ marketStore.priceChangePercent >= 0 ? '+' : '' }}{{ marketStore.priceChangePercent.toFixed(2) }}%
      </div>
    </div>
    
    <div class="ml-8 flex items-center gap-6 border-l border-border pl-6">
      <div>
        <div class="text-xs text-muted-foreground">Price</div>
        <div class="font-bold" :class="marketStore.priceChangePercent >= 0 ? 'text-gain' : 'text-loss'">
          ${{ marketStore.lastPrice.toFixed(2) }}
        </div>
      </div>
      
      <div>
        <div class="text-xs text-muted-foreground">24h High</div>
        <div>{{ marketStore.high24h.toFixed(2) }}</div>
      </div>
      
      <div>
        <div class="text-xs text-muted-foreground">24h Low</div>
        <div>{{ marketStore.low24h.toFixed(2) }}</div>
      </div>
      
      <div>
        <div class="text-xs text-muted-foreground">24h Volume</div>
        <div>{{ (marketStore.volume24h / 1000).toFixed(1) }}K</div>
      </div>
      
      <div>
        <div class="text-xs text-muted-foreground">Funding</div>
        <div class="flex items-center gap-1">
          <span :class="marketStore.fundingRate >= 0 ? 'text-gain' : 'text-loss'">
            {{ marketStore.fundingRate >= 0 ? '+' : '' }}{{ marketStore.fundingRate.toFixed(4) }}%
          </span>
          <span class="text-xs text-muted-foreground">{{ marketStore.nextFundingTime }}</span>
        </div>
      </div>
    </div>
    
    <div class="ml-auto flex items-center gap-4">
      <div>
        <div class="text-xs text-muted-foreground">Mark</div>
        <div>${{ marketStore.markPrice.toFixed(2) }}</div>
      </div>
      
      <div>
        <div class="text-xs text-muted-foreground">Index</div>
        <div>${{ marketStore.indexPrice.toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>