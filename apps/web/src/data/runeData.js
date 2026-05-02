import runeReferential from './runeReferential.js';
import { POSITION_KEYS, POSITION_SOURCE_BY_INDEX } from '../lib/runePositions.js';

const runeData = runeReferential.map((rune) => ({
  symbole: rune.symbole,
  nom: rune.nom,
  essence: rune.essence,
  source: rune.source,
  interpretations: Object.fromEntries(
    POSITION_KEYS.map((positionKey, index) => {
      const sourceKey = POSITION_SOURCE_BY_INDEX[index];
      const sourceNode = sourceKey === 'essence' ? rune.essence : rune.positions[sourceKey];
      return [positionKey, [sourceNode.summary]];
    })
  ),
  referential: rune
}));

export default runeData;
