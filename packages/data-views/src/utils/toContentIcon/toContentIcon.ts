/**
 * Returns the stringified default content icon of an icon name, used
 * to give a data view an icon of the kind the user can later change.
 *
 * @param iconName - The name of the icon.
 * @returns The stringified content icon.
 */
export function toContentIcon(iconName: string): string {
  return `content-icon:${iconName}:default`;
}
