<template>
  <DialogHeader>
    <DialogTitle class="dialog-header">
      <slot name="title" />
    </DialogTitle>
    <DialogDescription>
      <slot name="description" />
    </DialogDescription>
  </DialogHeader>
  <slot />
  <DialogFooter v-if="$slots.footer">
    <slot name="footer" />
  </DialogFooter>
</template>

<script setup lang="ts">
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from 'radix-vue'
</script>