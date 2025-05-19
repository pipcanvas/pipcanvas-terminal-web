<script setup lang="ts">
import { ref } from 'vue'
import { MoreVertical } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const props = defineProps<{
  symbol: string
  size: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'partialClose', amount: number): void
  (e: 'reverse'): void
}>()

const showCloseDialog = ref(false)
const showPartialDialog = ref(false)
const showReverseDialog = ref(false)
const partialAmount = ref(props.size / 2)

const handleClose = () => {
  showCloseDialog.value = false
  emit('close')
}

const handlePartialClose = () => {
  showPartialDialog.value = false
  emit('partialClose', partialAmount.value)
}

const handleReverse = () => {
  showReverseDialog.value = false
  emit('reverse')
}
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <Button variant="ghost" size="icon">
        <MoreVertical class="h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-40">
      <div class="flex flex-col space-y-1">
        <!-- Close Position Dialog -->
        <Dialog v-model:open="showCloseDialog">
          <DialogTrigger asChild>
            <Button variant="ghost" class="w-full justify-start">Close</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Close Position</DialogTitle>
              <DialogDescription>
                Are you sure you want to close your {{ symbol }} position?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" @click="showCloseDialog = false">Cancel</Button>
              <Button variant="default" @click="handleClose">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <!-- Partial Close Dialog -->
        <Dialog v-model:open="showPartialDialog">
          <DialogTrigger asChild>
            <Button variant="ghost" class="w-full justify-start">Partial Close</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Partial Close</DialogTitle>
              <DialogDescription>
                Enter the amount you want to close
              </DialogDescription>
            </DialogHeader>
            <div class="py-4">
              <input
                v-model="partialAmount"
                type="number"
                :max="props.size"
                :step="0.001"
                class="w-full rounded-md border px-3 py-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" @click="showPartialDialog = false">Cancel</Button>
              <Button variant="default" @click="handlePartialClose">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <!-- Reverse Position Dialog -->
        <Dialog v-model:open="showReverseDialog">
          <DialogTrigger asChild>
            <Button variant="ghost" class="w-full justify-start">Reverse</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reverse Position</DialogTitle>
              <DialogDescription>
                Are you sure you want to reverse your {{ symbol }} position? This will close your current position and open a new one in the opposite direction.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" @click="showReverseDialog = false">Cancel</Button>
              <Button variant="default" @click="handleReverse">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PopoverContent>
  </Popover>
</template>