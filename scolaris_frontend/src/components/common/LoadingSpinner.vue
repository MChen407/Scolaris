<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 text-center animate-pulse-slow">
      <div class="relative mb-6">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary-600 mx-auto"></div>
        <div class="absolute inset-0 rounded-full border-4 border-transparent border-r-primary-300 animate-spin-reverse"></div>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
      <p class="text-gray-600">{{ message }}</p>
      <div class="mt-4 flex justify-center space-x-1">
        <div class="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0s"></div>
        <div class="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
        <div class="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Chargement...' },
  message: { type: String, default: 'Veuillez patienter' }
})
</script>

<style scoped>
@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

@keyframes pulse-slow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate-spin-reverse {
  animation: spin-reverse 1.5s linear infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}
</style>