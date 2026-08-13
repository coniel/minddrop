import { PropertyType } from '@minddrop/properties';
import { SelectField, SelectOption, Text } from '@minddrop/ui-primitives';
import {
  setDesignElement,
  updateDesignElement,
  useDesignStudioStore,
  useElement,
} from '../../DesignStudioStore';

// Select value representing no title binding
const NO_PROPERTY = 'none';

// Design property types which can be bound as the editor's title
const TITLE_COMPATIBLE_PROPERTY_TYPES: PropertyType[] = ['title', 'text'];

export interface ElementTitlePropertyFieldProps {
  /**
   * The ID of the editor element to bind a title property to.
   */
  elementId: string;
}

/**
 * Renders a select field for binding one of the open design's
 * title or text properties as the editor element's title.
 */
export const ElementTitlePropertyField: React.FC<
  ElementTitlePropertyFieldProps
> = ({ elementId }) => {
  const design = useDesignStudioStore((state) => state.design);
  const element = useElement(elementId);

  // Bind the selected design property as the title, or unbind it
  // when the "none" option is selected (via outright element
  // replacement, since the update merge cannot unset a field)
  function handleValueChange(value: string | number) {
    if (value === NO_PROPERTY) {
      if (!element || element.type !== 'editor') {
        return;
      }

      const { titleProperty: _removed, ...unboundElement } = element;

      setDesignElement(elementId, unboundElement);

      return;
    }

    updateDesignElement(elementId, { titleProperty: String(value) });
  }

  if (!design || !element || element.type !== 'editor') {
    return null;
  }

  // Design properties which can be bound as the title
  const compatibleProperties = design.properties.filter((property) =>
    TITLE_COMPATIBLE_PROPERTY_TYPES.includes(property.type),
  );

  if (!compatibleProperties.length) {
    return (
      <Text
        block
        size="sm"
        color="muted"
        text="designs.property.noCompatible"
      />
    );
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
      value={element.titleProperty || NO_PROPERTY}
      onValueChange={handleValueChange}
      options={options}
    />
  );
};
