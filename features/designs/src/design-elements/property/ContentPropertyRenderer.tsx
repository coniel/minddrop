import { ContentPropertyElement } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholder } from '../../useElementPlaceholder';

export interface ContentPropertyRendererProps {
  /**
   * The content property element to render.
   */
  element: ContentPropertyElement;
}

/**
 * Display renderer for a content property element. Shows
 * the bound property value as static text when available,
 * otherwise falls back to the resolved placeholder text.
 */
export const ContentPropertyRenderer: React.FC<
  ContentPropertyRendererProps
> = ({ element }) => {
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);

  // Use the bound property value if available, otherwise the placeholder
  const displayText =
    property?.value != null ? String(property.value) : placeholder;

  return <div style={useElementCssStyle(element)}>{displayText}</div>;
};
