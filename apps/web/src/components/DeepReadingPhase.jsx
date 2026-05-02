import React from 'react';
import { motion } from 'framer-motion';
import { parseFullReadingSections } from '@/lib/fullReadingSections.js';

const DeepReadingPhase = ({
  question,
  locale,
  copy,
  emailSaved,
  adminPreviewEnabled,
  adminReadingUnlocked,
  isAdminTestEmail,
  fullReading,
  fullReadingStatus,
  fullReadingError,
  paymentStatusMessage,
  onBack,
  onGoHome,
  onUnlock,
  onRetry
}) => {
  const t = copy;
  const fullReadingBlocks = parseFullReadingSections(fullReading, locale);
  const canAccessReading = adminPreviewEnabled || adminReadingUnlocked || isAdminTestEmail;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-8 md:py-20 px-4"
    >
      <div className="max-w-3xl mx-auto space-y-5 md:space-y-8">
        <div className="flex items-center justify-start">
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
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-2xl p-5 md:p-10"
        >
          <div className="space-y-5 md:space-y-6">
            <div className="space-y-2 md:space-y-3">
              <p className="text-sm font-medium text-accent tracking-wide uppercase">{t.paidStepTitle}</p>
              <h1 className="font-['Cinzel'] text-[2rem] md:text-4xl font-semibold leading-tight" style={{ letterSpacing: '-0.02em' }}>
                {t.paidStepSubtitle}
              </h1>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/10 px-4 md:px-5 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">{t.yourQuestion}</p>
              <p className="text-[0.98rem] md:text-lg leading-relaxed text-foreground/90">{question}</p>
            </div>

            <div className="space-y-3 md:space-y-4">
              {t.valuePoints.map((point) => (
                <div key={point} className="flex gap-3 md:gap-4 items-start">
                  <div className="mt-2 h-1.5 w-1.5 rounded-full bg-accent/80" />
                  <p className="text-[0.95rem] md:text-lg text-muted-foreground leading-[1.7] md:leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/5 space-y-4">
              <p className="font-['Cinzel'] text-[2rem] md:text-3xl font-semibold">{locale === 'en' ? '€5.90' : '5,90 €'}</p>
              <button
                type="button"
                onClick={onUnlock}
                disabled={fullReadingStatus === 'loading'}
                className="w-full min-h-12 glass-strong px-6 md:px-8 py-4 rounded-xl text-base md:text-lg font-medium glow-accent hover:glow-accent-strong transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {canAccessReading
                  ? fullReadingStatus === 'loading'
                    ? t.previewLoading
                    : adminReadingUnlocked
                      ? t.paidViewButton
                      : t.unlockButton
                  : t.unlockButton}
              </button>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t.paidDelivery}
              </p>

              {canAccessReading && (
                <p className="text-sm text-accent/90 leading-relaxed">
                  {t.adminAccess}
                </p>
              )}

              {!canAccessReading && !emailSaved && (
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  {t.paymentEmailRequired}
                </p>
              )}

              {!canAccessReading && emailSaved && (
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  {t.paymentPending}
                </p>
              )}

              {paymentStatusMessage && (
                <p className="text-sm text-accent/90 leading-relaxed">
                  {paymentStatusMessage}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {canAccessReading && fullReadingStatus === 'loading' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-5 md:p-8"
          >
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed animate-pulse">
              {t.fullReadingLoading}
            </p>
          </motion.div>
        )}

        {canAccessReading && fullReading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-5 md:p-10"
          >
            <div className="space-y-4 md:space-y-5">
              {fullReadingBlocks.map((section, index) => (
                <div key={index} className="space-y-2 md:space-y-3">
                  {section.title && (
                    <p className="text-[0.62rem] md:text-[0.7rem] uppercase tracking-[0.16em] md:tracking-[0.2em] text-accent/90">
                      {section.title}
                    </p>
                  )}
                  <p className="text-[0.98rem] md:text-lg leading-[1.8] md:leading-[1.95] text-muted-foreground">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {canAccessReading && fullReadingStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-5 md:p-8 space-y-4 border border-white/6"
          >
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {t.fullReadingError}
            </p>
            {fullReadingError && <p className="text-sm text-muted-foreground/80">{fullReadingError}</p>}
            <button
              type="button"
              onClick={onRetry}
              className="glass-strong px-6 py-3 rounded-xl text-base font-medium transition-all duration-300 active:scale-[0.98]"
            >
              {t.retry}
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="flex justify-center pt-2 md:pt-4"
        >
          <button
            type="button"
            onClick={onGoHome}
            className="w-full sm:w-auto min-h-12 glass-strong px-6 md:px-8 py-4 rounded-xl text-center text-base md:text-lg font-medium glow-accent hover:glow-accent-strong transition-all duration-300 active:scale-[0.98]"
          >
            {t.newDrawButton}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DeepReadingPhase;
