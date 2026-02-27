import { FormattedTextPropertyElement } from '@minddrop/designs';
import { MarkdownEditor } from '@minddrop/feature-markdown-editor';
import { FormattedTextPropertySchema } from '@minddrop/properties';

export interface DesignFormattedTextPropertyElementProps {
  /**
   * The text property element to render.
   */
  element: FormattedTextPropertyElement;

  /**
   * The schema of the text property.
   */
  propertySchema: FormattedTextPropertySchema;

  /**
   * Callback fired when value is edited.
   */
  onValueChange: (value: string) => void;

  /**
   * The value of the text property.
   */
  propertyValue?: string;
}

export const DesignFormattedTextPropertyElement: React.FC<
  DesignFormattedTextPropertyElementProps
> = ({ onValueChange, propertyValue }) => {
  return (
    <div className="design-formatted-text-element">
      <MarkdownEditor
        initialValue={propertyValue}
        onDebouncedChange={onValueChange}
      />
    </div>
  );
};
