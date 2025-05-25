import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMarketStore = defineStore('market', () => {
  // Market state
  const currentSymbol = ref('BTCUSDT')
  const lastPrice = ref(66432.50)
  const high24h = ref(67892.45)
  const low24h = ref(65021.32)
  const volume24h = ref(32456789.21)
  const priceChangePercent = ref(2.31)
  const markPrice = ref(66435.75)
  const indexPrice = ref(66430.25)
  const fundingRate = ref(0.0012)
  const nextFundingTime = ref('05:32:11')
  const favorites = ref(new Set(['BTCUSDT', 'ETHUSDT', 'SOLUSDT']))
  
  // Market data initialization
  const initMarketData = () => {
    // In a real app, this would fetch initial market data from an API
    // For now, we'll just use the default values
    
    // Set up data refresh intervals
    const priceUpdateInterval = setInterval(() => {
      // Simulate price movement
      const movement = (Math.random() * 20 - 10)
      lastPrice.value += movement
      markPrice.value = lastPrice.value + (Math.random() * 10 - 5)
      indexPrice.value = lastPrice.value + (Math.random() * 10 - 5)
      
      // Update price change percentage
      priceChangePercent.value = ((lastPrice.value - 65000) / 65000) * 100
      
      // Update high/low if needed
      if (lastPrice.value > high24h.value) high24h.value = lastPrice.value
      if (lastPrice.value < low24h.value) low24h.value = lastPrice.value
      
      // Update volume
      volume24h.value += Math.random() * 10000
    }, 3000)
    
    // Clean up interval on app unmount
    // In a real app, we would need to handle this properly
  }

  const toggleFavorite = (symbol: string) => {
    if (favorites.value.has(symbol)) {
      favorites.value.delete(symbol)
    } else {
      favorites.value.add(symbol)
    }
  }

  const isFavorite = (symbol: string) => {
    return favorites.value.has(symbol)
  }
  
  // Export store properties and methods
  return {
    currentSymbol,
    lastPrice,
    high24h,
    low24h,
    volume24h,
    priceChangePercent,
    markPrice,
    indexPrice,
    fundingRate,
    nextFundingTime,
    favorites,
    initMarketData,
    toggleFavorite,
    isFavorite
  }
})
