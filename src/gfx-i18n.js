'use strict';

// Loop Loom — strings for the Graphics settings panel (and the title's
// Settings button) in the nine supported locales. The rest of the game is
// still en-US only; this table is chosen from navigator.language.

const en = {
  settings: 'Settings', graphics: 'Graphics', quality: 'Quality', auto: 'Auto (detected: {tier})',
  renderScale: 'Render scale', adaptive: 'Adaptive resolution', showFps: 'Show frame rate',
  fromPreset: 'From preset ({tier})', postFailed: 'Post-processing is unavailable on this device, so the game renders without it.',
  noWebgl: '3D is unavailable, so graphics settings have no effect.',
  preset: { low: 'Low', balanced: 'Balanced', high: 'High', ultra: 'Ultra' },
  cat: { shadows: 'Shadows', ao: 'Ambient occlusion', bloom: 'Bloom', grade: 'Color grade', antialias: 'Anti-aliasing', reflections: 'Reflections', particles: 'Particles', background: 'Ambient motion', detail: 'Detail' },
  tier: { off: 'Off', on: 'On', low: 'Low', medium: 'Medium', high: 'High', fxaa: 'FXAA', smaa: 'SMAA', msaa: 'MSAA', static: 'Still', animated: 'Animated', plain: 'Plain', detailed: 'Detailed' },
  sum: { noShadows: 'no shadows', shadows: '{n}² shadows', ao: 'ambient occlusion', aoHigh: 'full ambient occlusion', bloom: 'bloom', reflections: 'reflections', noAa: 'no anti-aliasing', px: '{w}×{h} px' },
};

const enGB = {
  ...en,
  cat: { ...en.cat, grade: 'Colour grade' },
};

const es = {
  settings: 'Ajustes', graphics: 'Gráficos', quality: 'Calidad', auto: 'Automática (detectada: {tier})',
  renderScale: 'Escala de renderizado', adaptive: 'Resolución adaptativa', showFps: 'Mostrar fotogramas por segundo',
  fromPreset: 'Según el preajuste ({tier})', postFailed: 'El posprocesado no está disponible en este dispositivo, así que el juego se muestra sin él.',
  noWebgl: 'El 3D no está disponible, así que los ajustes gráficos no tienen efecto.',
  preset: { low: 'Baja', balanced: 'Equilibrada', high: 'Alta', ultra: 'Ultra' },
  cat: { shadows: 'Sombras', ao: 'Oclusión ambiental', bloom: 'Resplandor', grade: 'Corrección de color', antialias: 'Suavizado de bordes', reflections: 'Reflejos', particles: 'Partículas', background: 'Movimiento ambiental', detail: 'Detalle' },
  tier: { off: 'No', on: 'Sí', low: 'Bajas', medium: 'Medias', high: 'Altas', fxaa: 'FXAA', smaa: 'SMAA', msaa: 'MSAA', static: 'Quieto', animated: 'Animado', plain: 'Sencillo', detailed: 'Detallado' },
  sum: { noShadows: 'sin sombras', shadows: 'sombras {n}²', ao: 'oclusión ambiental', aoHigh: 'oclusión ambiental completa', bloom: 'resplandor', reflections: 'reflejos', noAa: 'sin suavizado', px: '{w}×{h} px' },
};

const es419 = { ...es, settings: 'Configuración', cat: { ...es.cat, grade: 'Gradación de color' } };

const de = {
  settings: 'Einstellungen', graphics: 'Grafik', quality: 'Qualität', auto: 'Automatisch (erkannt: {tier})',
  renderScale: 'Renderskalierung', adaptive: 'Adaptive Auflösung', showFps: 'Bildrate anzeigen',
  fromPreset: 'Aus Voreinstellung ({tier})', postFailed: 'Nachbearbeitung ist auf diesem Gerät nicht verfügbar, daher wird ohne sie gerendert.',
  noWebgl: '3D ist nicht verfügbar, daher haben Grafikeinstellungen keine Wirkung.',
  preset: { low: 'Niedrig', balanced: 'Ausgewogen', high: 'Hoch', ultra: 'Ultra' },
  cat: { shadows: 'Schatten', ao: 'Umgebungsverdeckung', bloom: 'Leuchteffekt', grade: 'Farbkorrektur', antialias: 'Kantenglättung', reflections: 'Spiegelungen', particles: 'Partikel', background: 'Umgebungsbewegung', detail: 'Detailgrad' },
  tier: { off: 'Aus', on: 'An', low: 'Niedrig', medium: 'Mittel', high: 'Hoch', fxaa: 'FXAA', smaa: 'SMAA', msaa: 'MSAA', static: 'Unbewegt', animated: 'Animiert', plain: 'Einfach', detailed: 'Detailliert' },
  sum: { noShadows: 'keine Schatten', shadows: '{n}²-Schatten', ao: 'Umgebungsverdeckung', aoHigh: 'volle Umgebungsverdeckung', bloom: 'Leuchteffekt', reflections: 'Spiegelungen', noAa: 'keine Kantenglättung', px: '{w}×{h} px' },
};

