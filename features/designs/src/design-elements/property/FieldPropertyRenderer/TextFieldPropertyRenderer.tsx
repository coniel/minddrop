import { TextPropertyElement } from '@minddrop/designs';
import { useDesignPreview } from '../../../DesignElements';
import { useElementProperty } from '../../../DesignPropertiesProvider';
import { useElementCssStyle } from '../../../useElementCssStyle';
import { useElementPlaceholder } from '../../../useElementPlaceholder';
import { useFieldPropertyValue } from './useFieldPropertyValue';
import './FieldPropertyRenderer.css';

export interface TextFieldPropertyRendererProps {
  /**
   * The text property element to render.
   */
  element: TextPropertyElement;
}

/**
 * Editor renderer for a text property element rendered as a
 * single-line input. Edits stage locally and commit to the bound
 * property when the field is left; Enter commits, Escape reverts.
 * In the studio the field renders non-interactive, showing the
 * element's resolved placeholder as its hint text.
 */
export const TextFieldPropertyRenderer: React.FC<
  TextFieldPropertyRendererProps
> = ({ element }) => {
  // The studio renders the field as scenery rather than an editor
  const preview = useDesignPreview();
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);
  const css = useElementCssStyle(element);
  const field = useFieldPropertyValue(property);

  // Record the typed draft
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    field.setDraft(event.target.value);
  }

  // Enter commits by leaving the field, Escape reverts the draft
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }

    if (event.key === 'Escape') {
      field.cancel();
    }
  }

  // Previews show the empty field with its placeholder hint
  if (preview) {
    return (
      <input
        className="designs-field-element"
        style={{ ...css, pointerEvents: 'none' }}
        placeholder={placeholder}
        readOnly
        tabIndex={-1}
      />
    );
  }

  return (
    <input
      className="designs-field-element"
      style={css}
      value={field.value}
      placeholder={property?.schema.placeholder ?? ''}
      readOnly={!property}
      onChange={handleChange}
      onBlur={field.commit}
      onKeyDown={handleKeyDown}
    />
  );
};
