import { DefaultEditorElementStyle } from '@minddrop/designs-legacy';
import { InputLabel, Stack } from '@minddrop/ui-primitives';
import {
  getDesignElement,
  setDesignElement,
  updateDesignElement,
  useDesignStudioStore,
  useElement,
} from '../../DesignStudioStore';
import { CollapsibleSection } from '../../style-editors/CollapsibleSection';
import { StyleKeyScope } from '../../style-editors/StyleKeyScope';
import { Typography } from '../../style-editors/Typography';
import { ElementTitlePropertyField } from './ElementTitlePropertyField';

// Default values for the title collapsible section
const titleDefaults = {
  'title-font-family': DefaultEditorElementStyle['title-font-family'],
  'title-font-weight': DefaultEditorElementStyle['title-font-weight'],
  'title-font-size': DefaultEditorElementStyle['title-font-size'],
  'title-line-height': DefaultEditorElementStyle['title-line-height'],
  'title-letter-spacing': DefaultEditorElementStyle['title-letter-spacing'],
  'title-underline': DefaultEditorElementStyle['title-underline'],
  'title-italic': DefaultEditorElementStyle['title-italic'],
  'title-color': DefaultEditorElementStyle['title-color'],
  'title-opacity': DefaultEditorElementStyle['title-opacity'],
  'title-text-align': DefaultEditorElementStyle['title-text-align'],
  'title-margin-bottom': DefaultEditorElementStyle['title-margin-bottom'],
} as const;

export interface EditorTitleSectionProps {
  /**
   * The ID of the editor element to edit.
   */
  elementId: string;
}

/**
 * Renders the collapsible Title section of the editor element's
 * style editor: a title property select followed by title
 * typography controls. Opening the section binds the design's
 * title property by default.
 */
export const EditorTitleSection: React.FC<EditorTitleSectionProps> = ({
  elementId,
}) => {
  const design = useDesignStudioStore((state) => state.design);
  const element = useElement(elementId);

  // Whether the element has a bound title property
  const hasTitleBinding =
    element?.type === 'editor' && Boolean(element.titleProperty);

  // Bind a default title property when the section is opened
  // without a binding
  function handleOpen() {
    const currentElement = getDesignElement(elementId);

    // Leave existing bindings untouched
    if (currentElement?.type !== 'editor' || currentElement.titleProperty) {
      return;
    }

    // Prefer the design's title property, falling back to the
    // first text property
    const defaultProperty =
      design?.properties.find((property) => property.type === 'title') ||
      design?.properties.find((property) => property.type === 'text');

    if (defaultProperty) {
      updateDesignElement(elementId, { titleProperty: defaultProperty.name });
    }
  }

  // Unbind the title property when the section's custom styling
  // is cleared (via element replacement, since the update merge
  // cannot unset a field)
  function handleClearTitle() {
    const currentElement = getDesignElement(elementId);

    if (currentElement?.type !== 'editor' || !currentElement.titleProperty) {
      return;
    }

    const { titleProperty: _removed, ...unboundElement } = currentElement;

    setDesignElement(elementId, unboundElement);
  }

  if (!element || element.type !== 'editor') {
    return null;
  }

  return (
    <CollapsibleSection
      elementId={elementId}
      label="designs.title.label"
      defaultStyles={titleDefaults}
      hasCustomValues={hasTitleBinding}
      onOpen={handleOpen}
      onClear={handleClearTitle}
    >
      <ElementTitlePropertyField elementId={elementId} />
      <Stack gap={1}>
        <InputLabel size="xs" label="designs.typography.label" />
        <StyleKeyScope scope="title">
          <Typography
            elementId={elementId}
            hideTextTransform
            hideMaxWidth
            showMarginBottom
          />
        </StyleKeyScope>
      </Stack>
    </CollapsibleSection>
  );
};
