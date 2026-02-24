# Lumière Botanical - E-commerce Premium

Une application e-commerce premium pour la vente de produits cosmétiques naturels, inspirée de Yves Rocher Maroc.

## 🚀 Stack Technique

- **React 18+** - Framework UI moderne
- **TypeScript** - Typage statique pour un code robuste
- **Vite** - Build tool rapide et optimisé
- **Tailwind CSS** - Framework CSS utilitaire avec design system personnalisé
- **Framer Motion** - Animations fluides et sophistiquées
- **Zustand** - State management léger et performant
- **React Router DOM** - Routing côté client
- **Recharts** - Graphiques et visualisations de données
- **shadcn/ui** - Composants UI accessibles et personnalisables

## ✨ Fonctionnalités

### 🏠 Pages Publiques
- **Home** - Landing page immersive avec animations
- **Catalogue** - Liste des produits avec filtres avancés
- **Détail Produit** - Galerie avec zoom, avis, produits similaires
- **Catégories** - Exploration par univers
- **Recherche** - Recherche dynamique de produits
- **Panier** - Gestion du panier avec animations
- **Checkout** - Processus de commande multi-étapes
- **Wishlist** - Liste de souhaits

### 🔐 Administration
- **Dashboard** - Analytics avec graphiques
- **Gestion Produits** - CRUD complet
- **Gestion Commandes** - Suivi et mise à jour des statuts
- **Gestion Clients** - Vue d'ensemble des utilisateurs

### 🎨 Design System
- Thème clair/sombre
- Couleurs personnalisées (botanical, nude, gold, cream, rose)
- Composants réutilisables
- Animations Framer Motion avancées
- Responsive design

## 📦 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd lumiere-botanical

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine:

```env
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
```

### Identifiants Admin (Démo)

- Email: `admin@lumiere-botanical.com`
- Mot de passe: `admin123`

## 🏗️ Architecture

```
src/
├── components/          # Composants réutilisables
│   ├── auth/           # Authentification
│   ├── cart/           # Panier et wishlist
│   ├── layout/         # Layouts (Header, Footer, Sidebar)
│   ├── product/        # Composants produit
│   └── ui/             # Composants UI (shadcn)
├── data/               # Données mock
├── hooks/              # Custom hooks
├── lib/                # Utilitaires et animations
├── pages/              # Pages de l'application
│   ├── admin/          # Pages d'administration
│   └── public/         # Pages publiques
├── services/           # Services API
├── stores/             # Zustand stores
├── styles/             # Styles globaux
└── types/              # Types TypeScript
```

## 🎯 Points Forts

### Animations Premium
- Page transitions avec Framer Motion
- Reveal au scroll
- Hover effects 3D sur les cartes
- Animations du panier fluides
- Skeleton loaders élégants

### Performance
- Lazy loading des composants
- Code splitting automatique
- Optimisation des images
- State management efficace

### UX/UI
- Design épuré et luxueux
- Micro-interactions soignées
- Navigation intuitive
- Responsive parfait

## 📝 Scripts Disponibles

- `npm run dev` - Développement
- `npm run build` - Build production
- `npm run preview` - Prévisualisation
- `npm run lint` - Linting

## 🔮 Futures Améliorations

- [ ] Intégration Stripe pour les paiements
- [ ] Authentification utilisateur complète
- [ ] Reviews et notations
- [ ] Newsletter
- [ ] Multi-langues
- [ ] PWA

## 📄 Licence

MIT License - Libre d'utilisation et de modification.

---

Développé avec ❤️ par Lumière Botanical Team
