
// Fix: Added Language type to support multi-language features
export type Language = 'fr' | 'en' | 'es' | 'de';

// Fix: Added Translations interface to support multi-language features
export interface Translations {
  [key: string]: string;
}

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
  homeVideoUrl?: string;
  formspreeEndpoint?: string;
  seoKeywords: string[];
  socialLinks?: {
    whatsapp: string;
    facebook: string;
    instagram: string;
    x: string;
    tiktok: string;
  };
}