import runeData from '../src/data/runeData.js';
import { getStrictPositionProfile } from '../src/data/runeReferential.js';
import {
  POSITION_KEYS,
  POSITION_LABELS,
  getPositionSourceKey,
  buildPositionInterpretation,
  buildPositionKeywords
} from '../src/lib/runePositions.js';

export function drawRunes() {
  const shuffled = [...runeData].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  return selected.map((rune, index) => {
    const positionKey = POSITION_KEYS[index];
    const sourceKey = getPositionSourceKey(positionKey, index);
    const positionInterpretations = rune.interpretations[positionKey] || [];
    const randomIndex = Math.floor(Math.random() * positionInterpretations.length);
    // Nornsight does not use reversed runes as a product rule.
    // Any remaining orientation flag is legacy-compatible only; blocking nuances come
    // from the internal metadata (restrictive, limitante, instable, etc.).
    const isReversed = rune?.isReversed === true;
    const positionProfile = getStrictPositionProfile(rune.referential, sourceKey, { isReversed });

    return {
      symbole: rune.symbole,
      nom: rune.nom,
      isReversed,
      positionKey,
      positionSourceKey: sourceKey,
      positionLabel: POSITION_LABELS[index],
      orientationLabel: isReversed ? 'Renversée' : 'Droite',
      interpretation: buildPositionInterpretation(
        positionKey,
        sourceKey,
        positionProfile.semanticCore ||
          (sourceKey === 'essence'
            ? rune.referential.essence?.axis
            : rune.referential.positions[sourceKey]?.axis)
      ),
      positionKeywords: buildPositionKeywords(positionProfile.allowedKeywords),
      positionProfile,
      detailedInterpretation: positionInterpretations[randomIndex],
      essenceSummary: rune.essence.summary,
      essenceKeywords: rune.essence.keywords,
      referential: rune.referential
    };
  });
}
