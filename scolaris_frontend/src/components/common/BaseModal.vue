<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="fixed inset-0 bg-black bg-opacity-25 transition-opacity" @click="closeModal"></div>
          <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
            <div class="p-6">
              <slot></slot>
            </div>
            <div class="flex justify-end gap-3 p-6 border-t border-gray-200" v-if="showFooter">
              <button @click="closeModal" class="btn-secondary">Annuler</button>
              <button @click="confirm" class="btn-primary" :disabled="loading">
                <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  confirmText: { type: String, default: 'Confirmer' },
  showFooter: { type: Boolean, default: true },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'confirm'])

function closeModal() {
  emit('close')
}

function confirm() {
  emit('confirm')
}
</script>