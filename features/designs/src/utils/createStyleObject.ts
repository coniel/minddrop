import {
  DefaultDesignElementStyle,
  DesignElementStyle,
} from '@minddrop/designs';

/**
 * Creates the style object for a design element, merging the default style
 * with the provided style.
 *
 * @param style - The design element style.
 * @returns A complete style object.
 */
export function createStyleObject(style?: Partial<DesignElementStyle>) {
  return {
    ...DefaultDesignElementStyle,
    ...(style ?? {}),
  };
}
