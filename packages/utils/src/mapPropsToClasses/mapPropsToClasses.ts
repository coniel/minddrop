/**
 * Maps a component's props to class names.
 *
 * Boolean props are mapped as [key] if true, ignored if false.
 * String props are mapped as [value].
 * className prop is appended to the generated className.
 * rootClass is prepended to the generated className.
 */
export function mapPropsToClasses(
  props: Record<string, string | boolean>,
  rootClass: string = '',
): string {
  let className = rootClass;

  Object.keys(props).forEach((key) => {
    if (props[key] && key !== 'className') {
      if (typeof props[key] === 'string') {
        className = `${className} ${props[key]}`;
      } else {
        className = `${className} ${key}`;
      }
    }
  });

  if (props.className) {
    className = `${className} ${props.className}`;
  }

  return className.trim();
}
