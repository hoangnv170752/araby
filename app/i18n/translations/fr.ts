import type { Translations } from "./en";

export const fr: Translations = {
  // Navigation
  nav: {
    features: "Fonctionnalités",
    market: "Marché",
    roadmap: "Feuille de route",
    joinWaitlist: "Rejoindre la liste",
  },

  // Hero
  hero: {
    eyebrow: "Plateforme Numérique Islamique",
    titleLine1: "Votre foi.",
    titleLine2: "Numérisée.",
    titleLine3: "Connectée.",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    description:
      "Connaissez votre prochaine Salah avant qu'elle n'arrive. Lisez le Coran en plus de 40 éditions. Vivez selon le calendrier hégirien. Découvrez un nouveau nom d'Allah chaque jour.",
    cta: "Rejoindre la liste",
    ctaNote: "Accès anticipé · Pas de spam",
  },

  // Stats
  stats: {
    muslimUsers: {
      num: "1,9 Md",
      label: "Utilisateurs musulmans dans le monde",
    },
    halalEconomy: {
      num: "2 000 Md$",
      label: "Économie halal mondiale",
    },
    wellnessMarket: {
      num: "7,3 Md$",
      label: "Marché des apps de bien-être spirituel d'ici 2033",
    },
  },

  // Features
  features: {
    eyebrow: "Ce qu'il y a dedans",
    title: "Quatre piliers. Une seule app.",
    prayerTimes: {
      title: "Horaires de prière",
      desc: "Horaires de prière précis pour n'importe quelle ville du monde, mis à jour en temps réel. Compte à rebours jusqu'à la prochaine Salah, alertes personnalisables.",
      api: "↳ Araby API · /prayer-times",
    },
    hijriCalendar: {
      title: "Calendrier hégirien",
      desc: "Convertissez entre les dates grégoriennes et islamiques. Suivez automatiquement le Ramadan, l'Aïd et toutes les fêtes islamiques majeures.",
      api: "↳ Araby API · /hijri-calendar",
    },
    quranReader: {
      title: "Lecteur du Coran",
      desc: "Texte complet du Saint Coran avec plusieurs éditions, traductions, recherche et une fonction d'Ayah aléatoire pour la réflexion quotidienne.",
      api: "↳ Araby API · /quran",
    },
    asmaAlHusna: {
      title: "Asma Al Husna",
      desc: "Explorez les 99 Beaux Noms d'Allah — en écriture arabe, translittération et signification. Un nom mis en avant chaque jour.",
      api: "↳ Araby API · /asma-al-husna",
    },
  },

  // Try It (Live Demo)
  tryIt: {
    eyebrow: "Démo en direct",
    title: "Essayez maintenant",
    description: "Données réelles, APIs réelles — sans inscription.",
    tabs: {
      prayer: "Horaires de prière",
      hijri: "Calendrier hégirien",
      husna: "Asma Al Husna",
      ayah: "Ayah aléatoire",
    },
    prayer: {
      title: "Horaires de prière",
      desc: "Obtenez l'horaire précis de Salah pour n'importe quelle ville du monde.",
      country: "Pays",
      city: "Ville",
      method: "Méthode",
      fetchTimes: "Obtenir les horaires",
      loading: "Chargement des données…",
      emptyState: "Entrez une ville et cliquez sur Obtenir les horaires ↑",
      next: "Suivante",
    },
    hijri: {
      title: "Calendrier hégirien",
      desc: "Convertissez n'importe quelle date grégorienne en calendrier hégirien islamique.",
      date: "Date",
      convert: "Convertir la date",
      emptyState: "Choisissez une date et cliquez sur Convertir ↑",
      gregorian: "Grégorien",
      hijriLabel: "Hégirien · Islamique",
      designation: "Désignation",
    },
    husna: {
      title: "Asma Al Husna",
      desc: "Explorez chacun des 99 beaux noms d'Allah.",
      nameNumber: "Numéro du nom (1–99)",
      showName: "Afficher le nom",
      random: "Aléatoire ↻",
      emptyState: "Choisissez un numéro et cliquez sur Afficher le nom ↑",
      nameOf: "Nom {number} sur 99",
    },
    ayah: {
      title: "Ayah aléatoire",
      desc: "Un verset du Coran, tiré au hasard — avec le texte arabe et la traduction.",
      translation: "Traduction",
      drawAyah: "Tirer un Ayah ↻",
      emptyState: 'Cliquez sur "Tirer un Ayah" pour recevoir un verset ↑',
      surah: "Sourate",
      verse: "Verset",
    },
  },

  // Monetization
  monetization: {
    eyebrow: "Comment ça gagne de l'argent",
    title: "Trois sources de revenus, conçues pour cette communauté",
    stream1: {
      label: "Source 01",
      title: "Abonnements Freemium",
      desc: "Fonctionnalités de base gratuites pour toujours. Le niveau premium débloque une expérience sans publicité, l'audio du Coran hors ligne, des analyses de prière avancées et des widgets.",
      potential: "Est. 2–5$/mois par utilisateur · Rétention élevée",
    },
    stream2: {
      label: "Source 02",
      title: "Revenus du pic Ramadan",
      desc: "Les sessions d'apps islamiques augmentent de 15% pendant le Ramadan. Les bundles premium à durée limitée, les fonctionnalités de don et les campagnes caritatives sponsorisées génèrent d'énormes revenus saisonniers.",
      potential: "1,7 Md$ de revenus totaux d'apps au Ramadan 2025",
      badge: "Meilleur choix",
    },
    stream3: {
      label: "Source 03",
      title: "API B2B & Marque blanche",
      desc: "Licenciez la plateforme aux mosquées, écoles islamiques et entreprises halal. Versions en marque blanche pour les marchés régionaux au MENA et en Asie du Sud-Est.",
      potential: "Marges plus élevées · Contrats B2B récurrents",
    },
  },

  // Market
  market: {
    eyebrow: "Opportunité de marché",
    title: "Pourquoi c'est le bon moment",
    stats: {
      downloads: {
        num: "62M+",
        label: "Téléchargements pour Muslim Pro — sans budget marketing",
      },
      valuation: {
        num: "300M$",
        label: "Valorisation de Wahed, une app d'investissement halal",
      },
      population: {
        num: "2,2 Md",
        label: "Population musulmane mondiale projetée d'ici 2030",
      },
      retention: {
        num: "Quotidien",
        label: "Les utilisateurs ouvrent les apps islamiques plusieurs fois par jour — rétention exceptionnelle",
      },
    },
    textTitle: "Les apps islamiques monétisent mieux qu'elles n'en ont l'air",
    textP1:
      "Muslim Pro génère 90% de ses revenus de la publicité et 10% des abonnements — même si la majorité de ses utilisateurs sont dans des marchés émergents. L'écart entre téléchargements et revenus est l'opportunité.",
    textP2:
      "Les utilisateurs du Golfe arabe, du Royaume-Uni et d'Amérique du Nord convertissent à des taux beaucoup plus élevés et paient beaucoup plus par abonnement que la moyenne mondiale.",
    highlight:
      "Insight clé : Seulement 8,1% des revenus de Quran Majeed venaient d'Inde et du Pakistan — malgré ces pays représentant 35,6% des téléchargements. Ciblez la diaspora en premier.",
  },

  // Roadmap
  roadmap: {
    eyebrow: "Plan de développement",
    title: "Du MVP à l'écosystème",
    phase1: {
      phase: "Phase 1",
      title: "Outils religieux de base",
      desc: "Lancement avec les quatre fonctionnalités alimentées par API : horaires de prière, calendrier hégirien, lecteur du Coran, Asma Al Husna. Perfectionner l'UX et la localisation pour l'arabe, l'anglais et une langue régionale.",
      tags: ["Prayer Times API", "Hijri Calendar", "Quran API", "Al Husna API"],
    },
    phase2: {
      phase: "Phase 2",
      title: "Engagement & Rétention",
      desc: "Ajouter les notifications d'Ayah quotidiennes, compteur de Tasbih, bibliothèque de Dua et localisateur de mosquées. Introduire le niveau freemium. Lancer la première campagne Ramadan.",
      tags: ["Notifications", "Mode hors ligne", "Freemium"],
    },
    phase3: {
      phase: "Phase 3",
      title: "Communauté & Monétisation",
      desc: "Ouvrir les fonctionnalités communautaires : Q&A islamique, événements locaux, annuaire halal. Lancer l'offre marque blanche B2B pour les mosquées et écoles islamiques. Explorer l'intégration des dons caritatifs.",
      tags: ["Communauté", "API B2B", "Dons", "Marketplace"],
    },
  },

  // CTA
  cta: {
    arabic: "السلام عليكم",
    title: "Soyez le premier à savoir quand nous lançons.",
    subtitle: "Rejoignez la liste d'attente. Nous vous contacterons avant le lancement public avec un accès anticipé.",
    emailPlaceholder: "votre@email.com",
    button: "Rejoindre la liste",
    success: "✓ Vous êtes sur la liste ! Nous vous contacterons.",
  },

  // Footer
  footer: {
    builtWith: "Construit avec AlAdhan & AlQuran Cloud APIs · 2026",
  },
};
