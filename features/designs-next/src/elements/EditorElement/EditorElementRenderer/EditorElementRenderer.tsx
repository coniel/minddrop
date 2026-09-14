import { DesignElementProps, Designs } from '@minddrop/designs-next';
import { MarkdownEditor } from '@minddrop/feature-markdown-editor';
import {
  resolveElementColor,
  resolveTextSettingsClass,
  useElementProperty,
} from '@minddrop/ui-designs-next';
import { ScrollArea, joinClasses } from '@minddrop/ui-primitives';
import { EditorElement } from '../EditorElement.types';
import './EditorElementRenderer.css';

/**
 * Renders an editor element as its content property's document,
 * read only and set in the element's own text styles.
 */
export const EditorElementRenderer: React.FC<
  DesignElementProps<EditorElement>
> = ({ element }) => {
  // Read the property the element maps to
  const property = useElementProperty(element);

  // Read the document from the mapped content property
  const markdown =
    typeof property?.value === 'string' ? property.value : undefined;

  // Resolve the text settings into modifier classes
  const className = joinClasses(
    'design-editor-element',
    resolveTextSettingsClass(element),
  );

  // Apply the text settings as the editor's styling
  const style = {
    '--editor-font-size': `${
      element.fontSize ?? Designs.constants.DefaultFontSize
    }px`,
    '--editor-line-height': `${
      element.lineHeight ?? Designs.constants.DefaultLineHeight
    }`,
    '--editor-font-weight': element.fontWeight
      ? String(element.fontWeight)
      : undefined,
    color: resolveElementColor(element.textColor),
  } as React.CSSProperties;

  // Scroll a document past the block's height rather than clip it
  return (
    <ScrollArea className={className} style={style}>
      <MarkdownEditor initialValue={markdown} readOnly />
    </ScrollArea>
  );
};
