// Importation des dépendances Vue 3 et des modules nécessaires
import { createApp } from 'vue' // Framework Vue 3
import { createPinia } from 'pinia' // Gestionnaire d'état global
import router from './router' // Configuration des routes
import App from './App.vue' // Composant racine de l'application
import './style.css' // Styles globaux CSS

// Création de l'instance de l'application Vue
const app = createApp(App)
// Création de l'instance Pinia pour la gestion d'état
const pinia = createPinia()

// Configuration des plugins
app.use(pinia) // Activation de Pinia pour les stores
app.use(router) // Activation du routeur Vue Router
// Montage de l'application sur l'élément DOM avec l'id 'app'
app.mount('#app')