/**
 * Converts a camelCase string to kebab-case.
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Maps a component's props to a className string, prefixing each
 * generated class with the root class name to avoid collisions.
 *
 * - Boolean props: added as `[root]-[prop]` when true, omitted when false
 * - String/number props: added as `[root]-[prop]-[value]`
 * - `className` prop: appended last
 * - camelCase keys are converted to kebab-case
 *
 * @example
 * propsToClass('button', { variant: 'ghost', size: 'md', active: true })
 * // → 'button button-variant-ghost button-size-md button-active'
 *
 * @example
 * propsToClass('text', { weight: 'bold', paragraph: true, disabled: false })
 * // → 'text text-weight-bold text-paragraph'
 */
export function propsToClass(
  rootClass: string,
  props: Record<string, string | number | boolean | undefined | null>,
): string {
  const { className, ...rest } = props;

  const classes = Object.entries(rest).reduce<string[]>((acc, [key, value]) => {
    if (value === undefined || value === null || value === false) return acc;

    const kebabKey = toKebabCase(key);

    if (typeof value === 'boolean') {
      acc.push(`${rootClass}-${kebabKey}`);
    } else {
      acc.push(`${rootClass}-${kebabKey}-${value}`);
    }

    return acc;
  }, []);

  return [rootClass, ...classes, className ?? '']
    .filter(Boolean)
    .join(' ')
    .trim();
}
