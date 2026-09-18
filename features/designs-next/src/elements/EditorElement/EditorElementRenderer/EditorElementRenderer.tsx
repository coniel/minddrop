import {
  DesignElementProps,
  DesignElementSettings,
  Designs,
} from '@minddrop/designs-next';
import { MarkdownEditor } from '@minddrop/feature-markdown-editor';
import {
  resolveElementStyle,
  useElementProperty,
  useElementValue,
} from '@minddrop/ui-designs-next';
import { ScrollArea } from '@minddrop/ui-primitives';
import { EditorElement } from '../EditorElement.types';
import { EditorTitleSlot } from '../EditorElementConfig';
import './EditorElementRenderer.css';

// The type a document is set in without settings of its own
const EditorDefaults: DesignElementSettings = {
  fontFamily: 'sans',
  fontSize: Designs.constants.DefaultFontSize,
  lineHeight: Designs.constants.DefaultLineHeight,
};

/**
 * Renders an editor element as its content property's document,
 * read only and set in the element's own text styles. The element
 * filling its title slot becomes the document's title.
 */
export const EditorElementRenderer: React.FC<
  DesignElementProps<EditorElement>
> = ({ element, childElements = [] }) => {
  // Read the property the element maps to
  const property = useElementProperty(element);

  // Read the element filling the title slot, absent while the slot
  // is empty.
  const titleElement = childElements.find(
    (child) => child.slot === EditorTitleSlot,
  );

  // Read the title from the property it maps to
  const titleValue = useElementValue(titleElement);

  // Read the document from the mapped content property
  const markdown =
    typeof property?.value === 'string' ? property.value : undefined;

  // Resolve the text settings into the styles they render as,
  // leaving out the padding, which the scroll area takes as a prop.
  const {
    fontFamily,
    fontSize,
    lineHeight,
    fontWeight,
    padding,
    ...inherited
  } = resolveElementStyle(element, EditorDefaults);

  // The editor declares its own typography, so those four reach the
  // document as custom properties; the rest it inherits.
  const style = {
    ...inherited,
    '--editor-font-family': fontFamily,
    '--editor-font-size': fontSize === undefined ? undefined : `${fontSize}px`,
    '--editor-line-height': lineHeight,
    '--editor-font-weight': fontWeight,
  } as React.CSSProperties;

  // Scroll a document past the block's height rather than clip it.
  // The padding lands on the scrolling box, so the document scrolls
  // all the way to the block's edges rather than stopping short.
  return (
    <ScrollArea
      className="design-editor-element"
      style={style}
      padding={element.padding}
    >
      {/** The editor takes its title on mount alone, so a changed
       * title remounts it **/}
      <MarkdownEditor
        key={titleElement ? `${titleElement.property}:${titleValue}` : 'none'}
        initialValue={markdown}
        title={titleElement && (titleValue ?? '')}
        titleStyle={titleElement && resolveElementStyle(titleElement)}
        readOnly
      />
    </ScrollArea>
  );
};
