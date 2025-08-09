<template>
  <!-- Conteneur principal de l'application -->
  <div id="app">
    <!-- 
      router-view : Composant dynamique qui affiche le composant 
      correspondant à la route actuelle (Login, Dashboard, etc.)
    -->
    <router-view />
  </div>
</template>

<script setup>
/**
 * COMPOSANT RACINE DE L'APPLICATION SCOLARIS
 * 
 * Ce composant sert de point d'entrée principal pour l'application.
 * Il utilise Vue Router pour gérer la navigation entre les différentes pages :
 * - Page de connexion (Login)
 * - Tableau de bord (Dashboard) 
 * - Gestion des élèves (Students)
 * - Gestion des classes (Classes)
 * - Gestion des notes (Grades)
 * - Statistiques (Statistics)
 * - Finances (Finance)
 * - Rapports (Reports)
 */
</script>