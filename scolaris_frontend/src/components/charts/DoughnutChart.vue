<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  data: Array,
  labels: Array,
  colors: Array
})

const chartCanvas = ref(null)
let chartInstance = null

onMounted(() => {
  createChart()
})

watch(() => props.data, () => {
  if (chartInstance) {
    updateChart()
  }
}, { deep: true })

async function createChart() {
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)
  
  const ctx = chartCanvas.value.getContext('2d')
  
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: props.labels,
      datasets: [{
        data: props.data,
        backgroundColor: props.colors,
        borderWidth: 0,
        cutout: '70%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        }
      },
      animation: {
        animateRotate: true,
        duration: 1500
      }
    }
  })
}

function updateChart() {
  chartInstance.data.labels = props.labels
  chartInstance.data.datasets[0].data = props.data
  chartInstance.update('active')
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>