<script setup lang="ts">
import { ref } from 'vue'
import OrderBook from '@/components/orderbook/OrderBook.vue'
import TradeHistory from '@/components/trades/TradeHistory.vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const activeTab = ref('orderbook')
</script>

<template>
  <div class="h-full w-full flex flex-col rounded-md border border-border overflow-hidden">
    <Tabs v-model="activeTab" class="h-full flex flex-col">
      <div class="px-3 py-2 border-b border-border">
        <TabsList class="w-full grid grid-cols-2">
          <TabsTrigger value="orderbook">Order Book</TabsTrigger>
          <TabsTrigger value="trades">Recent Trades</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="orderbook" class="flex-1 overflow-hidden m-0 p-0">
        <OrderBook />
      </TabsContent>
      
      <TabsContent value="trades" class="flex-1 overflow-hidden m-0 p-0">
        <TradeHistory />
      </TabsContent>
    </Tabs>
  </div>
</template>
