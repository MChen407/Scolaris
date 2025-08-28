# 🎓 Scolaris - Système de Gestion Scolaire

Scolaris est une application desktop moderne de gestion scolaire développée avec Vue.js et Electron, offrant une interface intuitive pour la gestion complète d'un établissement scolaire.

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies Utilisées](#-technologies-utilisées)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [API Documentation](#-api-documentation)
- [Comptes de Démonstration](#-comptes-de-démonstration)
- [Développement](#-développement)
- [Build et Distribution](#-build-et-distribution)
- [Sécurité](#-sécurité)
- [Contribution](#-contribution)
- [Licence](#-licence)

## ✨ Fonctionnalités

### 👥 Gestion des Utilisateurs
- **Authentification multi-rôles** : Admin, Secrétaire, Comptable
- **Tableau de bord personnalisé** selon le rôle
- **Gestion des sessions** avec persistance locale

### 🎓 Gestion Académique
- **Gestion des étudiants** : Inscription, modification, suppression
- **Gestion des enseignants** : Profils, matières assignées
- **Gestion des classes** : Organisation par niveaux
- **Gestion des matières** : Configuration des cours
- **Système de notes** : Saisie et calcul automatique des moyennes
- **Bulletins de notes** : Génération automatique en PDF

### 💰 Gestion Financière
- **Suivi des paiements** : Frais de scolarité, autres frais
- **Types de frais** : Configuration flexible
- **Rapports financiers** : Revenus, impayés
- **Historique des transactions**

### 📊 Statistiques et Rapports
- **Tableaux de bord interactifs** avec Chart.js
- **Statistiques en temps réel** : Étudiants, revenus, performances
- **Exportation PDF** : Bulletins, rapports financiers
- **Graphiques visuels** : Barres, secteurs, courbes

### 🖨️ Génération de Documents
- **Bulletins de notes PDF** avec mise en page professionnelle
- **Rapports financiers** détaillés
- **Listes d'étudiants** par classe
- **Relevés de notes** individuels

## 🛠️ Technologies Utilisées

### Frontend
- **Vue.js 3** - Framework JavaScript progressif
- **Pinia** - Gestion d'état moderne pour Vue
- **Vue Router** - Routage côté client
- **Tailwind CSS** - Framework CSS utilitaire
- **Chart.js** - Bibliothèque de graphiques
- **Electron** - Framework pour applications desktop
- **Axios** - Client HTTP pour les API

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimaliste
- **Sequelize** - ORM pour bases de données
- **SQLite** - Base de données embarquée
- **CORS** - Gestion des requêtes cross-origin

### Outils de Développement
- **Vite** - Outil de build rapide
- **TypeScript** - Typage statique
- **Nodemon** - Rechargement automatique du serveur
- **Concurrently** - Exécution simultanée de scripts
- **Electron Builder** - Packaging d'applications Electron

## 🏗️ Architecture

Scolaris/
├── scolaris_frontend/ # Application Vue.js + Electron
│ ├── src/
│ │ ├── components/ # Composants réutilisables
│ │ │ ├── charts/ # Composants de graphiques
│ │ │ ├── common/ # Composants communs
│ │ │ └── layout/ # Composants de mise en page
│ │ ├── views/ # Pages de l'application
│ │ ├── stores/ # Gestion d'état Pinia
│ │ ├── router/ # Configuration des routes
│ │ ├── composables/ # Logique réutilisable
│ │ └── assets/ # Ressources statiques
│ ├── electron.js # Point d'entrée Electron
│ └── package.json
├── scolaris_backend/ # API REST Node.js
│ ├── src/
│ │ ├── controllers/ # Logique métier
│ │ ├── models/ # Modèles Sequelize
│ │ ├── routes/ # Définition des routes
│ │ └── config/ # Configuration DB
│ ├── migrations/ # Scripts de migration DB
│ ├── scripts/ # Scripts utilitaires
│ ├── app.js # Point d'entrée serveur
│ └── package.json
└── package.json # Configuration workspace


## 🚀 Installation

### Prérequis
- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**
- **Git**

### Installation Rapide

```bash
# Cloner le repository
git clone https://github.com/votre-username/scolaris.git
cd scolaris

# Installer les dépendances (workspace)
npm install

# Installer les dépendances du backend
cd scolaris_backend
npm install

# Installer les dépendances du frontend
cd ../scolaris_frontend
npm install

# Retourner à la racine
cd ..
