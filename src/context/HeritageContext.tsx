import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SUPPORTED_LOCALES, UI_TRANSLATIONS, type UITranslationStrings } from '../data/translationsData';
import { fetchBootstrap, type BootstrapPayload } from '../services/api';
import type { SupportedLocale } from '../types/heritage';

interface HeritageContextValue {
  data: BootstrapPayload | null;
  loading: boolean;
  error: string | null;
  locale: SupportedLocale;
  t: UITranslationStrings;
  setLocale: (next: SupportedLocale) => void;
  buildPath: (subPath: string) => string;
  stripLocalePrefix: (pathname: string) => string;
  reloadData: () => Promise<void>;
  assistantOpen: boolean;
  setAssistantOpen: React.Dispatch<React.SetStateAction<boolean>>;
  globalSearch: string;
  setGlobalSearch: React.Dispatch<React.SetStateAction<string>>;
}

const HeritageContext = createContext<HeritageContextValue | null>(null);

const LOCALE_CODES = new Set<string>(SUPPORTED_LOCALES.map((l) => l.code));

export function extractLocaleFromPath(pathname: string): {
  locale: SupportedLocale;
  restPath: string;
} {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && LOCALE_CODES.has(segments[0].toLowerCase())) {
    const loc = segments[0].toLowerCase() as SupportedLocale;
    const rest = '/' + segments.slice(1).join('/');
    return { locale: loc, restPath: rest === '/' ? '/' : rest };
  }
  return { locale: 'vi', restPath: pathname || '/' };
}

export const HeritageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState<BootstrapPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const { locale, restPath } = useMemo(
    () => extractLocaleFromPath(location.pathname),
    [location.pathname],
  );

  const reloadData = useCallback(async () => {
    try {
      setLoading((prev) => (data ? prev : true));
      const payload = await fetchBootstrap();
      setData(payload);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi tải cơ sở dữ liệu.');
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    reloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: SupportedLocale) => {
      const cleanRest = restPath === '/' ? '' : restPath;
      navigate(`/${next}${cleanRest}${location.search}`);
    },
    [navigate, restPath, location.search],
  );

  const buildPath = useCallback(
    (subPath: string) => {
      const normalized = subPath.startsWith('/') ? subPath : `/${subPath}`;
      if (normalized === '/') return `/${locale}/`;
      return `/${locale}${normalized}`;
    },
    [locale],
  );

  const stripLocalePrefix = useCallback((pathname: string) => {
    return extractLocaleFromPath(pathname).restPath;
  }, []);

  const value: HeritageContextValue = {
    data,
    loading,
    error,
    locale,
    t: UI_TRANSLATIONS[locale] || UI_TRANSLATIONS.vi,
    setLocale,
    buildPath,
    stripLocalePrefix,
    reloadData,
    assistantOpen,
    setAssistantOpen,
    globalSearch,
    setGlobalSearch,
  };

  return <HeritageContext.Provider value={value}>{children}</HeritageContext.Provider>;
};

export function useHeritage() {
  const ctx = useContext(HeritageContext);
  if (!ctx) throw new Error('useHeritage must be used inside HeritageProvider');
  return ctx;
}
