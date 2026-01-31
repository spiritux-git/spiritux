
export interface CustomField {
  label: string;
  value: string;
}

export interface Ebook {
  id: string;
  title: string;
  description: string;
  summary: string;
  image: string;
  officialPrice: number;
  promoPrice: number;
  chariowLink: string;
  isFeatured: boolean;
  isPromo?: boolean;
  category: string;
  customFields?: CustomField[];
}

export interface SiteConfig {
  logo: string;
  favicon: string;
  fbPixelId: string;
  seoKeywords: string[];
}

export interface LocaleInfo {
  currency: string;
  rate: number;
  symbol: string;
}

export type Language = 'fr' | 'en' | 'es' | 'de' | 'it';

export interface Translations {
  // Navigation & General
  navHome: string;
  navLibrary: string;
  navTitle: string;
  backToHome: string;
  backToLibrary: string;
  copyright: string;
  loading: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroSparkle: string;
  exploreLibrary: string;
  viewSelection: string;

  // Library
  libraryTitle: string;
  searchPlaceholder: string;
  filters: string;
  noResults: string;
  discover: string;
  getNow: string;

  // Featured & Testimonials
  featuredTitle: string;
  featuredSubtitle: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  
  // Ebook Details
  buyNow: string;
  securePayment: string;
  instantAccess: string;
  manuscriptEssence: string;
  listen: string;
  stop: string;
  authenticity: string;
  authenticityDesc: string;
  illumination: string;
  illuminationDesc: string;
  offer: string;
  sacred: string;
  knowledgeWeapon: string;
  saving: string;
  temporalOpportunity: string;
  audioError: string;
  shareTitle: string;
  shareFacebook: string;
  shareTwitter: string;
  shareCopy: string;
  linkCopied: string;

  // Footer
  footerTagline: string;
  footerContact: string;

  // Ebook Specific Content (Localizing the Data)
  ebook1Title: string;
  ebook1Desc: string;
  ebook1Summary: string;
  ebook2Title: string;
  ebook2Desc: string;
  ebook2Summary: string;
  ebook3Title: string;
  ebook3Desc: string;
  ebook3Summary: string;
  ebook4Title: string;
  ebook4Desc: string;
  ebook4Summary: string;
  ebook5Title: string;
  ebook5Desc: string;
  ebook5Summary: string;
  ebook6Title: string;
  ebook6Desc: string;
  ebook6Summary: string;
  
  // Testimonials Content
  testi1Name: string;
  testi1Text: string;
  testi1Book: string;
  testi2Name: string;
  testi2Text: string;
  testi2Book: string;
  testi3Name: string;
  testi3Text: string;
  testi3Book: string;

  // Admin UI
  adminPortalTitle: string;
  adminPortalSubtitle: string;
  adminAccessKey: string;
  adminUnlock: string;
  adminDashboardTitle: string;
  adminDashboardSubtitle: string;
  adminSaveSuccess: string;
  adminDeleteConfirmTitle: string;
  adminDeleteConfirmText: string;
  adminCancel: string;
  adminDelete: string;
}
