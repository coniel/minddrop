import { useCallback } from 'react';
import { DefaultImageElementStyle, ImageElement } from '@minddrop/designs';
import { Stack, SwitchField } from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  updateElementStyle,
  useElementData,
  useElementStyle,
} from '../../DesignStudioStore';
import { Border } from '../../style-editors/Border';
import { BorderRadiusField } from '../../style-editors/BorderRadiusField';
import { CollapsibleSection } from '../../style-editors/CollapsibleSection';
import { MarginFields } from '../../style-editors/MarginFields';
import { OpacityField } from '../../style-editors/OpacityField';
import { PlaceholderImageField } from '../../style-editors/PlaceholderImageField';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { SizingFields } from '../../style-editors/SizingFields';
import { StaticElementField } from '../../style-editors/StaticElementField';
import { FlatImageElement } from '../../types';
import { ObjectFitSelect } from './ObjectFitSelect';

export interface ImageElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

// Default values for the border collapsible section
const borderDefaults = {
  borderStyle: DefaultImageElementStyle.borderStyle,
  borderColor: DefaultImageElementStyle.borderColor,
  borderWidth: DefaultImageElementStyle.borderWidth,
} as const;

// Default values for the radius collapsible section
const radiusDefaults = {
  borderRadiusTopLeft: DefaultImageElementStyle.borderRadiusTopLeft,
  borderRadiusTopRight: DefaultImageElementStyle.borderRadiusTopRight,
  borderRadiusBottomRight: DefaultImageElementStyle.borderRadiusBottomRight,
  borderRadiusBottomLeft: DefaultImageElementStyle.borderRadiusBottomLeft,
  round: DefaultImageElementStyle.round,
} as const;

// Default values for the opacity collapsible section
const opacityDefaults = {
  opacity: DefaultImageElementStyle.opacity,
} as const;

// Default values for the margin collapsible section
const marginDefaults = {
  'margin-top': DefaultImageElementStyle['margin-top'],
  'margin-right': DefaultImageElementStyle['margin-right'],
  'margin-bottom': DefaultImageElementStyle['margin-bottom'],
  'margin-left': DefaultImageElementStyle['margin-left'],
} as const;

/**
 * Renders the style editor panel for image design elements.
 * Provides placeholder image, sizing, object fit, round, border,
 * opacity, and margin controls.
 */
export const ImageElementStyleEditor: React.FC<
  ImageElementStyleEditorProps
> = ({ elementId }) => {
  const width = useElementStyle(elementId, 'width');
  const height = useElementStyle(elementId, 'height');
  const round = useElementStyle(elementId, 'round');

  const { placeholderImage } = useElementData(
    elementId,
    (element: FlatImageElement) => ({
      placeholderImage: element.placeholderImage,
    }),
  );

  const handleRoundChange = useCallback(
    (checked: boolean) => {
      updateElementStyle(elementId, 'round', checked);

      if (checked) {
        // Switch width to px since round requires equal px dimensions
        updateElementStyle(elementId, 'widthUnit', 'px');

        // Use style values if set, otherwise fall back to rendered dimensions
        let effectiveWidth = width || 0;
        let effectiveHeight = height || 0;

        if (!effectiveWidth || !effectiveHeight) {
          const imageElement = document.querySelector(
            `[data-element-id="${elementId}"] img, [data-element-id="${elementId}"]`,
          ) as HTMLElement | null;

          if (imageElement) {
            if (!effectiveWidth) {
              effectiveWidth = imageElement.clientWidth;
            }

            if (!effectiveHeight) {
              effectiveHeight = imageElement.clientHeight;
            }
          }
        }

        // Set both dimensions to the smallest value
        const smallest =
          Math.min(effectiveWidth, effectiveHeight) ||
          effectiveWidth ||
          effectiveHeight;

        if (smallest) {
          updateElementStyle(elementId, 'width', smallest);
          updateElementStyle(elementId, 'height', smallest);
        }
      }
    },
    [elementId, width, height],
  );

  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.image.placeholder.label" />
        <PlaceholderImageField
          image={placeholderImage || ''}
          primary
          onSelect={(fileName) =>
            updateDesignElement<ImageElement>(elementId, {
              placeholderImage: fileName,
            })
          }
          onRemove={() =>
            updateDesignElement<ImageElement>(elementId, {
              placeholderImage: '',
            })
          }
        />
        <StaticElementField elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.image.sizing.label" />
        <SizingFields elementId={elementId} />
        <ObjectFitSelect
          elementId={elementId}
          label="designs.image.sizing.object-fit.label"
        />
      </Stack>

      <CollapsibleSection
        elementId={elementId}
        label="designs.border.label"
        defaultStyles={borderDefaults}
      >
        <Border elementId={elementId} />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.border.radius.label"
        defaultStyles={radiusDefaults}
      >
        <div
          style={{
            opacity: round ? 0.4 : undefined,
            pointerEvents: round ? 'none' : undefined,
          }}
        >
          <BorderRadiusField elementId={elementId} />
        </div>
        <SwitchField
          size="md"
          label="designs.image.round.label"
          checked={round}
          onCheckedChange={handleRoundChange}
        />
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
