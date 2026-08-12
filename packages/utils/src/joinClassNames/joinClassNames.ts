/**
 * Combines class names into a single class attribute value,
 * ignoring absent ones.
 *
 * @param classNames - The class names to combine.
 * @returns The combined class names, or undefined if there are none.
 */
export function joinClassNames(
  ...classNames: (string | false | null | undefined)[]
): string | undefined {
  const present = classNames.filter(Boolean);

  // Undefined rather than an empty string, so that the class
  // attribute is left off entirely
  if (!present.length) {
    return undefined;
  }

  return present.join(' ');
}
