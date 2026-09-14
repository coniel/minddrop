import { Filters, PropertyFilterOperator } from '@minddrop/filters';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import { PropertySchema } from '@minddrop/properties';
import { Select } from '@minddrop/ui-primitives';

export interface PropertyFilterOperatorSelectProps {
  /**
   * The schema of the filtered property. Decides the selectable
   * operators.
   */
  property: PropertySchema;

  /**
   * The selected operator.
   */
  value: PropertyFilterOperator | '';

  /**
   * Callback fired with the picked operator.
   */
  onValueChange(operator: PropertyFilterOperator): void;
}

// Builds operator label translation keys
const operatorI18nKey = createI18nKeyBuilder('filters.operators.');

/**
 * Renders a select of the comparison operators available for a
 * property.
 */
export const PropertyFilterOperatorSelect: React.FC<
  PropertyFilterOperatorSelectProps
> = ({ property, value, onValueChange }) => {
  // Build the options from the property's operators
  const options = Filters.resolveOperators(property).map((operator) => ({
    label: operatorI18nKey(operator),
    value: operator,
  }));

  return (
    <Select<PropertyFilterOperator>
      placeholder="filters.fields.operator"
      options={options}
      value={value || undefined}
      onValueChange={onValueChange}
    />
  );
};
