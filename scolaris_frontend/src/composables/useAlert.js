import { ref } from 'vue'

const showAlert = ref(false)
const alertConfig = ref({
  type: 'success',
  title: '',
  message: '',
  onConfirm: null
})

export function useAlert() {
  function showSuccess(title, message) {
    alertConfig.value = { type: 'success', title, message }
    showAlert.value = true
  }

  function showError(title, message) {
    alertConfig.value = { type: 'error', title, message }
    showAlert.value = true
  }

  function showConfirm(title, message, onConfirm) {
    alertConfig.value = { type: 'confirm', title, message, onConfirm }
    showAlert.value = true
  }

  function closeAlert() {
    showAlert.value = false
    alertConfig.value.onConfirm = null
  }

  function confirmAlert() {
    if (alertConfig.value.onConfirm) {
      alertConfig.value.onConfirm()
    }
    closeAlert()
  }

  return {
    showAlert,
    alertConfig,
    showSuccess,
    showError,
    showConfirm,
    closeAlert,
    confirmAlert
  }
}