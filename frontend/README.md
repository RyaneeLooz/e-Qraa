# e-Qraa Frontend 🎨

Ceci est la partie client de la plateforme e-Qraa.

## 🚀 Démarrage rapide
```bash
npm install
npm run dev
```

## 🏗 Architecture
- `src/pages/` : Les vues principales (Home, Courses, Dashboard, etc.).
- `src/components/` : Les composants réutilisables (Navbar, Footer, CourseForm, etc.).
- `src/context/` : Gestion de l'état global (Auth, Cart, Coins).
- `src/services/` : (À remplir) Appels API vers le backend.

## 🎨 Design
Le projet utilise **Tailwind CSS v4** avec une palette personnalisée :
- **Primaire** : Blue-600
- **Coins** : Yellow-600
- **Gratuité** : Green-600

## 🧪 Tests
Pour tester les différents rôles sans backend :
- **Admin** : `admin@e-qraa.dz`
- **Prof** : Créez un compte via `/register` (isVerified simulé dans `Dashboard.jsx`).
