import { SelectField, SelectOption } from '@minddrop/ui-primitives';
import {
  setDesignElement,
  updateDesignElement,
  useDesignStudioStore,
  useElement,
} from '../DesignStudioStore';
import { isPropertyCompatibleWithElement } from '../utils';

// Select value representing no property binding
const NO_PROPERTY = 'none';

export interface ElementPropertyFieldProps {
  /**
   * The ID of the element to bind a design property to.
   */
  elementId: string;
}

/**
 * Renders a select field for binding the element to one of the
 * open design's compatible properties.
 */
export const ElementPropertyField: React.FC<ElementPropertyFieldProps> = ({
  elementId,
}) => {
  const design = useDesignStudioStore((state) => state.design);
  const element = useElement(elementId);

  // Bind the element to the selected design property, or unbind
  // it when the "none" option is selected (via outright element
  // replacement, since the update merge cannot unset a field)
  function handleValueChange(value: string | number) {
    if (value === NO_PROPERTY) {
      if (!element) {
        return;
      }

      const { property: _removed, ...unboundElement } = element;

      setDesignElement(elementId, unboundElement);

      return;
    }

    updateDesignElement(elementId, { property: String(value) });
  }

  if (!design || !element || element.static) {
    return null;
  }

  // Design properties the element can render
  const compatibleProperties = design.properties.filter((property) =>
    isPropertyCompatibleWithElement(property.type, element),
  );

  if (!compatibleProperties.length) {
    return null;
  }

  const options: SelectOption<string>[] = [
    { value: NO_PROPERTY, label: 'designs.property.none' },
    ...compatibleProperties.map((property) => ({
      value: property.name,
      stringLabel: property.name,
    })),
  ];

  return (
    <SelectField
      variant="subtle"
      size="md"
      label="designs.property.label"
      value={element.property || NO_PROPERTY}
      onValueChange={handleValueChange}
      options={options}
    />
  );
};
