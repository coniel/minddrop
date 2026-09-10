// Fallback ratio for a line height a browser reports as `normal`,
// which carries no pixel value to measure with.
const NormalLineHeightRatio = 1.5;

/**
 * Resolves the height a textarea takes to hold its content, floored
 * at the height its rows ask for and capped at a number of lines.
 *
 * Measures the element, so it reads the height the element has right
 * now: reset the inline height before calling it.
 *
 * @param element - The measured textarea.
 * @param maxRows - The most lines the height covers.
 * @returns The height in pixels.
 */
export function resolveGrownHeight(
  element: HTMLTextAreaElement,
  maxRows: number,
): number {
  const styles = window.getComputedStyle(element);
  const lineHeight = resolveLineHeight(styles);

  // The padding is inside both measured heights, so the cap carries
  // it too.
  const padding =
    parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  const maxHeight = lineHeight * maxRows + padding;

  // The rows attribute sets the floor, the content the desired
  // height.
  const height = Math.max(element.scrollHeight, element.clientHeight);

  return Math.min(height, maxHeight);
}

/**
 * Resolves an element's line height in pixels.
 *
 * @param styles - The element's computed styles.
 * @returns The line height in pixels.
 */
function resolveLineHeight(styles: CSSStyleDeclaration): number {
  const lineHeight = parseFloat(styles.lineHeight);

  if (Number.isNaN(lineHeight)) {
    return parseFloat(styles.fontSize) * NormalLineHeightRatio;
  }

  return lineHeight;
}
