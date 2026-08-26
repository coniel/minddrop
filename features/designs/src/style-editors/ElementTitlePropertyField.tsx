import { PropertyType } from '@minddrop/properties';
import { SelectField, SelectOption, Text } from '@minddrop/ui-primitives';
import {
  useDesignStudio,
  useDesignStudioStore,
  useElement,
} from '../DesignStudioStore';

// Select value standing for no title binding
const NoProperty = 'none';

/**
 * Design property types which can be bound as the editor's title.
 */
export const TitleCompatiblePropertyTypes: PropertyType[] = ['title', 'text'];

export interface ElementTitlePropertyFieldProps {
  /**
   * The ID of the element to bind a title property to.
   */
  elementId: string;
}

/**
 * Renders a select for binding one of the design's title or text
 * properties as the element's editor title block.
 */
export const ElementTitlePropertyField: React.FC<
  ElementTitlePropertyFieldProps
> = ({ elementId }) => {
  const studio = useDesignStudio();
  const properties = useDesignStudioStore((state) => {
    // Only database designs carry a property schema
    if (state.design?.type !== 'database') {
      return [];
    }

    return state.design.properties;
  });
  const element = useElement(elementId);

  // Bind the selected property as the title, or unbind it
  function handleValueChange(value: string | number) {
    if (value !== NoProperty) {
      studio.updateDesignElement(elementId, { titleProperty: String(value) });

      return;
    }

    // Nothing to unbind on elements without a title block
    if (!element || !('titleProperty' in element)) {
      return;
    }

    // Replace the element outright, since a merge cannot unset
    // the binding
    const { titleProperty: _removed, ...unboundElement } = element;

    studio.setDesignElement(elementId, unboundElement);
  }

  // Only formatted text property elements carry a title block
  if (
    !element ||
    element.type !== 'property' ||
    element.propertyType !== 'formatted-text'
  ) {
    return null;
  }

  // The properties which can be bound as the title
  const compatibleProperties = properties.filter((property) =>
    TitleCompatiblePropertyTypes.includes(property.type),
  );

  // Without a bindable property there is nothing to offer
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
      label="designs.property.label"
      labelSize="xs"
      value={element.titleProperty || NoProperty}
      onValueChange={handleValueChange}
      options={options}
    />
  );
};
