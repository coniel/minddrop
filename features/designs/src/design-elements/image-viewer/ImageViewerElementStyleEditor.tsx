import {
  DefaultImageViewerElementStyle,
  ImageViewerElement,
} from '@minddrop/designs';
import { Stack } from '@minddrop/ui-primitives';
import { updateDesignElement, useElementData } from '../../DesignStudioStore';
import { Border } from '../../style-editors/Border';
import { BorderRadiusField } from '../../style-editors/BorderRadiusField';
import { CollapsibleSection } from '../../style-editors/CollapsibleSection';
import { MarginFields } from '../../style-editors/MarginFields';
import { OpacityField } from '../../style-editors/OpacityField';
import { PlaceholderImageField } from '../../style-editors/PlaceholderImageField';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { SizingFields } from '../../style-editors/SizingFields';
import { FlatImageViewerElement } from '../../types';

export interface ImageViewerElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

// Default values for the border collapsible section
const borderDefaults = {
  borderStyle: DefaultImageViewerElementStyle.borderStyle,
  borderColor: DefaultImageViewerElementStyle.borderColor,
  borderTopWidth: DefaultImageViewerElementStyle.borderTopWidth,
  borderRightWidth: DefaultImageViewerElementStyle.borderRightWidth,
  borderBottomWidth: DefaultImageViewerElementStyle.borderBottomWidth,
  borderLeftWidth: DefaultImageViewerElementStyle.borderLeftWidth,
} as const;

// Default values for the radius collapsible section
const radiusDefaults = {
  borderRadiusTopLeft: DefaultImageViewerElementStyle.borderRadiusTopLeft,
  borderRadiusTopRight: DefaultImageViewerElementStyle.borderRadiusTopRight,
  borderRadiusBottomRight:
    DefaultImageViewerElementStyle.borderRadiusBottomRight,
  borderRadiusBottomLeft: DefaultImageViewerElementStyle.borderRadiusBottomLeft,
} as const;

// Default values for the opacity collapsible section
const opacityDefaults = {
  opacity: DefaultImageViewerElementStyle.opacity,
} as const;

// Default values for the margin collapsible section
const marginDefaults = {
  'margin-top': DefaultImageViewerElementStyle['margin-top'],
  'margin-right': DefaultImageViewerElementStyle['margin-right'],
  'margin-bottom': DefaultImageViewerElementStyle['margin-bottom'],
  'margin-left': DefaultImageViewerElementStyle['margin-left'],
} as const;

/**
 * Renders the style editor for an image viewer element.
 * Provides controls for placeholder image, sizing, border,
 * opacity, and margin.
 */
export const ImageViewerElementStyleEditor: React.FC<
  ImageViewerElementStyleEditorProps
> = ({ elementId }) => {
  const { placeholderImage } = useElementData(
    elementId,
    (element: FlatImageViewerElement) => ({
      placeholderImage: element.placeholderImage,
    }),
  );

  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.image.placeholder.label" />
        <PlaceholderImageField
          image={placeholderImage || ''}
          onSelect={(fileName) =>
            updateDesignElement<ImageViewerElement>(elementId, {
              placeholderImage: fileName,
            })
          }
          onRemove={() =>
            updateDesignElement<ImageViewerElement>(elementId, {
              placeholderImage: '',
            })
          }
        />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.image.sizing.label" />
        <SizingFields elementId={elementId} />
      </Stack>

      <Border elementId={elementId} defaultStyles={borderDefaults} />

      <CollapsibleSection
        elementId={elementId}
        label="designs.border.radius.label"
        defaultStyles={radiusDefaults}
      >
        <BorderRadiusField elementId={elementId} />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.opacity.label"
        defaultStyles={opacityDefaults}
      >
        <OpacityField elementId={elementId} />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.typography.margin.label"
        defaultStyles={marginDefaults}
      >
        <MarginFields elementId={elementId} />
      </CollapsibleSection>
    </>
  );
};
