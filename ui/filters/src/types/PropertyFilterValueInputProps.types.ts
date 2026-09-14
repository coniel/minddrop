import { PropertyFilterOperator, PropertyFilterValue } from '@minddrop/filters';
import { PropertySchema } from '@minddrop/properties';

export interface PropertyFilterValueInputProps {
  /**
   * The schema of the filtered property.
   */
  property: PropertySchema;

  /**
   * The filter's comparison operator.
   */
  operator: PropertyFilterOperator | '';

  /**
   * The filter's current comparison value.
   */
  value?: PropertyFilterValue;

  /**
   * Callback fired with the new value.
   */
  onChange(value: PropertyFilterValue | undefined): void;
}
