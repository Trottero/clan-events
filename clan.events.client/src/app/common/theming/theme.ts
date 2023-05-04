export enum Theme {
  Unknown = 'UNKNOWN',
  Light = 'LIGHT',
  Dark = 'DARK',
}

const stringToTheme = new Map<string, Theme>([
  ['UNKNOWN', Theme.Unknown],
  ['LIGHT', Theme.Light],
  ['DARK', Theme.Dark],
]);

export function themeFromString(theme: string): Theme {
  return stringToTheme.get(theme) ?? Theme.Unknown;
}
