import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PublicNav from '@/components/PublicNav.jsx';
import { getInitialLocale } from '@/lib/locale.js';
import { getSeoRouteConfig } from '@/lib/seoRoutes.js';

function buildCanonical(pathname) {
  if (typeof window === 'undefined') {
    return null;
  }

  return `${window.location.origin}${pathname}`;
}

function buildFaqJsonLd(config, pathname) {
  if (!Array.isArray(config.faq) || config.faq.length === 0) {
    return null;
  }

  const canonical = buildCanonical(pathname);

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    })),
    ...(canonical ? { url: canonical } : {})
  };
}

const SeoPage = ({ pathname }) => {
  const locale = getInitialLocale();
  const config = getSeoRouteConfig(pathname, locale);

  if (!config) {
    return null;
  }

  const canonical = buildCanonical(pathname);
  const faqJsonLd = buildFaqJsonLd(config, pathname);

  return (
    <>
      <Helmet>
        <html lang={locale} />
        <title>{config.title}</title>
        <meta name="description" content={config.description} />
        {canonical && <link rel="canonical" href={canonical} />}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nornsight" />
        <meta property="og:title" content={config.title} />
        <meta property="og:description" content={config.description} />
        {canonical && <meta property="og:url" content={canonical} />}
        {faqJsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(faqJsonLd)}
          </script>
        )}
      </Helmet>

      <main className="min-h-screen bg-[#0d0c0a] px-4 py-10 md:py-16 text-[#ede8df] font-['Outfit']">
        <div className="mx-auto max-w-4xl space-y-10">
          <header className="space-y-5 rounded-[1.5rem] border border-[#c8bfaa]/10 bg-[#141310]/75 px-5 py-8 md:px-10 md:py-12 shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
            <PublicNav locale={locale} className="mb-4" />
            <h1 className="font-['Cormorant_Garamond'] text-[2.35rem] md:text-[3.5rem] font-light leading-[1.06]">
              {config.heading}
            </h1>
            <p className="max-w-2xl text-[1rem] md:text-[1.08rem] leading-[1.8] text-[#b7af9e]">
              {config.intro}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to={config.cta.href}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#8a6d3b]/60 px-6 py-3 text-[0.74rem] uppercase tracking-[0.18em] text-[#d4aa6a] transition-all duration-300 hover:border-[#d4aa6a] hover:text-[#e8cfa0] hover:bg-[#8a6d3b]/8"
              >
                {config.cta.label}
              </Link>
              <Link
                to="/"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#c8bfaa]/10 px-6 py-3 text-[0.74rem] uppercase tracking-[0.18em] text-[#a09880] transition-all duration-300 hover:border-[#8a6d3b]/40 hover:text-[#d9c8a5]"
              >
                {locale === 'en' ? 'Back to Nornsight' : 'Retour à Nornsight'}
              </Link>
            </div>
            {config.note && (
              <p className="max-w-2xl text-[0.95rem] leading-[1.75] text-[#8f8776]">
                {config.note}
              </p>
            )}
          </header>

          <section className="grid gap-5 md:grid-cols-2">
            {config.sections.map((section) => (
              <article
                key={section.title}
                className="rounded-[1.35rem] border border-[#c8bfaa]/10 bg-[#141310]/55 px-5 py-6 md:px-6"
              >
                <h2 className="mb-3 font-['Cinzel'] text-[1.25rem] md:text-[1.45rem] leading-tight text-[#ede8df]">
                  {section.title}
                </h2>
                <p className="text-[0.98rem] leading-[1.8] text-[#a09880]">
                  {section.body}
                </p>
              </article>
            ))}
          </section>

          {Array.isArray(config.faq) && config.faq.length > 0 && (
            <section className="rounded-[1.35rem] border border-[#c8bfaa]/10 bg-[#141310]/55 px-5 py-6 md:px-6">
              <h2 className="mb-5 font-['Cinzel'] text-[1.5rem] md:text-[1.9rem] leading-tight text-[#ede8df]">
                {locale === 'en' ? 'Frequently asked questions' : 'Questions fréquentes'}
              </h2>
              <div className="space-y-5">
                {config.faq.map((item) => (
                  <div key={item.question} className="space-y-2">
                    <h3 className="text-[1rem] md:text-[1.05rem] font-medium text-[#ede8df]">
                      {item.question}
                    </h3>
                    <p className="text-[0.98rem] leading-[1.8] text-[#a09880]">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {Array.isArray(config.relatedLinks) && config.relatedLinks.length > 0 && (
            <section className="rounded-[1.35rem] border border-[#c8bfaa]/10 bg-[#141310]/55 px-5 py-6 md:px-6">
              <h2 className="mb-4 font-['Cinzel'] text-[1.35rem] md:text-[1.6rem] leading-tight text-[#ede8df]">
                {locale === 'en' ? 'Explore further' : 'Pour aller plus loin'}
              </h2>
              <div className="flex flex-col gap-3">
                {config.relatedLinks.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="rounded-xl border border-[#c8bfaa]/10 px-4 py-3 text-[0.98rem] leading-[1.6] text-[#b7af9e] transition-colors duration-300 hover:border-[#8a6d3b]/40 hover:text-[#ede8df]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default SeoPage;
