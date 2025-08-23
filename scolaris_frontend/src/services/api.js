// Configuration de base pour les appels API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Méthode générique pour les requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Méthodes HTTP
  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options })
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    })
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options })
  }
}

// Instance singleton
export const apiService = new ApiService()

// Services spécifiques
export const authAPI = {
  login: (credentials) => apiService.post('/auth/login', credentials),
  logout: () => apiService.post('/auth/logout'),
  me: () => apiService.get('/auth/me'),
  refreshToken: () => apiService.post('/auth/refresh')
}

export const schoolAPI = {
  getInfo: (schoolId) => apiService.get(`/schools/${schoolId}/info`),
  updateInfo: (schoolId, data) => apiService.put(`/schools/${schoolId}/info`, data),
  createInfo: (schoolId, data) => apiService.post(`/schools/${schoolId}/info`, data)
}

export const usersAPI = {
  getProfile: () => apiService.get('/users/profile'),
  updateProfile: (data) => apiService.put('/users/profile', data)
}