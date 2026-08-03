import { CSSProperties, createContext } from 'react';

export interface TitleContextValue {
  /**
   * Translated validation error for the current title text.
   * Undefined when the title is valid.
   */
  titleError?: string;

  /**
   * Placeholder text shown when the title is empty. Falls back
   * to the localised untitled label when undefined.
   */
  titlePlaceholder?: string;

  /**
   * Inline styles applied to the title element.
   */
  titleStyle?: CSSProperties;
}

/**
 * Provides title validation state to the title element component.
 */
export const TitleContext = createContext<TitleContextValue>({});
