
// Fix: Updated imports to include Language and Translations
import { Ebook, SiteConfig, Language, Translations } from './types';

export const INITIAL_EBOOKS: Ebook[] = [
  {
    id: '1',
    title: 'L\'Éveil du Troisième Œil',
    description: 'Un guide complet pour explorer vos facultés intuitives et transcender la vision ordinaire.',
    summary: 'Ce livre vous enseigne les techniques ancestrales de méditation et de visualisation pour activer la glande pinéale. Apprenez à percevoir les énergies subtiles et à renforcer votre connexion avec l\'univers.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600&h=800',
    officialPrice: 49.99,
    promoPrice: 29.99,
    chariowLink: 'https://chariow.com/p/eveil-3-oeil',
    isFeatured: true,
    isPromo: true,
    category: 'Méditation',
    customFields: [{ label: 'Auteur', value: 'Maître Élysée' }, { label: 'Pages', value: '180' }]
  },
  {
    id: '2',
    title: 'Les Mystères de l\'Alchimie',
    description: 'Transformez le plomb de votre âme en l\'or pur de la conscience universelle.',
    summary: 'Explorez l\'history et les pratiques de l\'alchimie spirituelle. Un voyage intérieur pour purifier l\'esprit et atteindre un état de paix profonde à travers des rituels et des réflexions philosophiques.',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=600&h=800',
    officialPrice: 39.99,
    promoPrice: 24.99,
    chariowLink: 'https://chariow.com/p/alchimie-sacree',
    isFeatured: true,
    isPromo: false,
    category: 'Philosophie',
    customFields: [{ label: 'Auteur', value: 'Nicolas S.' }, { label: 'Pages', value: '215' }]
  },
  {
    id: '3',
    title: 'L\'Art de la Géométrie Sacrée',
    description: 'Les codes secrets de l\'univers révélés par les formes parfaites.',
    summary: 'Découvrez comment les structures géométriques régissent la création, de la coquille d\'un nautile aux galaxies lointaines. Un manuel pratique pour harmoniser votre environnement et votre esprit par le tracé sacré.',
    image: 'https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?auto=format&fit=crop&q=80&w=600&h=800',
    officialPrice: 54.99,
    promoPrice: 34.99,
    chariowLink: 'https://chariow.com/p/geometrie-sacree',
    isFeatured: true,
    isPromo: true,
    category: 'Savoir Ancien',
    customFields: [{ label: 'Format', value: 'Livre Illustré' }, { label: 'Pages', value: '190' }]
  },
  {
    id: '4',
    title: 'Voyage au Cœur du Chamanisme',
    description: 'Reconnectez-vous aux esprits de la nature et retrouvez votre pouvoir animal.',
    summary: 'Une immersion dans les pratiques ancestrales des peuples premiers. Apprenez à voyager dans le monde d\'en bas, à rencontrer vos alliés spirituels et à guérir les blessures de votre lignée.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600&h=800',
    officialPrice: 45.99,
    promoPrice: 27.99,
    chariowLink: 'https://chariow.com/p/chamanisme-pratique',
    isFeatured: true,
    isPromo: false,
    category: 'Pratique',
    customFields: [{ label: 'Tradition', value: 'Ancestrale' }, { label: 'Pages', value: '230' }]
  },
  {
    id: '5',
    title: 'Astrologie Ésotérique',
    description: 'Lisez votre destin dans le mouvement des astres et l\'énergie des constellations.',
    summary: 'Bien plus qu\'un horoscope, ce traité explore les liens vibratoires entre les planètes et vos centres énergétiques. Comprenez l\'influence cosmique sur votre évolution spirituelle et vos cycles de vie.',
    image: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=600&h=800',
    officialPrice: 42.99,
    promoPrice: 21.50,
    chariowLink: 'https://chariow.com/p/astrologie-profonde',
    isFeatured: true,
    isPromo: true,
    category: 'Cosmologie',
    customFields: [{ label: 'Niveau', value: 'Initié' }, { label: 'Pages', value: '310' }]
  },
  {
    id: '6',
    title: 'Le Pouvoir des Cristaux',
    description: 'Maîtrisez les fréquences vibratoires des pierres pour la guérison et la protection.',
    summary: 'Un guide complet sur la lithothérapie ésotérique. Apprenez à purifier, programmer et utiliser les cristaux pour équilibrer vos chakras et créer des boucliers énergétiques puissants.',
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=600&h=800',
    officialPrice: 34.99,
    promoPrice: 19.99,
    chariowLink: 'https://chariow.com/p/pouvoir-cristaux',
    isFeatured: true,
    isPromo: false,
    category: 'Énergétique',
    customFields: [{ label: 'Type', value: 'Guide Pratique' }, { label: 'Pages', value: '155' }]
  }
];

