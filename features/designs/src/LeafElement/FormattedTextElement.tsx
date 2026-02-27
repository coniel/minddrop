import { FormattedTextElement } from '@minddrop/designs';
import { MarkdownEditor } from '@minddrop/feature-markdown-editor';
import { FormattedTextPropertySchema } from '@minddrop/properties';

export interface DesignFormattedTextElementProps {
  /**
   * The text property element to render.
   */
  element: FormattedTextElement;

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

export const DesignFormattedTextElement: React.FC<
  DesignFormattedTextElementProps
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
