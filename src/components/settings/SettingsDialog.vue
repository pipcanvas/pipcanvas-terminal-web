<script setup lang="ts">
import { ref } from 'vue'
import { Settings, Bell, Volume2, AlertTriangle, Eye, LineChart, Wallet, Calculator, ChevronRight } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch' // Import Switch component
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()

interface SettingCategory {
  id: string
  title: string
  icon: any
  description: string
  settings: Setting[]
}

interface Setting {
  id: string
  title: string
  description: string
  value: boolean
}

const categories = ref<SettingCategory[]>([
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    description: 'Configure how you want to be notified about trading events',
    settings: [
      {
        id: 'push-notifications',
        title: 'Push Notifications',
        description: 'Receive notifications for important trading events',
        value: true
      },
      {
        id: 'email-notifications',
        title: 'Email Notifications',
        description: 'Receive email updates for significant account events',
        value: false
      },
      {
        id: 'price-alerts',
        title: 'Price Alerts',
        description: 'Get notified when price targets are reached',
        value: true
      }
    ]
  },
  {
    id: 'sounds',
    title: 'Sound Alerts',
    icon: Volume2,
    description: 'Manage sound notifications for trading events',
    settings: [
      {
        id: 'order-filled',
        title: 'Order Filled',
        description: 'Play sound when an order is filled',
        value: true
      },
      {
        id: 'position-closed',
        title: 'Position Closed',
        description: 'Play sound when a position is closed',
        value: true
      },
      {
        id: 'liquidation-warning',
        title: 'Liquidation Warning',
        description: 'Play sound when approaching liquidation price',
        value: true
      }
    ]
  },
  {
    id: 'trading',
    title: 'Trading Preferences',
    icon: AlertTriangle,
    description: 'Configure trading behavior and confirmations',
    settings: [
      {
        id: 'confirm-orders',
        title: 'Confirm Orders',
        description: 'Show confirmation dialog before placing orders',
        value: true
      },
      {
        id: 'confirm-close',
        title: 'Confirm Position Close',
        description: 'Show confirmation dialog before closing positions',
        value: true
      },
      {
        id: 'default-leverage',
        title: 'Remember Leverage',
        description: 'Save last used leverage for each trading pair',
        value: false
      }
    ]
  },
  {
    id: 'display',
    title: 'Display Settings',
    icon: Eye,
    description: 'Customize how trading information is displayed',
    settings: [
      {
        id: 'hide-balances',
        title: 'Hide Balances',
        description: 'Hide account balance information',
        value: false
      },
      {
        id: 'compact-mode',
        title: 'Compact Mode',
        description: 'Use compact layout for order book and trades',
        value: false
      },
      {
        id: 'show-liquidations',
        title: 'Show Liquidations',
        description: 'Display liquidation prices on chart',
        value: true
      }
    ]
  },
  {
    id: 'chart',
    title: 'Chart Preferences',
    icon: LineChart,
    description: 'Configure chart behavior and appearance',
    settings: [
      {
        id: 'auto-scale',
        title: 'Auto Scale',
        description: 'Automatically adjust chart scale',
        value: true
      },
      {
        id: 'show-grid',
        title: 'Show Grid',
        description: 'Display grid lines on chart',
        value: true
      },
      {
        id: 'trading-view-style',
        title: 'TradingView Style',
        description: 'Use TradingView-like appearance',
        value: true
      }
    ]
  }
])

const selectedCategory = ref<SettingCategory | null>(null)

const toggleSetting = (settingId: string, checked: boolean) => { // Modified to accept checked state
  categories.value.forEach(category => {
    const setting = category.settings.find(s => s.id === settingId)
    if (setting) {
      setting.value = checked // Set the value directly
    }
  })
}
</script>

<template>
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="icon">
        <Settings class="h-5 w-5" />
      </Button>
    </DialogTrigger>
    <DialogContent :class="[
      'sm:max-w-[900px] p-0 gap-0',
      isDark ? 'dark' : ''
    ]">
      <DialogHeader class="p-6 border-b border-border">
        <DialogTitle class="text-foreground">Settings</DialogTitle>
      </DialogHeader>
      
      <div class="flex h-[600px]">
        <!-- Categories List -->
        <div class="w-[280px] border-r border-border">
          <div class="py-2">
            <button
              v-for="category in categories"
              :key="category.id"
              class="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
              :class="selectedCategory?.id === category.id ? 'bg-muted' : ''"
              @click="selectedCategory = category"
            >
              <component :is="category.icon" class="h-5 w-5 text-muted-foreground" />
              <div class="flex-1 text-left">
                <div class="text-sm font-medium text-foreground">{{ category.title }}</div>
                <div class="text-xs text-muted-foreground">{{ category.description }}</div>
              </div>
              <ChevronRight class="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
        
        <!-- Settings Detail -->
        <div class="flex-1 p-6">
          <div v-if="selectedCategory" class="space-y-6">
            <div class="space-y-1">
              <h2 class="text-lg font-semibold text-foreground">{{ selectedCategory.title }}</h2>
              <p class="text-sm text-muted-foreground">{{ selectedCategory.description }}</p>
            </div>
            
            <div class="space-y-4">
              <div
                v-for="setting in selectedCategory.settings"
                :key="setting.id"
                class="flex items-start justify-between gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div class="space-y-1">
                  <div class="text-sm font-medium text-foreground">{{ setting.title }}</div>
                  <div class="text-sm text-muted-foreground">{{ setting.description }}</div>
                </div>
                <!-- Replaced Button with Switch -->
                <Switch
                  :checked="setting.value"
                  @update:checked="(checked) => toggleSetting(setting.id, checked)"
                />
              </div>
            </div>
          </div>
          
          <div v-else class="h-full flex items-center justify-center text-muted-foreground">
            Select a category to view and edit settings
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
```