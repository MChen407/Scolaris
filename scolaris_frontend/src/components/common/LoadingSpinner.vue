<template>
  <Transition name="fade">
    <div v-if="show"
         class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
         aria-live="polite"
         role="status">
      
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all duration-300 scale-95"
           :class="{ 'scale-100': show }">

        <div class="mb-6">
          <svg class="w-16 h-16 mx-auto text-primary-600 animate-spin"
               viewBox="0 0 50 50">
            <circle class="path"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke-width="4"
                    stroke-miterlimit="10"></circle>
          </svg>
        </div>

        <h3 class="text-xl font-bold text-gray-800 mb-2">{{ title }}</h3>
        <p class="text-gray-600 text-sm">{{ message }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Chargement...' },
  message: { type: String, default: 'Veuillez patienter pendant la récupération des données.' }
});

// Optionnel: Pour les cas où le chargement est trop rapide.
onMounted(() => {
  // Optionnel: Si vous voulez un chargement minimum de 500ms
  // pour éviter un "flash" à l'écran.
  // if (props.show) {
  //   const start = Date.now();
  //   const minDuration = 500;
  //   setTimeout(() => {
  //     if (Date.now() - start < minDuration) {
  //       // Do nothing, let the natural flow handle it
  //     }
  //   }, minDuration);
  // }
});
</script>

<style scoped>
/* Transition douce pour l'apparition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animations CSS natives pour l'icône de chargement */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.path {
  stroke-dasharray: 1, 150;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke: currentColor;
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

@keyframes color {
  0%, 100% { stroke: #3B82F6; }
  25% { stroke: #EF4444; }
  50% { stroke: #F59E0B; }
  75% { stroke: #22C55E; }
}
</style>