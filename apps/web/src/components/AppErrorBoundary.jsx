import React from 'react';

const buildSafeHomeUrl = () => {
  if (typeof window === 'undefined') {
    return '/?lang=fr&reset=1';
  }

  const currentUrl = new URL(window.location.href);
  const nextUrl = new URL(window.location.origin);
  nextUrl.searchParams.set('lang', currentUrl.searchParams.get('lang') || 'fr');
  nextUrl.searchParams.set('reset', '1');
  return nextUrl.toString();
};

const getBoundaryCopy = () => {
  if (typeof window === 'undefined') {
    return {
      eyebrow: 'Nornsight',
      title: 'Une erreur a interrompu l’affichage',
      body: 'Tu peux revenir à l’accueil proprement ou recharger la page.',
      home: 'Retour à l’accueil',
      reload: 'Recharger'
    };
  }

  const locale = new URL(window.location.href).searchParams.get('lang');
  if (locale === 'en') {
    return {
      eyebrow: 'Nornsight',
      title: 'An error interrupted the display',
      body: 'You can safely return home or reload the page.',
      home: 'Back to home',
      reload: 'Reload'
    };
  }

  return {
    eyebrow: 'Nornsight',
    title: 'Une erreur a interrompu l’affichage',
    body: 'Tu peux revenir à l’accueil proprement ou recharger la page.',
    home: 'Retour à l’accueil',
    reload: 'Recharger'
  };
};

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('App rendering error:', error);
  }

  handleGoHome = () => {
    window.location.assign(buildSafeHomeUrl());
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const copy = getBoundaryCopy();

    return (
      <div className="min-h-screen bg-[#0c0f0d] px-4 py-12 text-[#f5f5f0]">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/8 bg-[#1a2b23]/60 p-6 md:p-8 shadow-[0_1rem_3rem_rgba(0,0,0,0.28)]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#d4af37]">{copy.eyebrow}</p>
              <h1 className="font-['Cinzel'] text-3xl leading-tight md:text-4xl">
                {copy.title}
              </h1>
              <p className="text-base leading-relaxed text-[#c6c0b4]">
                {copy.body}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={this.handleGoHome}
                className="min-h-12 rounded-xl border border-[#d4af37]/55 bg-[#d4af37]/8 px-6 py-3 text-base font-medium text-[#f5f5f0] transition-colors hover:bg-[#d4af37]/14"
              >
                {copy.home}
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="min-h-12 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-base font-medium text-[#f5f5f0] transition-colors hover:bg-white/10"
              >
                {copy.reload}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AppErrorBoundary;