const fr = {
  settings: 'Paramètres', graphics: 'Graphismes', quality: 'Qualité', auto: 'Auto (détectée : {tier})',
  renderScale: 'Échelle de rendu', adaptive: 'Résolution adaptative', showFps: 'Afficher la fréquence d’images',
  fromPreset: 'Selon le préréglage ({tier})', postFailed: 'Le post-traitement n’est pas disponible sur cet appareil ; le jeu s’affiche sans.',
  noWebgl: 'La 3D n’est pas disponible ; les réglages graphiques sont sans effet.',
  preset: { low: 'Basse', balanced: 'Équilibrée', high: 'Haute', ultra: 'Ultra' },
  cat: { shadows: 'Ombres', ao: 'Occlusion ambiante', bloom: 'Halo lumineux', grade: 'Étalonnage des couleurs', antialias: 'Anticrénelage', reflections: 'Reflets', particles: 'Particules', background: 'Mouvement d’ambiance', detail: 'Détails' },
  tier: { off: 'Non', on: 'Oui', low: 'Basses', medium: 'Moyennes', high: 'Hautes', fxaa: 'FXAA', smaa: 'SMAA', msaa: 'MSAA', static: 'Fixe', animated: 'Animé', plain: 'Simple', detailed: 'Détaillé' },
  sum: { noShadows: 'sans ombres', shadows: 'ombres {n}²', ao: 'occlusion ambiante', aoHigh: 'occlusion ambiante complète', bloom: 'halo', reflections: 'reflets', noAa: 'sans anticrénelage', px: '{w}×{h} px' },
};

const frCA = { ...fr, settings: 'Réglages', cat: { ...fr.cat, grade: 'Correction des couleurs' } };

const ptBR = {
  settings: 'Configurações', graphics: 'Gráficos', quality: 'Qualidade', auto: 'Automática (detectada: {tier})',
  renderScale: 'Escala de renderização', adaptive: 'Resolução adaptativa', showFps: 'Mostrar taxa de quadros',
  fromPreset: 'Do predefinido ({tier})', postFailed: 'O pós-processamento não está disponível neste dispositivo, então o jogo é exibido sem ele.',
  noWebgl: 'O 3D não está disponível, então as configurações gráficas não têm efeito.',
  preset: { low: 'Baixa', balanced: 'Equilibrada', high: 'Alta', ultra: 'Ultra' },
  cat: { shadows: 'Sombras', ao: 'Oclusão ambiente', bloom: 'Brilho', grade: 'Correção de cor', antialias: 'Antisserrilhado', reflections: 'Reflexos', particles: 'Partículas', background: 'Movimento ambiente', detail: 'Detalhes' },
  tier: { off: 'Não', on: 'Sim', low: 'Baixas', medium: 'Médias', high: 'Altas', fxaa: 'FXAA', smaa: 'SMAA', msaa: 'MSAA', static: 'Parado', animated: 'Animado', plain: 'Simples', detailed: 'Detalhado' },
  sum: { noShadows: 'sem sombras', shadows: 'sombras {n}²', ao: 'oclusão ambiente', aoHigh: 'oclusão ambiente completa', bloom: 'brilho', reflections: 'reflexos', noAa: 'sem antisserrilhado', px: '{w}×{h} px' },
};

const it = {
  settings: 'Impostazioni', graphics: 'Grafica', quality: 'Qualità', auto: 'Automatica (rilevata: {tier})',
  renderScale: 'Scala di rendering', adaptive: 'Risoluzione adattiva', showFps: 'Mostra frequenza fotogrammi',
  fromPreset: 'Da preimpostazione ({tier})', postFailed: 'La post-elaborazione non è disponibile su questo dispositivo, quindi il gioco viene mostrato senza.',
  noWebgl: 'Il 3D non è disponibile, quindi le impostazioni grafiche non hanno effetto.',
  preset: { low: 'Bassa', balanced: 'Bilanciata', high: 'Alta', ultra: 'Ultra' },
  cat: { shadows: 'Ombre', ao: 'Occlusione ambientale', bloom: 'Bagliore', grade: 'Correzione colore', antialias: 'Antialiasing', reflections: 'Riflessi', particles: 'Particelle', background: 'Movimento ambientale', detail: 'Dettaglio' },
  tier: { off: 'No', on: 'Sì', low: 'Basse', medium: 'Medie', high: 'Alte', fxaa: 'FXAA', smaa: 'SMAA', msaa: 'MSAA', static: 'Fermo', animated: 'Animato', plain: 'Semplice', detailed: 'Dettagliato' },
  sum: { noShadows: 'senza ombre', shadows: 'ombre {n}²', ao: 'occlusione ambientale', aoHigh: 'occlusione ambientale completa', bloom: 'bagliore', reflections: 'riflessi', noAa: 'senza antialiasing', px: '{w}×{h} px' },
};

export const GFX_STRINGS = {
  'en-US': en, 'en-GB': enGB, 'es-419': es419, 'es-ES': es, 'de-DE': de,
  'fr-FR': fr, 'fr-CA': frCA, 'pt-BR': ptBR, 'it-IT': it,
};

/** Pick the closest supported locale for a BCP-47 tag. */
export function pickLocale(tag) {
  const t = String(tag || 'en-US');
  const exact = Object.keys(GFX_STRINGS).find((k) => k.toLowerCase() === t.toLowerCase());
  if (exact) return exact;
  const [lang, region = ''] = t.toLowerCase().split('-');
  if (lang === 'en') return ['gb', 'uk', 'ie', 'au', 'nz'].includes(region) ? 'en-GB' : 'en-US';
  if (lang === 'es') return region === 'es' || !region ? 'es-ES' : 'es-419';
  if (lang === 'fr') return region === 'ca' ? 'fr-CA' : 'fr-FR';
  if (lang === 'pt') return 'pt-BR';
  if (lang === 'de') return 'de-DE';
  if (lang === 'it') return 'it-IT';
  return 'en-US';
}

export function gfxStrings(tag) {
  return GFX_STRINGS[pickLocale(tag)];
}
