import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { persistLocale } from '@/lib/locale.js';

const NAV_ITEMS = {
  fr: [
    { href: '/tirages', label: 'Tirages' },
    { href: '/comment-ca-marche', label: 'Comment ça marche' },
    { href: '/faq', label: 'FAQ' }
  ],
  en: [
    { href: '/tirages', label: 'Readings' },
    { href: '/comment-ca-marche', label: 'How it works' },
    { href: '/faq', label: 'FAQ' }
  ]
};

const PublicNav = ({ locale = 'fr', onLocaleChange = null, className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const items = NAV_ITEMS[locale] || NAV_ITEMS.fr;

  const handleLocaleSwitch = (nextLocale) => {
    if (nextLocale === locale) {
      return;
    }

    persistLocale(nextLocale);
    onLocaleChange?.(nextLocale);

    const params = new URLSearchParams(location.search);
    params.set('lang', nextLocale);
    const search = params.toString();

    navigate(
      {
        pathname: location.pathname,
        search: search ? `?${search}` : '',
        hash: location.hash
      },
      { replace: true }
    );
  };

  return (
    <header className={`ns-header ${className}`}>
      <Link
        to={locale === 'en' ? '/?lang=en' : '/?lang=fr'}
        className="ns-brand"
      >
        Nornsight
      </Link>

      <nav
        aria-label={locale === 'en' ? 'Main navigation' : 'Navigation principale'}
        className="ns-nav"
      >
        {items.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`ns-nav__link ${isActive ? 'is-active' : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="ns-language" aria-label={locale === 'en' ? 'Language' : 'Langue'}>
        <button
          type="button"
          onClick={() => handleLocaleSwitch('fr')}
          className={`ns-language__item ${locale === 'fr' ? 'is-active' : ''}`}
          aria-pressed={locale === 'fr'}
        >
          <span className="ns-language__mark" aria-hidden="true" />
          FR
        </button>
        <span className="ns-language__separator" aria-hidden="true" />
        <button
          type="button"
          onClick={() => handleLocaleSwitch('en')}
          className={`ns-language__item ${locale === 'en' ? 'is-active' : ''}`}
          aria-pressed={locale === 'en'}
        >
          <span className="ns-language__mark ns-language__mark--en" aria-hidden="true" />
          EN
        </button>
      </div>
    </header>
  );
};

export default PublicNav;
