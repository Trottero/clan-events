export enum Theme {
  Unknown = 'UNKNOWN',
  Light = 'LIGHT',
  Dark = 'DARK',
}

const THEME_MAP = new Map<string, Theme>([
  ['UNKNOWN', Theme.Unknown],
  ['LIGHT', Theme.Light],
  ['DARK', Theme.Dark],
]);

export function themeFromString(theme: string): Theme {
  return THEME_MAP.get(theme) ?? Theme.Unknown;
}
