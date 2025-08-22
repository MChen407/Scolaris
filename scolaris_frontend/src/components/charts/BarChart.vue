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
  title: String,
  color: { type: String, default: '#3B82F6' }
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
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: [{
        label: props.title,
        data: props.data,
        backgroundColor: props.color + '80',
        borderColor: props.color,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#f3f4f6'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
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