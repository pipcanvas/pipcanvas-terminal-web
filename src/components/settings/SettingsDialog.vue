<script setup lang="ts">
import { ref } from 'vue'
import { Settings } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()

const preferences = ref({
  notifications: true,
  soundAlerts: true,
  tradeConfirmations: true,
  hideBalances: false,
  chartAutoScale: true,
  showLiquidationLevels: true,
  showPnLInBTC: false
})

const togglePreference = (key: keyof typeof preferences.value) => {
  preferences.value[key] = !preferences.value[key]
}
</script>

<template>
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="icon">
        <Settings class="h-5 w-5" />
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>
          Configure your trading preferences and notifications.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-sm font-medium">Notifications</div>
              <div class="text-xs text-muted-foreground">Receive trading notifications</div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              :class="preferences.notifications ? 'bg-primary text-primary-foreground' : ''"
              @click="togglePreference('notifications')"
            >
              {{ preferences.notifications ? 'Enabled' : 'Disabled' }}
            </Button>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-sm font-medium">Sound Alerts</div>
              <div class="text-xs text-muted-foreground">Play sounds for important events</div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              :class="preferences.soundAlerts ? 'bg-primary text-primary-foreground' : ''"
              @click="togglePreference('soundAlerts')"
            >
              {{ preferences.soundAlerts ? 'Enabled' : 'Disabled' }}
            </Button>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-sm font-medium">Trade Confirmations</div>
              <div class="text-xs text-muted-foreground">Show confirmation dialog before trades</div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              :class="preferences.tradeConfirmations ? 'bg-primary text-primary-foreground' : ''"
              @click="togglePreference('tradeConfirmations')"
            >
              {{ preferences.tradeConfirmations ? 'Enabled' : 'Disabled' }}
            </Button>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-sm font-medium">Hide Balances</div>
              <div class="text-xs text-muted-foreground">Hide account balance information</div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              :class="preferences.hideBalances ? 'bg-primary text-primary-foreground' : ''"
              @click="togglePreference('hideBalances')"
            >
              {{ preferences.hideBalances ? 'Hidden' : 'Visible' }}
            </Button>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-sm font-medium">Chart Auto-scale</div>
              <div class="text-xs text-muted-foreground">Automatically adjust chart scale</div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              :class="preferences.chartAutoScale ? 'bg-primary text-primary-foreground' : ''"
              @click="togglePreference('chartAutoScale')"
            >
              {{ preferences.chartAutoScale ? 'Enabled' : 'Disabled' }}
            </Button>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-sm font-medium">Liquidation Levels</div>
              <div class="text-xs text-muted-foreground">Show liquidation prices on chart</div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              :class="preferences.showLiquidationLevels ? 'bg-primary text-primary-foreground' : ''"
              @click="togglePreference('showLiquidationLevels')"
            >
              {{ preferences.showLiquidationLevels ? 'Visible' : 'Hidden' }}
            </Button>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-sm font-medium">PnL Display</div>
              <div class="text-xs text-muted-foreground">Show PnL in BTC instead of USDT</div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              :class="preferences.showPnLInBTC ? 'bg-primary text-primary-foreground' : ''"
              @click="togglePreference('showPnLInBTC')"
            >
              {{ preferences.showPnLInBTC ? 'In BTC' : 'In USDT' }}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>