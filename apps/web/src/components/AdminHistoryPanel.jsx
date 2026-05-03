import React from 'react';
import { motion } from 'framer-motion';

const formatDate = (value) => {
  if (!value) {
    return '';
  }

  try {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const AdminHistoryPanel = ({ drawings = [], status, error }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 md:p-8"
    >
      <div className="space-y-2 mb-6">
        <p className="text-sm font-medium text-accent tracking-wide uppercase">Historique admin</p>
        <h3 className="font-['Cinzel'] text-2xl md:text-3xl font-semibold" style={{ letterSpacing: '-0.02em' }}>
          Questions et lectures enregistrées
        </h3>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
          Les derniers tirages enregistrés, y compris les contenus gratuits.
        </p>
      </div>

      {status === 'loading' && (
        <p className="text-base text-muted-foreground animate-pulse">
          Chargement de l’historique…
        </p>
      )}

      {status === 'error' && (
        <div className="rounded-xl border border-white/6 bg-black/10 px-5 py-5">
          <p className="text-base text-muted-foreground">Impossible de charger l’historique pour l’instant.</p>
          {error && <p className="text-sm text-muted-foreground/80 mt-2">{error}</p>}
        </div>
      )}

      {status !== 'loading' && status !== 'error' && (
        <div className="space-y-4">
          {drawings.length === 0 && (
            <p className="text-base text-muted-foreground">Aucun tirage enregistré pour le moment.</p>
          )}

          {drawings.map((drawing) => (
            <article
              key={drawing.id}
              className="rounded-xl border border-white/6 bg-black/10 px-5 py-5 space-y-3"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
                <span>{formatDate(drawing.updatedAt || drawing.createdAt)}</span>
                <span>{drawing.status}</span>
                {drawing.email && <span>{drawing.email}</span>}
              </div>

              <p className="text-base md:text-lg leading-relaxed text-foreground/95">
                {drawing.question}
              </p>

              {drawing.interpretation?.freeReadingSummary && (
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                  {drawing.interpretation.freeReadingSummary}
                </p>
              )}

              {drawing.interpretation?.teaserReading && (
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground/85">
                  {drawing.interpretation.teaserReading}
                </p>
              )}

              {drawing.interpretation?.fullReading && (
                <p className="text-sm md:text-base leading-relaxed text-foreground/85">
                  {drawing.interpretation.fullReading}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default AdminHistoryPanel;
