<script setup lang="ts">
import { ref } from 'vue'
import { Moon, Sun, User, ChevronDown, Settings as SettingsIcon, Bell as BellIcon } from 'lucide-vue-next' // Renamed to avoid conflict
import { useMarketStore } from '@/stores/market'
import { useTheme } from '@/composables/useTheme'
import NotificationList from '@/components/notifications/NotificationList.vue'
import SettingsDialog from '@/components/settings/SettingsDialog.vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const marketStore = useMarketStore()
const { isDark, toggleTheme } = useTheme()

// Account balance popover data
const accountBalance = ref({
  total: 12450.32,
  available: 8214.05,
  inOrders: 4236.27
})

// User accounts data for dropdown
interface UserAccount {
  id: string
  accountNumber: string
  type: 'Live' | 'Demo' | 'Eval' | 'Funded'
  balance: number
  status: 'Active' | 'Inactive' | 'Breached'
}

const userAccounts = ref<UserAccount[]>([
  { id: '1', accountNumber: 'ACC123456', type: 'Live', balance: 10050.75, status: 'Active' },
  { id: '2', accountNumber: 'ACC789012', type: 'Demo', balance: 50000.00, status: 'Active' },
  { id: '3', accountNumber: 'ACC345678', type: 'Eval', balance: 100000.00, status: 'Inactive' },
  { id: '4', accountNumber: 'ACC901234', type: 'Funded', balance: 25000.00, status: 'Active' },
  { id: '5', accountNumber: 'ACC567890', type: 'Live', balance: 5230.10, status: 'Breached' },
])

const getStatusColorClass = (status: UserAccount['status']): string => {
  switch (status) {
    case 'Active': return 'bg-green-500'
    case 'Inactive': return 'bg-gray-400 dark:bg-gray-600'
    case 'Breached': return 'bg-red-500'
    default: return 'bg-gray-300'
  }
}

const getAccountTypeBadgeVariant = (type: UserAccount['type']): 'default' | 'secondary' | 'outline' => {
  switch (type) {
    case 'Live': return 'default' // Assumed to be primary-styled
    case 'Funded': return 'secondary'
    case 'Demo': return 'outline'
    case 'Eval': return 'default' // Will use custom class for specific styling
    default: return 'default'
  }
}

const getAccountTypeBadgeCustomClass = (type: UserAccount['type']): string => {
  if (type === 'Eval') {
    // Using a muted/tertiary-like style for Eval
    return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-800'
  }
  return ''
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
</script>

<template>
  <header class="h-14 border-b border-border flex items-center justify-between px-4">
    <div class="flex items-center gap-6">
      <div class="font-bold text-xl text-primary">PipCanvas</div>
      
      <nav class="hidden md:flex items-center space-x-4">
        <a href="#" class="text-sm font-medium text-foreground hover:text-primary transition-colors">Spot</a>
        <a href="#" class="text-sm font-medium text-primary border-b-2 border-primary px-1">Futures</a>
        <a href="#" class="text-sm font-medium text-foreground hover:text-primary transition-colors">Markets</a>
        <a href="#" class="text-sm font-medium text-foreground hover:text-primary transition-colors">Tools</a>
      </nav>
    </div>
    
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Account Balance Popover -->
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" class="hidden md:flex items-center gap-2">
            <div class="text-left">
              <div class="text-xs text-muted-foreground">Total Balance</div>
              <div class="font-medium">${{ accountBalance.total.toLocaleString() }}</div>
            </div>
            <ChevronDown class="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-64" :class="isDark ? 'dark' : ''">
          <div class="space-y-3 p-1">
            <div>
              <div class="text-xs text-muted-foreground">Available Balance</div>
              <div class="text-lg font-semibold">${{ accountBalance.available.toLocaleString() }}</div>
            </div>
            <div>
              <div class="text-xs text-muted-foreground">In Orders</div>
              <div class="text-lg font-semibold">${{ accountBalance.inOrders.toLocaleString() }}</div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <NotificationList />
      
      <Button variant="ghost" size="icon" @click="toggleTheme" class="p-1 rounded-md hover:bg-secondary transition-colors">
        <Sun v-if="isDark" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
      </Button>
      
      <SettingsDialog />
      
      <!-- User Account Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" class="flex items-center gap-2 px-2 py-1 h-auto focus-visible:ring-0 focus-visible:ring-offset-0">
            <div class="h-8 w-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground">
              <User class="h-5 w-5" />
            </div>
            <span class="text-sm font-medium hidden md:block">Account</span>
            <ChevronDown class="h-4 w-4 text-muted-foreground ml-1 hidden md:block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-80 md:w-96" :class="isDark ? 'dark' : ''" align="end">
          <DropdownMenuLabel class="font-normal">
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-medium leading-none">John Doe</p>
              <p class="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div class="max-h-[300px] overflow-y-auto custom-scrollbar">
            <DropdownMenuItem 
              v-for="account in userAccounts" 
              :key="account.id"
              class="focus:bg-accent/80 cursor-pointer"
              @select.prevent
            >
              <div class="flex justify-between items-center w-full py-1">
                <div class="flex items-center gap-2">
									<div :class="['w-2.5 h-2.5 rounded-full', getStatusColorClass(account.status)]" />
									<div>
                  <div class="text-sm font-medium text-foreground">{{ account.accountNumber }}</div>
                  <div class="text-xs text-muted-foreground">{{ formatCurrency(account.balance) }}</div>
									</div>
                </div>
                <div class="flex items-center gap-2">
                  <Badge 
                    :variant="getAccountTypeBadgeVariant(account.type)"
                    :class="cn('font-semibold text-xs px-1.5 py-0.5', getAccountTypeBadgeCustomClass(account.type))"
                  >
                    {{ account.type }}
                  </Badge>
                </div>
              </div>
            </DropdownMenuItem>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="focus:bg-accent/80 cursor-pointer">
            <SettingsIcon class="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem class="focus:bg-accent/80 cursor-pointer text-red-500 dark:text-red-400 focus:text-red-600 dark:focus:text-red-500 focus:bg-red-500/10">
            <!-- Log out icon if available, or just text -->
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>

<style scoped>
/* For custom scrollbar in dropdown if needed */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground));
}
</style>
