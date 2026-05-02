export const DEFAULT_FULL_READING_SECTION_TITLES = {
  fr: [
    'Ce qui ressort',
    'Ce qui bloque',
    'Ce que tu peux ajuster'
  ],
  en: [
    'What stands out',
    'What is blocked',
    'What you can adjust'
  ]
};

const HEADING_PATTERNS = [
  /^ce que le tirage indique clairement\.?$/i,
  /^ce qui agit reellement dans la situation\.?$/i,
  /^ce qui agit réellement dans la situation\.?$/i,
  /^ce vers quoi cela tend\.?$/i,
  /^ce que cela dit de ta maniere de vivre la situation\.?$/i,
  /^ce que cela dit de ta manière de vivre la situation\.?$/i,
  /^le point d['’]ajustement\.?$/i,
  /^ce qui est deja pose\.?$/i,
  /^ce qui est déjà posé\.?$/i,
  /^ce qui est deja en place\.?$/i,
  /^ce qui est déjà en place\.?$/i,
  /^ce qui domine maintenant\.?$/i,
  /^le noeud actif du present\.?$/i,
  /^le nœud actif du présent\.?$/i,
  /^ce qui va probablement suivre(?:,? et ce qui peut faire basculer la suite)?\.?$/i,
  /^le passage ou l['’]ajustement demande\.?$/i,
  /^le passage ou l['’]ajustement demandé\.?$/i,
  /^what the reading clearly shows\.?$/i,
  /^what is really acting in the situation\.?$/i,
  /^what this tends toward\.?$/i,
  /^what this says about the way you are living it\.?$/i,
  /^the point of adjustment\.?$/i,
  /^what is already in place\.?$/i,
  /^what now dominates\.?$/i,
  /^what will likely follow(?:,? and what can shift the outcome)?\.?$/i
];

const cleanBlock = (value) => String(value || '').replace(/\r/g, '').trim();

const isNumericOnlyBlock = (value) => /^\d+\s*(?:[.)]|-\s*)?$/.test(cleanBlock(value));

const normalizeHeading = (value) =>
  cleanBlock(value)
    .replace(/^\d+\.\s*/, '')
    .replace(/[.:]+$/g, '')
    .trim();

const isHeadingBlock = (value) => {
  const normalized = normalizeHeading(value);
  return HEADING_PATTERNS.some((pattern) => pattern.test(normalized));
};

const mergeOverflowSections = (sections, maxSections) => {
  if (sections.length <= maxSections) {
    return sections;
  }

  const kept = sections.slice(0, maxSections - 1);
  const overflow = sections.slice(maxSections - 1);
  const lastTitle = overflow[0]?.title || kept[maxSections - 2]?.title || null;
  const mergedBody = overflow
    .map((section) => section.body)
    .filter(Boolean)
    .join('\n\n')
    .trim();

  kept.push({ title: lastTitle, body: mergedBody });
  return kept;
};

const shouldPreserveLegacySections = (sections) =>
  sections.length > 3 &&
  sections.length <= 5 &&
  sections.every((section) => Boolean(section.title && section.body));

export const parseFullReadingSections = (text, locale = 'fr') => {
  const normalizedText = cleanBlock(text);
  if (!normalizedText) {
    return [];
  }

  const sectionTitles = DEFAULT_FULL_READING_SECTION_TITLES[locale] || DEFAULT_FULL_READING_SECTION_TITLES.fr;
  const rawBlocks = normalizedText
    .split(/\n\s*\n/)
    .map(cleanBlock)
    .filter(Boolean)
    .filter((block) => !isNumericOnlyBlock(block));

  const sections = [];
  let pendingTitle = null;

  for (const block of rawBlocks) {
    const lines = block
      .split('\n')
      .map(cleanBlock)
      .filter(Boolean)
      .filter((line) => !isNumericOnlyBlock(line));

    if (lines.length === 0) {
      continue;
    }

    const firstLine = lines[0];

    if (lines.length === 1 && isHeadingBlock(firstLine)) {
      pendingTitle = normalizeHeading(firstLine);
      continue;
    }

    if (isHeadingBlock(firstLine)) {
      const title = normalizeHeading(firstLine);
      const body = lines.slice(1).join(' ').trim();
      if (body) {
        sections.push({ title, body });
        pendingTitle = null;
      } else {
        pendingTitle = title;
      }
      continue;
    }

    sections.push({
      title: pendingTitle,
      body: lines.join(' ').trim()
    });
    pendingTitle = null;
  }

  const sectionsWithBody = sections.filter((section) => section.body);
  const hasExplicitHeadings = sectionsWithBody.some((section) => Boolean(section.title));

  if (!hasExplicitHeadings) {
    const shouldAddDiscreetTitles = sectionsWithBody.length >= 2;

    return sectionsWithBody.map((section, index) => ({
      title: shouldAddDiscreetTitles ? sectionTitles[index] || null : null,
      body: section.body
    }));
  }

  const cleanedSections = shouldPreserveLegacySections(sectionsWithBody)
    ? sectionsWithBody
    : mergeOverflowSections(sectionsWithBody, sectionTitles.length);

  return cleanedSections.map((section, index) => ({
    title: section.title || sectionTitles[index] || `${index + 1}`,
    body: section.body
  }));
};
