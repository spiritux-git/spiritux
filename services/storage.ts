
import { Ebook, SiteConfig } from '../types';
import { INITIAL_EBOOKS, DEFAULT_CONFIG } from '../constants';

const KEYS = {
  EBOOKS: 'spiritux_ebooks',
  CONFIG: 'spiritux_config'
};

export const storage = {
  getEbooks: (): Ebook[] => {
    const data = localStorage.getItem(KEYS.EBOOKS);
    return data ? JSON.parse(data) : INITIAL_EBOOKS;
  },
  saveEbooks: (ebooks: Ebook[]) => {
    localStorage.setItem(KEYS.EBOOKS, JSON.stringify(ebooks));
  },
  getConfig: (): SiteConfig => {
    const data = localStorage.getItem(KEYS.CONFIG);
    return data ? JSON.parse(data) : DEFAULT_CONFIG;
  },
  saveConfig: (config: SiteConfig) => {
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
  }
};
