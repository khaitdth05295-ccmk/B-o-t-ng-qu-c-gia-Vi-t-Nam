import React, { useState } from 'react';
import { Globe, Landmark, Menu, MessageSquareText, Search, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useHeritage } from '../context/HeritageContext';
import { SUPPORTED_LOCALES } from '../data/translationsData';
import type { SupportedLocale } from '../types/heritage';

export const Header: React.FC = () => {
  const { locale, setLocale, t, buildPath, stripLocalePrefix, setAssistantOpen, globalSearch, setGlobalSearch } =
    useHeritage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const currentSubPath = stripLocalePrefix(location.pathname);

  const navItems = [
    { path: '/', label: t.nav.home },
    { path: '/encyclopedia', label: t.nav.encyclopedia },
    { path: '/map', label: t.nav.map },
    { path: '/timeline', label: t.nav.timeline },
    { path: '/museums', label: t.nav.museums },
    { path: '/gallery', label: t.nav.gallery },
    { path: '/news', label: t.nav.news },
    { path: '/sources', label: t.nav.sources },
    { path: '/about', label: t.nav.about },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    setMobileMenuOpen(false);
    navigate(buildPath(`/encyclopedia?q=${encodeURIComponent(globalSearch.trim())}`));
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#D8CEB8] bg-[#FAF8F3]/95 backdrop-blur-sm">
      {/* Top Institutional Row */}
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark + Emblem */}
          <Link
            to={buildPath('/')}
            className="flex items-center gap-3 whitespace-nowrap shrink-0 group"
          >
            <span className="flex h-9 w-9 items-center justify-center border border-[#9A6E2A]/60 bg-[#0F1E33] text-[#DFC484]">
              <Landmark className="h-4 w-4" />
            </span>
            <span className="font-serif text-lg font-bold tracking-tight text-[#0F1E33] group-hover:text-[#9A6E2A] transition-colors">
              {t.brandTitle}
            </span>
          </Link>

          {/* Zone 2: Controls (Search + 10 Languages + Assistant CTA) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Search Toggle / Inline Form */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center border border-[#D8CEB8] bg-white px-2.5 py-1.5">
              <Search className="h-3.5 w-3.5 text-[#6B7280] mr-2 shrink-0" />
              <input
                type="search"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder={t.labels.searchPlaceholder}
                className="w-44 lg:w-56 bg-transparent text-xs text-[#1E242B] placeholder:text-[#9CA3AF] focus:outline-none"
                aria-label={t.labels.searchPlaceholder}
              />
            </form>

            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center border border-[#D8CEB8] bg-white text-[#0F1E33]"
              aria-label="Tìm kiếm"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* 10-Language Selector */}
            <div className="flex items-center border border-[#D8CEB8] bg-white px-2 py-1.5">
              <Globe className="h-3.5 w-3.5 text-[#9A6E2A] mr-1.5 shrink-0" />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as SupportedLocale)}
                aria-label="Language switcher"
                className="bg-transparent text-xs font-medium text-[#0F1E33] focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LOCALES.map((loc) => (
                  <option key={loc.code} value={loc.code}>
                    {loc.nativeName} ({loc.flagLabel})
                  </option>
                ))}
              </select>
            </div>

            {/* Primary CTA: Heritage Assistant */}
            <button
              type="button"
              onClick={() => setAssistantOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 bg-[#0F1E33] px-3.5 py-2 text-xs font-medium text-[#FAF8F3] hover:bg-[#182D49] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <MessageSquareText className="h-3.5 w-3.5 text-[#DFC484]" />
              <span>{t.labels.openAssistant}</span>
            </button>

            {/* Mobile Nav Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden flex h-10 w-10 items-center justify-center border border-[#D8CEB8] bg-white text-[#0F1E33]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Bar (Desktop) */}
        <nav
          aria-label="Main navigation"
          className="hidden xl:flex items-center justify-between border-t border-[#E6DFD0] py-2.5 gap-4 overflow-x-auto"
        >
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const active =
                item.path === '/'
                  ? currentSubPath === '/'
                  : currentSubPath.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={buildPath(item.path)}
                  className={`text-[13px] font-medium whitespace-nowrap shrink-0 py-0.5 transition-colors border-b-2 ${
                    active
                      ? 'border-[#9A6E2A] text-[#0F1E33] font-semibold'
                      : 'border-transparent text-[#4B5563] hover:text-[#0F1E33] hover:border-[#D8CEB8]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <Link
            to={buildPath('/periods')}
            className={`text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              currentSubPath.startsWith('/periods')
                ? 'text-[#9A6E2A] font-semibold'
                : 'text-[#5B3E2A] hover:text-[#0F1E33]'
            }`}
          >
            16 Thời kỳ lịch sử
          </Link>
        </nav>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="border-t border-[#E6DFD0] bg-white px-4 py-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="search"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder={t.labels.searchPlaceholder}
              className="flex-1 border border-[#D8CEB8] px-3 py-2 text-sm focus:outline-none focus:border-[#0F1E33]"
            />
            <button
              type="submit"
              className="bg-[#0F1E33] px-4 py-2 text-xs font-medium text-[#FAF8F3]"
            >
              Tìm
            </button>
          </form>
        </div>
      )}

      {/* Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#D8CEB8] bg-[#FAF8F3] px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const active =
              item.path === '/'
                ? currentSubPath === '/'
                : currentSubPath.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={buildPath(item.path)}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 text-sm font-medium ${
                  active
                    ? 'bg-[#0F1E33] text-[#FAF8F3]'
                    : 'text-[#1E242B] hover:bg-[#EBE4D5]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to={buildPath('/periods')}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 text-sm font-medium text-[#5B3E2A] hover:bg-[#EBE4D5]"
          >
            16 Thời kỳ lịch sử
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setAssistantOpen(true);
            }}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-[#0F1E33] px-4 py-2.5 text-sm font-medium text-[#FAF8F3]"
          >
            <MessageSquareText className="h-4 w-4 text-[#DFC484]" />
            <span>{t.labels.openAssistant}</span>
          </button>
        </div>
      )}
    </header>
  );
};
