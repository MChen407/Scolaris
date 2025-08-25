<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>
      
      <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
        <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full" :class="iconBgClass">
          <i :class="iconClass" class="text-xl"></i>
        </div>
        
        <h3 class="text-lg font-medium leading-6 text-gray-900 text-center mb-2">
          {{ title }}
        </h3>
        
        <p class="text-sm text-gray-500 text-center mb-6">
          {{ message }}
        </p>
        
        <div class="flex gap-3 justify-center">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {{ type === 'confirm' ? 'Annuler' : 'OK' }}
          </button>
          <button
            v-if="type === 'confirm'"
            @click="$emit('confirm')"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: Boolean,
  type: { type: String, default: 'success' }, // success, error, confirm
  title: String,
  message: String
})

defineEmits(['close', 'confirm'])

const iconClass = computed(() => {
  switch (props.type) {
    case 'success': return 'fas fa-check text-green-600'
    case 'error': return 'fas fa-times text-red-600'
    case 'confirm': return 'fas fa-exclamation-triangle text-yellow-600'
    default: return 'fas fa-info text-blue-600'
  }
})

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-100'
    case 'error': return 'bg-red-100'
    case 'confirm': return 'bg-yellow-100'
    default: return 'bg-blue-100'
  }
})
</script>