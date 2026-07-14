/**
 * Theme derived from the design mockup. oklch colors from the mockup are
 * converted to their nearest hex here since React Native has no oklch support.
 */

export type Theme = {
  isDark: boolean;
  bg: string;
  surface: string;
  text: string;
  textDim: string;
  textFaint: string;
  border: string;
  teal: string;
  tealBg: string;
  tealText: string;
  coral: string;
  starOff: string;
  /** Text color that reads on top of the teal accent (CTA buttons). */
  onAccent: string;
  /** Text color on top of the pale avatar/group tints. */
  onTint: string;
};

export const darkTheme: Theme = {
  isDark: true,
  bg: '#0F1115',
  surface: '#171A21',
  text: '#ECECEE',
  textDim: '#8B909C',
  textFaint: '#5B606B',
  border: 'rgba(255,255,255,0.08)',
  teal: '#2FD4C0',
  tealBg: 'rgba(47,212,192,0.14)',
  tealText: '#8FE9DA',
  coral: '#FF8B6B',
  starOff: '#3A3F49',
  onAccent: '#0F1115',
  onTint: '#0F1115',
};

export const lightTheme: Theme = {
  isDark: false,
  bg: '#FBFAF7',
  surface: '#FFFFFF',
  text: '#1A1B1F',
  textDim: '#6B7078',
  textFaint: '#9297A0',
  border: 'rgba(0,0,0,0.08)',
  teal: '#0E9B87',
  tealBg: 'rgba(14,155,135,0.10)',
  tealText: '#0A7060',
  coral: '#D9553A',
  starOff: '#D8D6D0',
  onAccent: '#FFFFFF',
  onTint: '#0F1115',
};

export const pageBg = (isDark: boolean) => (isDark ? '#191B20' : '#EFEDE8');
