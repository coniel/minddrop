import { toKebabCase } from '../toKebabCase';

/**
 * Maps a component's props to class names.
 *
 * Boolean props are mapped as [key] if true, ignored if false.
 * String and number props are mapped as [key]-[value].
 * className prop is appended to the generated className.
 * rootClass is prepended to the generated className.
 * camelCase prop names are converted into kebab-case.
 */
export function mapPropsToClasses(
  props: Record<string, string | number | boolean | undefined>,
  rootClass: string = '',
): string {
  let className = rootClass;
  const { className: _, ...rest } = props;

  Object.entries(rest).forEach(([key, value]) => {
    if (value || value === 0) {
      if (typeof value === 'string' || typeof value === 'number') {
        className = `${className} ${key}-${value}`;
      } else {
        className = `${className} ${toKebabCase(key)}`;
      }
    }
  });

  if (props.className) {
    className = `${className} ${props.className}`;
  }

  return className.trim();
}
