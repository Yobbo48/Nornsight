import React from 'react';
import { motion } from 'framer-motion';
import { POSITION_LABELS } from '@/lib/runePositions.js';
import { parseFullReadingSections } from '@/lib/fullReadingSections.js';

const ResultsPhase = ({
  runes,
  question,
  locale,
  copy,
  email,
  emailSaved,
  emailError,
  emailLimitNotice,
  freeReadingSummary,
  summaryStatus,
  teaserReading,
  teaserReadingStatus,
  teaserReadingError,
  adminPreviewEnabled,
  adminReadingUnlocked,
  isAdminTestEmail,
  fullReading,
  fullReadingStatus,
  fullReadingError,
  onEmailChange,
  onEmailSubmit,
  onDeepen,
  onNewDraw,
  onGoHome,
  onRetryTeaser,
  onRetryFullReading
}) => {
  const t = copy;
  const fullReadingBlocks = parseFullReadingSections(fullReading, locale);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen py-8 md:py-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-start mb-6 md:mb-8">
          <button
            type="button"
            onClick={onGoHome}
            className="font-['Cormorant_Garamond'] text-[2rem] md:text-[2.35rem] leading-none tracking-[-0.02em] text-foreground/92 transition-colors hover:text-accent"
          >
            Nornsight
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-5 md:p-6 mb-8 md:mb-10"
        >
          <p className="text-sm text-muted-foreground mb-2">{t.questionLead}</p>
          <p className="text-[0.98rem] md:text-lg leading-relaxed">{question}</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[0.98rem] md:text-lg text-center text-muted-foreground mb-7 md:mb-8 leading-relaxed max-w-2xl mx-auto px-2"
        >
          {t.resultsIntro}
        </motion.p>

        <div className="space-y-5 md:space-y-12 mb-10 md:mb-12">
          {runes.map((rune, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
              className="glass rounded-2xl p-4 md:p-8"
            >
              <div className="mb-4">
                <div className="text-[0.76rem] md:text-sm font-medium text-accent mb-3 tracking-wide uppercase">
                  {rune.positionLabel || POSITION_LABELS[index]}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-4xl sm:text-5xl md:text-6xl text-accent shrink-0">
                    {rune.symbole}
                  </div>
                  <div className="font-['Cinzel'] text-[1.8rem] sm:text-2xl md:text-3xl font-semibold leading-none">{rune.nom}</div>
                </div>
              </div>

              <div className="mt-5 md:mt-6">
                {Array.isArray(rune.positionKeywords) && rune.positionKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {rune.positionKeywords.map((keyword) => (
                      <span
                        key={`${rune.nom}-${keyword}`}
                        className="rounded-full border border-white/8 bg-black/10 px-3 py-1.5 text-[0.82rem] md:text-[0.95rem] leading-tight text-muted-foreground"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                    {rune.interpretation}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="glass rounded-2xl p-5 md:p-8 mb-7 md:mb-10 text-center"
        >
          <p className="text-[1rem] md:text-2xl leading-[1.8] md:leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            {freeReadingSummary}
          </p>

          {summaryStatus === 'loading' && (
            <p className="text-sm text-muted-foreground/70 mt-4 animate-pulse">
              {t.summaryLoading}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.93 }}
          className="glass rounded-2xl p-5 md:p-8 mb-7 md:mb-10"
        >
          <div className="mb-6">
            <p className="text-sm font-medium text-accent tracking-wide uppercase mb-2">
              {t.goFurtherLabel}
            </p>
            <p className="text-[0.98rem] md:text-xl leading-[1.75] md:leading-relaxed text-muted-foreground max-w-3xl">
              {t.bridgeLine1}
              <br />
              {t.bridgeLine2}
            </p>
          </div>

          {teaserReadingStatus === 'loading' && (
            <p className="text-lg text-muted-foreground leading-relaxed animate-pulse">
              {t.teaserLoading}
            </p>
          )}

          {teaserReading && (
            <div className="space-y-5">
              <p className="text-base md:text-lg leading-[1.85] md:leading-[1.95] text-muted-foreground max-w-3xl">
                {teaserReading}
              </p>
            </div>
          )}

          {teaserReadingStatus === 'error' && (
            <div className="rounded-xl border border-white/6 bg-black/10 px-5 py-5 space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.teaserError}
              </p>
              {teaserReadingError && <p className="text-sm text-muted-foreground/80">{teaserReadingError}</p>}
              <p className="text-sm text-muted-foreground/80">{t.teaserRetryHint}</p>
              <button
                onClick={onRetryTeaser}
                className="glass-strong px-6 py-3 rounded-xl text-base font-medium transition-all duration-300 active:scale-[0.98]"
              >
                {t.retry}
              </button>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="glass-strong rounded-2xl p-5 md:p-8 mb-7 md:mb-10"
        >
          <div className="mb-6 space-y-3">
            <p className="text-sm text-muted-foreground/85 leading-relaxed">
              {t.emailCaptureLead}
            </p>
            <h4 className="font-['Cinzel'] text-2xl font-semibold" style={{ letterSpacing: '-0.02em' }}>
              {t.emailTitle}
            </h4>
            <p className="text-base md:text-lg text-muted-foreground leading-[1.75] md:leading-relaxed max-w-2xl">
              {t.emailBody}
            </p>
          </div>

          <p className="text-sm text-muted-foreground/85 leading-relaxed mb-4">
            {emailSaved ? t.emailEditable : t.emailHint}
          </p>

          <form onSubmit={onEmailSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              placeholder={t.emailPlaceholder}
              className="w-full glass rounded-xl px-5 md:px-6 py-4 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 placeholder:text-muted-foreground/50"
            />

            <button
              type="submit"
              disabled={!email.trim() || fullReadingStatus === 'loading' || (emailSaved && Boolean(fullReading))}
              className="w-full min-h-12 glass-strong px-6 py-4 rounded-xl text-base md:text-lg font-medium glow-accent hover:glow-accent-strong transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {emailSaved ? t.emailSaved : t.emailButton}
            </button>
          </form>

          {emailError && (
            <div className="mt-5 rounded-xl border border-rose-300/10 bg-rose-300/5 px-4 py-4">
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground/95">
                {emailError}
              </p>
            </div>
          )}

          {emailLimitNotice && (
            <div className="mt-5 rounded-xl border border-amber-300/10 bg-amber-300/5 px-4 py-4">
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground/95">
                {emailLimitNotice}
              </p>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-white/6 bg-black/10 px-5 py-5 md:px-6 md:py-6">
            <div className="mb-6">
              <p className="text-sm font-medium text-accent tracking-wide uppercase mb-2">
                {t.goFurtherLabel}
              </p>
              <h3 className="font-['Cinzel'] text-[2rem] md:text-4xl font-semibold leading-tight" style={{ letterSpacing: '-0.02em' }}>
                {t.goFurtherTitle}
              </h3>
            </div>

            <p className="text-base md:text-lg text-muted-foreground leading-[1.75] md:leading-relaxed mb-6 max-w-2xl">
              {t.paidBody}
            </p>

            <button
              onClick={onDeepen}
              type="button"
              disabled={!emailSaved && !adminPreviewEnabled && !adminReadingUnlocked}
              className="w-full min-h-12 glass-strong px-6 py-4 rounded-xl text-base md:text-lg font-medium glow-accent hover:glow-accent-strong transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {adminReadingUnlocked
                ? t.paidViewButton
                : adminPreviewEnabled
                  ? t.paidPreviewButton
                  : t.paidButton}
            </button>

            {!emailSaved && !adminPreviewEnabled && !adminReadingUnlocked && (
              <p className="text-sm text-muted-foreground/80 leading-relaxed mt-4">
                {t.paymentEmailRequired}
              </p>
            )}

            {(adminPreviewEnabled || adminReadingUnlocked) && (
              <p className="text-sm text-accent/90 leading-relaxed mt-4">
                {t.adminAccessInline}
              </p>
            )}

            {isAdminTestEmail && !adminReadingUnlocked && fullReadingStatus !== 'loading' && (
              <p className="text-sm text-muted-foreground/80 leading-relaxed mt-4">
                {t.adminEmailInline}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.08 }}
          className="glass rounded-2xl p-5 md:p-8 mb-10"
        >
          {adminReadingUnlocked && emailSaved && fullReadingStatus === 'loading' && (
            <p className="text-lg text-muted-foreground leading-relaxed mt-8 animate-pulse">
              {t.fullReadingDeploying}
            </p>
          )}

          {adminReadingUnlocked && emailSaved && fullReading && (
            <div className="mt-8 space-y-6">
              <div className="border-t border-white/5 pt-6 md:pt-8">
                <div className="max-w-3xl space-y-4 md:space-y-5">
                  {fullReadingBlocks.map((section, index) => (
                    <div key={index} className="space-y-2">
                      {section.title && (
                        <p className="text-[0.62rem] md:text-[0.68rem] uppercase tracking-[0.16em] md:tracking-[0.18em] text-accent/90">
                          {section.title}
                        </p>
                      )}
                      <p
                        className="text-[0.98rem] md:text-lg leading-[1.82] md:leading-[1.95] text-muted-foreground"
                      >
                        {section.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onDeepen}
                className="w-full sm:w-auto min-h-12 glass-strong px-6 md:px-8 py-4 rounded-xl text-base md:text-lg font-medium glow-accent hover:glow-accent-strong transition-all duration-300 active:scale-[0.98]"
              >
                {t.deepenSessionButton}
              </button>
            </div>
          )}

          {adminReadingUnlocked && fullReadingStatus === 'error' && emailSaved && (
            <div className="mt-8 rounded-xl border border-white/6 bg-black/10 px-5 py-5 space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.fullReadingLoadError}
              </p>
              {fullReadingError && <p className="text-sm text-muted-foreground/80">{fullReadingError}</p>}
              <button
                onClick={onRetryFullReading}
                className="glass-strong px-6 py-3 rounded-xl text-base font-medium transition-all duration-300 active:scale-[0.98]"
              >
                Réessayer
              </button>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.15 }}
          className="flex justify-center"
        >
          <button
            onClick={onNewDraw}
            className="w-full sm:w-auto min-h-12 glass-strong px-6 md:px-8 py-4 rounded-xl text-base md:text-lg font-medium hover:bg-muted/50 transition-all duration-300 active:scale-[0.98]"
          >
            {t.newDrawButton}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultsPhase;
