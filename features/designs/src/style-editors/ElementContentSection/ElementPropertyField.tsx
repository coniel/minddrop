import { TranslationKey } from '@minddrop/i18n';
import { SelectField, SelectOption } from '@minddrop/ui-primitives';
import {
  useDesignStudio,
  useDesignStudioStore,
  useElement,
} from '../../DesignStudioStore';
import {
  isPropertyCompatibleWithElement,
  isStaticContentElement,
} from '../../utils';

// Select value standing for no property binding
const NoProperty = 'none';

export interface ElementPropertyFieldProps {
  /**
   * The ID of the element to bind a design property to.
   */
  elementId: string;

  /**
   * The i18n key of the select's label. Omitted, the select is
   * rendered without one, for sections whose header already names
   * it.
   */
  label?: TranslationKey;
}

/**
 * Renders a select for binding the element to one of the design's
 * compatible properties. Role elements bind automatically on
 * insertion but stay rebindable here.
 */
export const ElementPropertyField: React.FC<ElementPropertyFieldProps> = ({
  elementId,
  label,
}) => {
  const studio = useDesignStudio();
  const properties = useDesignStudioStore((state) => {
    // Only database designs carry a property schema
    if (state.design?.type !== 'database') {
      return [];
    }

    return state.design.properties;
  });
  const element = useElement(elementId);

  // Bind the element to the selected property, or unbind it
  function handleValueChange(value: string | number) {
    if (value !== NoProperty) {
      studio.updateDesignElement(elementId, { property: String(value) });

      return;
    }

    // Replace the element outright, since a merge cannot unset
    // the binding
    const { property: _removed, ...unboundElement } = element;

    studio.setDesignElement(elementId, unboundElement);
  }

  // Static elements display their own content instead of a binding
  if (!element || isStaticContentElement(element)) {
    return null;
  }

  // The properties this element type can render
  const compatibleProperties = properties.filter((property) =>
    isPropertyCompatibleWithElement(property.type, element),
  );

  if (!compatibleProperties.length) {
    return null;
  }

  const options: SelectOption<string>[] = [
    { value: NoProperty, label: 'designs.property.none' },
    ...compatibleProperties.map((property) => ({
      value: property.name,
      stringLabel: property.name,
    })),
  ];

  return (
    <SelectField
      variant="subtle"
      size="md"
      label={label}
      labelSize="xs"
      value={element.property || NoProperty}
      onValueChange={handleValueChange}
      options={options}
    />
  );
};
