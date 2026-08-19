import { TextElement } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { DesignText } from '../../DesignText';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholder } from '../../useElementPlaceholder';

export interface TextDesignElementProps {
  /**
   * The text element to render.
   */
  element: TextElement;
}

/**
 * Display renderer for a text design element.
 * Shows the bound property value when available,
 * otherwise falls back to the resolved placeholder text.
 */
export const TextDesignElement: React.FC<TextDesignElementProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);

  // Use the bound property value if available, otherwise the placeholder
  const displayText =
    property?.value != null ? String(property.value) : placeholder;

  return <DesignText text={displayText} css={useElementCssStyle(element)} />;
};
