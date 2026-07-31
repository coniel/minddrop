import { ElementEmptyBehavior } from '@minddrop/designs';
import { RadioField, RadioGroup } from '@minddrop/ui-primitives';
import { updateDesignElement, useElement } from '../DesignStudioStore';

export interface ElementEmptyBehaviorFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a radio group choosing how the element behaves in a
 * rendered entry when its bound property has no value: hide the
 * element or show its placeholder.
 */
export const ElementEmptyBehaviorField: React.FC<
  ElementEmptyBehaviorFieldProps
> = ({ elementId }) => {
  const element = useElement(elementId);

  // Update the element's empty behavior
  function handleValueChange(value: string) {
    updateDesignElement(elementId, {
      emptyBehavior: value as ElementEmptyBehavior,
    });
  }

  if (!element) {
    return null;
  }

  const value = element.emptyBehavior ?? 'hide';

  return (
    <RadioGroup
      value={value}
      onValueChange={handleValueChange}
      label="designs.content.emptyBehavior.label"
    >
      <RadioField
        value="placeholder"
        label="designs.content.emptyBehavior.placeholder"
      />
      <RadioField value="hide" label="designs.content.emptyBehavior.hide" />
    </RadioGroup>
  );
};
