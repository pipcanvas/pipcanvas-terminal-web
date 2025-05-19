<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
  import { PaginationRoot } from 'reka-ui'
import { PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
}

const notifications = ref<Notification[]>([
  {
    id: 1,
    title: 'Position Closed',
    message: 'BTCUSDT long position closed with +2.31% PNL',
    time: '2 minutes ago',
    read: false
  },
  {
    id: 2,
    title: 'Order Filled',
    message: 'Limit buy order for ETHUSDT filled at $3,451.25',
    time: '5 minutes ago',
    read: false
  },
  {
    id: 3,
    title: 'Funding Payment',
    message: 'Received funding payment of $12.45 for BTCUSDT',
    time: '15 minutes ago',
    read: false
  },
  {
    id: 4,
    title: 'Position Liquidation Warning',
    message: 'ETHUSDT position approaching liquidation price',
    time: '30 minutes ago',
    read: true
  },
  {
    id: 5,
    title: 'Market Alert',
    message: 'BTC volatility increasing, consider adjusting positions',
    time: '45 minutes ago',
    read: true
  },
  {
    id: 6,
    title: 'System Update',
    message: 'Platform maintenance scheduled in 2 hours',
    time: '1 hour ago',
    read: true
  }
])

const currentPage = ref(1)
const itemsPerPage = 5
const totalPages = Math.ceil(notifications.value.length / itemsPerPage)

const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return notifications.value.slice(start, end)
})

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const markAsRead = (id: number) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages) {
    currentPage.value++
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <Button variant="ghost" size="icon" class="relative">
        <Bell class="h-5 w-5" />
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground"
        >
          {{ unreadCount }}
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <div class="flex flex-col space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Notifications</h3>
          <span class="text-xs text-muted-foreground">{{ unreadCount }} unread</span>
        </div>
        
        <div class="space-y-2">
          <div
            v-for="notification in paginatedNotifications"
            :key="notification.id"
            class="p-2 rounded-lg hover:bg-muted cursor-pointer"
            :class="{ 'bg-muted/50': !notification.read }"
            @click="markAsRead(notification.id)"
          >
            <div class="font-medium">{{ notification.title }}</div>
            <div class="text-sm text-muted-foreground">{{ notification.message }}</div>
            <div class="text-xs text-muted-foreground mt-1">{{ notification.time }}</div>
          </div>
        </div>

        <div v-if="totalPages > 1" class="flex justify-center pt-2">
          <PaginationRoot>
          <PaginationContent>
            <PaginationPrevious
              :disabled="currentPage === 1"
              @click="goToPreviousPage"
            />
            <PaginationItem
              v-for="page in totalPages"
              :key="page"
              :is-active="currentPage === page"
              @click="currentPage = page"
            >
              {{ page }}
            </PaginationItem>
            <PaginationNext
              :disabled="currentPage === totalPages"
              @click="goToNextPage"
            />
          </PaginationContent>
            </PaginationRoot>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>