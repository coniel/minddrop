import { toKebabCase } from '../toKebabCase';

/**
 * Maps a component's props to class names.
 *
 * Boolean props are mapped as [key] if true, ignored if false.
 * String props are mapped as [key]-[value].
 * className prop is appended to the generated className.
 * rootClass is prepended to the generated className.
 * camelCase prop names are converted into kebab-case.
 */
export function mapPropsToClasses(
  props: Record<string, string | boolean>,
  rootClass: string = '',
): string {
  let className = rootClass;

  Object.keys(props).forEach((key) => {
    if (props[key] && key !== 'className') {
      if (typeof props[key] === 'string') {
        className = `${className} ${key}-${props[key]}`;
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
