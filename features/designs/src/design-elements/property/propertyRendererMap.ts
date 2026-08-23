import { PropertyElement } from '@minddrop/designs';
import { DatePropertyRenderer } from './DatePropertyRenderer';
import { NumberPropertyRenderer } from './NumberPropertyRenderer';
import { TextPropertyRenderer } from './TextPropertyRenderer';

/**
 * The components rendering each property element renderer key,
 * declared by the selected presentation variant's config. Contains
 * the cast from the narrowed element props to the union.
 */
export const propertyRendererMap: Record<
  string,
  React.ComponentType<{ element: PropertyElement }>
> = {
  text: TextPropertyRenderer as React.ComponentType<{
    element: PropertyElement;
  }>,
  number: NumberPropertyRenderer as React.ComponentType<{
    element: PropertyElement;
  }>,
  date: DatePropertyRenderer as React.ComponentType<{
    element: PropertyElement;
  }>,
};