export const DEFAULT_CONFIG: SiteConfig = {
  logo: 'https://image2url.com/r2/default/images/1770004935640-08fb3b0f-a3e7-4a0a-8614-9cfb1ed71540.png',
  favicon: 'https://image2url.com/r2/default/images/1770004935640-08fb3b0f-a3e7-4a0a-8614-9cfb1ed71540.png',
  fbPixelId: '',
  homeVideoUrl: 'https://cdn.pixabay.com/video/2023/10/22/186084-877312154_large.mp4',
  formspreeEndpoint: '',
  seoKeywords: ['spiritualité', 'ebooks', 'bien-être', 'mystères', 'méditation', 'alchimie', 'éveil spirituel'],
  socialLinks: {
    whatsapp: '',
    facebook: '',
    instagram: '',
    x: '',
    tiktok: ''
  }
};

export const UI_TEXT = {
  navHome: 'Accueil',
  navLibrary: 'Bibliothèque',
  navTitle: 'Navigation',
  footerTagline: 'Le Sanctuaire du savoir spirituel et des manuscrits sacrés.',
  footerContact: 'Contact',
  backToHome: 'Retour à l\'accueil',
  backToLibrary: 'Retour à la bibliothèque',
  copyright: 'TOUS DROITS RÉSERVÉS "SPIRITUX".',
  heroSparkle: 'Le Sanctuaire du savoir spirituel',
  heroTitle: 'Plongez au Cœur des Sagesses Sacrées',
  heroSubtitle: 'Découvrez les secrets de l\'univers à travers nos manuscrits sacrés. Un voyage initiatique pour revitaliser votre âme et éclairer votre chemin.',
  exploreLibrary: 'Explorer la Bibliothèque',
  viewSelection: 'Voir la sélection',
  libraryTitle: 'La Bibliothèque Céleste',
  searchPlaceholder: 'Rechercher une sagesse...',
  filters: 'Filtres',
  noResults: 'Aucune sagesse trouvée.',
  discover: 'Découvrir',
  getNow: 'S\'offrir',
  featuredTitle: 'Ebooks Vedettes',
  featuredSubtitle: 'Nos manuscrits les plus recherchés',
  testimonialsTitle: 'Paraboles de Sagesse',
  testimonialsSubtitle: 'Enseignements sacrés pour éclairer votre destinée',
  buyNow: 'Acheter maintenant',
  securePayment: 'Paiement sécurisé',
  instantAccess: 'Accès instantané',
  manuscriptEssence: 'L\'Essence du Manuscrit',
  offer: 'Offre',
  sacred: 'Sacrée',
  knowledgeWeapon: 'Le savoir est une arme spirituelle',
  audioError: 'Désolé, la lecture audio a échoué.',
  adminPortalTitle: 'Portail Admin',
};

// Fix: Exported TRANSLATIONS constant to satisfy LanguageContext requirements
export const TRANSLATIONS: Record<Language, Translations> = {
  fr: UI_TEXT,
  en: UI_TEXT,
  es: UI_TEXT,
  de: UI_TEXT
};
