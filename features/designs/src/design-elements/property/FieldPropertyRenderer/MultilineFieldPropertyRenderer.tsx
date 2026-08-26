import { TextPropertyElement } from '@minddrop/designs';
import { useDesignPreview } from '../../../DesignElements';
import { useElementProperty } from '../../../DesignPropertiesProvider';
import { useElementCssStyle } from '../../../useElementCssStyle';
import { useElementPlaceholder } from '../../../useElementPlaceholder';
import { useFieldPropertyValue } from './useFieldPropertyValue';
import './FieldPropertyRenderer.css';

export interface MultilineFieldPropertyRendererProps {
  /**
   * The text property element to render.
   */
  element: TextPropertyElement;
}

/**
 * Editor renderer for a text property element rendered as a
 * multi-line text area. Edits stage locally and commit to the
 * bound property when the field is left; Escape reverts. In the
 * studio the field renders non-interactive, showing the element's
 * resolved placeholder as its hint text.
 */
export const MultilineFieldPropertyRenderer: React.FC<
  MultilineFieldPropertyRendererProps
> = ({ element }) => {
  // The studio renders the field as scenery rather than an editor
  const preview = useDesignPreview();
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);
  const css = useElementCssStyle(element);
  const field = useFieldPropertyValue(property);

  // Record the typed draft
  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    field.setDraft(event.target.value);
  }

  // Escape reverts the draft; Enter stays a line break
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Escape') {
      field.cancel();
    }
  }

  // Previews show the empty field with its placeholder hint
  if (preview) {
    return (
      <textarea
        className="designs-field-element designs-field-element-multiline"
        style={{ ...css, pointerEvents: 'none' }}
        placeholder={placeholder}
        rows={3}
        readOnly
        tabIndex={-1}
      />
    );
  }

  return (
    <textarea
      className="designs-field-element designs-field-element-multiline"
      style={css}
      value={field.value}
      rows={3}
      placeholder={property?.schema.placeholder ?? ''}
      readOnly={!property}
      onChange={handleChange}
      onBlur={field.commit}
      onKeyDown={handleKeyDown}
    />
  );
};
