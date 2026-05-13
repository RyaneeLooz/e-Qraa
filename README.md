# e-Qraa (إقرأ) 🎓
> **La première plateforme éducative algérienne basée sur une économie de Coins.**

---

## 🌟 Présentation
**e-Qraa** est une marketplace éducative premium conçue pour révolutionner l'apprentissage en ligne en Algérie. La plateforme met en relation des formateurs qualifiés et des étudiants avides de connaissances à travers un système économique innovant.

Le projet repose sur une monnaie virtuelle, les **e-Qraa Coins** (jaunes 🟡), permettant des transactions sécurisées et simplifiées. Pour chaque vente, la plateforme prélève une commission de 20%, assurant ainsi la pérennité du service.

---

## 🚀 Fonctionnalités Clés

### 👨‍🎓 Pour les Étudiants
- **Exploration de Cours** : Catalogue riche avec filtrage par catégorie et recherche dynamique.
- **Système de Coins** : Achat de cours via des e-Qraa Coins.
- **Dashboard Personnel** : Suivi des cours achetés, progression et historique des transactions.
- **Avis & Notes** : Possibilité de noter les cours pour aider la communauté.

### 👨‍🏫 Pour les Formateurs
- **Gestion de Cours** : Publication de contenus (titre, description, prix en coins, miniatures).
- **Suivi des Ventes** : Statistiques en temps réel sur les revenus et le nombre d'inscrits.
- **Portefeuille** : Visualisation du solde après commission plateforme (80/20).

### ⚙️ Pour l'Administration
- **Gestion Utilisateurs** : Validation des comptes formateurs et modération.
- **Codes Promos** : Génération de codes promotionnels pour dynamiser la plateforme.
- **Monitoring** : Vue d'ensemble sur l'activité globale du système.

---

## 🛠 Stack Technique

### Frontend
- **Framework** : React 19 + Vite 8
- **Styling** : Tailwind CSS v4 (Design moderne, responsive et fluide)
- **State Management** : React Context API (Authentification & Panier)
- **Notifications** : Système de Toast personnalisé

### Backend
- **Serveur** : Node.js & Express.js
- **Base de Données** : PostgreSQL (Relationnel, robuste et performant)
- **Sécurité** : 
  - JWT (JSON Web Tokens) pour l'authentification
  - Bcryptjs pour le hachage des mots de passe
  - Validation des données avec express-validator
- **Communication** : Nodemailer pour les notifications par email

---

## 📁 Structure du Projet
```text
e-Qraa/
├── frontend/             # Interface utilisateur (React)
│   ├── src/
│   │   ├── components/   # Composants réutilisables
│   │   ├── pages/        # Vues principales
│   │   ├── context/      # Context API (Auth, etc.)
│   │   └── assets/       # Ressources statiques
├── backend/              # API REST (Node/Express)
│   ├── config/           # Configuration DB et variables
│   ├── controllers/      # Logique métier
│   ├── models/           # Schémas PostgreSQL
│   ├── routes/           # Endpoints de l'API
│   └── middleware/       # Auth & validation
└── project_docs/         # Documentation additionnelle
```

---

## 🔧 Installation & Configuration

### 1. Prérequis
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) installé et configuré

### 2. Configuration du Backend
1. Accédez au dossier backend : `cd backend`
2. Installez les dépendances : `npm install`
3. Créez un fichier `.env` basé sur les variables suivantes :
   ```env
   PORT=5000
   DATABASE_URL=postgres://user:password@localhost:5432/eqraa_db
   JWT_SECRET=votre_secret_super_securise
   EMAIL_USER=votre_email@gmail.com
   EMAIL_PASS=votre_mot_de_passe_app
   ```
4. Initialisez la base de données en utilisant le fichier `database.sql`.

### 3. Configuration du Frontend
1. Accédez au dossier frontend : `cd frontend`
2. Installez les dépendances : `npm install`
3. Lancez le serveur de développement : `npm run dev`

---


