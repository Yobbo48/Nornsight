export const POSITION_LABELS = ['Passé', 'Présent', 'Futur'];
export const POSITION_LABELS_BY_LOCALE = {
  fr: POSITION_LABELS,
  en: ['Past', 'Present', 'Future']
};
export const POSITION_KEYS = ['past', 'present', 'future'];

export const POSITION_SOURCE_KEYS = {
  past: 'dynamique',
  present: 'essence',
  future: 'mouvement'
};

export const POSITION_SOURCE_BY_INDEX = ['dynamique', 'essence', 'mouvement'];

export const getPositionSourceKey = (positionKey, index = 0) =>
  POSITION_SOURCE_KEYS[positionKey] || POSITION_SOURCE_BY_INDEX[index] || 'dynamique';

const withFrenchAccents = (text) =>
  String(text || '')
    .replace(/\bdeja\b/gi, 'déjà')
    .replace(/\bclarte\b/gi, 'clarté')
    .replace(/\binterieure\b/gi, 'intérieure')
    .replace(/\bmobilisee\b/gi, 'mobilisée')
    .replace(/\bepreuve\b/gi, 'épreuve')
    .replace(/\barret\b/gi, 'arrêt')
    .replace(/\ba\b/gi, 'a')
    .replace(/\betre\b/gi, 'être')
    .replace(/\bnait\b/gi, 'naît')
    .replace(/\breside\b/gi, 'réside')
    .replace(/\bapparait\b/gi, 'apparaît')
    .replace(/\bverite\b/gi, 'vérité')
    .replace(/\bcoherent\b/gi, 'cohérent')
    .replace(/\bprecise\b/gi, 'précise')
    .replace(/\bprecis\b/gi, 'précis')
    .replace(/\breelle\b/gi, 'réelle')
    .replace(/\breel\b/gi, 'réel')
    .replace(/\bfacon\b/gi, 'façon')
    .replace(/\bdesynchronisation\b/gi, 'désynchronisation')
    .replace(/\bnecessaire\b/gi, 'nécessaire')
    .replace(/\bheritage\b/gi, 'héritage')
    .replace(/\binterieur\b/gi, 'intérieur')
    .replace(/\bequilibre\b/gi, 'équilibre')
    .replace(/\bechange\b/gi, 'échange')
    .replace(/\becoute\b/gi, 'écoute')
    .replace(/\bevidence\b/gi, 'évidence')
    .replace(/\belan\b/gi, 'élan')
    .replace(/\bcoherence\b/gi, 'cohérence')
    .replace(/\bidentite\b/gi, 'identité')
    .replace(/\bdependance\b/gi, 'dépendance')
    .replace(/\bselection\b/gi, 'sélection')
    .replace(/\brevelation\b/gi, 'révélation')
    .replace(/\bepuisement\b/gi, 'épuisement')
    .replace(/\bnouveaute\b/gi, 'nouveauté')
    .replace(/\bcolere\b/gi, 'colère')
    .replace(/\bdurete\b/gi, 'dureté')
    .replace(/\bdeception\b/gi, 'déception')
    .replace(/\bresistance\b/gi, 'résistance')
    .replace(/\bcomplementarite\b/gi, 'complémentarité')
    .replace(/\bvulnerabilite\b/gi, 'vulnérabilité')
    .replace(/\bavidite\b/gi, 'avidité')
    .replace(/\bretention\b/gi, 'rétention')
    .replace(/\blumiere\b/gi, 'lumière')
    .replace(/\bdifficulte\b/gi, 'difficulté')
    .replace(/\bfragilite\b/gi, 'fragilité')
    .replace(/\blacher\b/gi, 'lâcher')
    .replace(/\bfige\b/gi, 'figé')
    .replace(/\bdesordre\b/gi, 'désordre')
    .replace(/\binevitable\b/gi, 'inévitable')
    .replace(/\bloyaute\b/gi, 'loyauté')
    .replace(/\brigidite\b/gi, 'rigidité')
    .replace(/\bresistee\b/gi, 'résistée')
    .replace(/\bpresent\b/gi, 'présent')
    .replace(/\bpresente\b/gi, 'présente')
    .replace(/\binfluencee\b/gi, 'influencée')
    .replace(/\binfluence\b/gi, 'influence')
    .replace(/\badapte\b/gi, 'adapté')
    .replace(/\bemerger\b/gi, 'émerger')
    .replace(/\bemerge\b/gi, 'émerge')
    .replace(/\bemergence\b/gi, 'émergence')
    .replace(/\bopacite\b/gi, 'opacité')
    .replace(/\bincertain\b/gi, 'incertain')
    .replace(/\bincertaine\b/gi, 'incertaine')
    .replace(/\bdesequilibre\b/gi, 'déséquilibre')
    .replace(/\bdesynchronie\b/gi, 'désynchronie')
    .replace(/\bressource\b/gi, 'ressource')
    .replace(/\bressources\b/gi, 'ressources')
    .replace(/\bporosite\b/gi, 'porosité')
    .replace(/\bhypervigilance\b/gi, 'hypervigilance')
    .replace(/\bnecessite de se positionner\b/gi, 'nécessité de se positionner')
    .replace(/\btenir le seuil jusqu'a la bascule\b/gi, 'tenir le seuil jusqu’à la bascule')
    .replace(/\bfaire confiance au flux sans s'y dissoudre\b/gi, 'faire confiance au flux sans s’y dissoudre');

export const buildPositionInterpretation = (positionKey, sourceKey, text, locale = 'fr') => {
  // The public cards now carry precise controlled keywords. Keep this sentence neutral
  // so legacy snapshots never expose awkward generated fragments.
  const fallbackByPosition =
    locale === 'en'
      ? {
          past: 'The past gives the background of the reading.',
          present: 'The present shows the most active point.',
          future: 'The future points to a possible direction.'
        }
      : {
          past: 'Le passé donne le contexte du tirage.',
          present: 'Le présent montre le point le plus actif.',
          future: 'Le futur indique une direction possible.'
        };

  return fallbackByPosition[positionKey] || fallbackByPosition.future;
};

export const buildPositionKeywords = (keywords = [], locale = 'fr') =>
  (Array.isArray(keywords) ? keywords : [])
    .map((keyword) => String(keyword || '').trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((keyword) => {
      if (locale === 'en') {
        return keyword;
      }

      return withFrenchAccents(keyword)
        .replace(/\bdu donner-recevoir\b/gi, 'donner-recevoir')
        .replace(/\bdu flux\b/gi, 'flux')
        .replace(/\s{2,}/g, ' ')
        .trim();
    });
