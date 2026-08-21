export type BackgroundKind = 'gradient' | 'image';

export type BackgroundOptions = {
  id: string;
  label: string;
  name: string;
  kind: BackgroundKind;
  value: string;
  isCustom?: boolean;
};

export const backgrounds: BackgroundOptions[] = [
  {
    id: 'melforia-mist',
    name: 'Melforia Tiefsee',
    label: 'Melforia Tiefsee',
    kind: 'gradient',
    value:
      'linear-gradient(180deg, rgba(255, 255, 255, 0.01), rgba(6, 17, 29, 0.08)), radial-gradient(circle at 76% 12%, rgba(102, 157, 219, 0.2), transparent 34%), linear-gradient(155deg, #1a293b 0%, #24384d 50%, #2c4258 100%)',
  },
  {
    id: 'calm-sky',
    name: 'Ruhiger Himmel',
    label: 'Ruhiger Himmel',
    kind: 'gradient',
    value: 'linear-gradient(145deg, #eaf6ff 0%, #b9dff5 52%, #8aaec7 100%)',
  },
  {
    id: 'warm-sand',
    name: 'Warmer Sand',
    label: 'Warmer Sand',
    kind: 'gradient',
    value: 'linear-gradient(145deg, #fff8e8 0%, #ead7b5 52%, #c7a982 100%)',
  },
  {
    id: 'night-bloom',
    name: 'Nachtblüte',
    label: 'Nachtblüte',
    kind: 'gradient',
    value: 'linear-gradient(145deg, #172b35 0%, #294c55 52%, #3e6a62 100%)',
  },
];

export const CUSTOM_BACKGROUND_ID = 'custom-photo';

export function createCustomBackground(url: string, fileName: string): BackgroundOptions {
  return {
    id: CUSTOM_BACKGROUND_ID,
    name: fileName || 'Eigenes Foto',
    label: 'Eigenes Foto',
    kind: 'image',
    value: url,
    isCustom: true,
  };
}

export function getBackgroundCss(background: BackgroundOptions, fallback: string): string {
  if (!background.value) return fallback;
  if (background.kind === 'image') return `url("${background.value}")`;
  return background.value;
}

export default backgrounds;
