export type WindowSizeSlot = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Returns a size slot based on the current window width.
 *
 * Slots map to common display resolution ranges so that
 * persisted UI dimensions stay sensible across monitors.
 *
 * | Slot | Width range |
 * |------|-------------|
 * | xs   | < 1024      |
 * | sm   | 1024–1919   |
 * | md   | 1920–2559   |
 * | lg   | 2560–3839   |
 * | xl   | >= 3840     |
 */
export function getWindowSizeSlot(): WindowSizeSlot {
  const width = window.innerWidth;

  if (width < 1024) {
    return 'xs';
  }

  if (width < 1920) {
    return 'sm';
  }

  if (width < 2560) {
    return 'md';
  }

  if (width < 3840) {
    return 'lg';
  }

  return 'xl';
}
