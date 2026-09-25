import {
  DesignElementComponent,
  DesignElementConfig,
} from '@minddrop/designs-next';
import { useElementProperty } from '../useElementProperty';
import { useElementValue } from '../useElementValue';

/**
 * Renders the text of the property the element maps to.
 */
const ValueElement: DesignElementComponent = ({ element }) => (
  <div>{useElementValue(element)}</div>
);

/**
 * Renders a button writing the element's content to the property
 * it maps to, and the validation of that content, 'valid' when it
 * passes.
 */
const EditElement: DesignElementComponent = ({ element }) => {
  const property = useElementProperty(element);

  // Read the element's content, empty when unset
  const content = element.content ?? '';

  return (
    <div>
      <button onClick={() => property?.updateValue?.(content)}>edit</button>
      <div data-testid="validation">
        {property?.validateValue?.(content) ?? 'valid'}
      </div>
    </div>
  );
};

// An element type rendering the value of the property it maps to.
// Stands in for the content elements.
export const elementConfig_value: DesignElementConfig = {
  type: 'value',
  label: 'designsNext.elements.text.label',
  icon: 'text',
  group: 'content',
  component: ValueElement,
  defaultColumnSpan: 12,
  defaultRowSpan: 4,
};

// An element type writing its content to the property it maps to
// when clicked. Stands in for the editable content elements.
export const elementConfig_edit: DesignElementConfig = {
  ...elementConfig_value,
  type: 'edit',
  component: EditElement,
};
