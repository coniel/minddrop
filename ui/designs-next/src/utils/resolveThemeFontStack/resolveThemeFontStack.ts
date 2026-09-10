// The stacks resolved so far, keyed by their custom property. The
// theme's fonts are static, so entries never go stale within a
// session.
const resolvedStacks = new Map<string, string>();

/**
 * Resolves a font family stack from the theme, reading the custom
 * property it is declared in. Properties are read once, subsequent
 * calls reading the stack back rather than the document's styles.
 *
 * @param customProperty - The custom property the stack is declared
 *   in, e.g. `--font-ui`.
 * @returns The font family stack, empty where it is not declared.
 */
export function resolveThemeFontStack(customProperty: string): string {
  // Read back the stack resolved on an earlier call
  const resolved = resolvedStacks.get(customProperty);

  if (resolved !== undefined) {
    return resolved;
  }

  // The themed element the properties are declared on, the theme
  // being a class on the body rather than the document.
  const themed = typeof document === 'undefined' ? null : document.body;

  if (!themed) {
    return '';
  }

  // The declared stack on a single line: properties are declared
  // across several lines, and the line breaks they come back with
  // keep the stack from parsing where it is used.
  const stack = getComputedStyle(themed)
    .getPropertyValue(customProperty)
    .replace(/\s+/g, ' ')
    .trim();

  // Hold off caching an undeclared property, so a stack declared
  // later is picked up.
  if (!stack) {
    return '';
  }

  resolvedStacks.set(customProperty, stack);

  return stack;
}
