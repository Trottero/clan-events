export interface Clan {
  displayName: string;
  name: string;
}

export function sanitizeClanName(name: string): string {
  // Remove all non-alphanumeric characters
  let safeName = name.replace(/[^a-zA-Z0-9 \-]/g, '');
  // Convert to lowercase
  safeName = safeName.toLowerCase();
  // Truncate to 30 characters
  safeName = safeName.substring(0, 30);
  // replace spaces with dashes
  safeName = safeName.replace(/\s/g, '-');
  return safeName;
}
