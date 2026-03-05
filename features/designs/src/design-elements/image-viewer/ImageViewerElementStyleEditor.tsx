import { ImageViewerElement } from '@minddrop/designs';
import { Stack } from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  useDesignStudioStore,
} from '../../DesignStudioStore';
import { Border } from '../../style-editors/Border';
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

/**
 * Renders the style editor for an image viewer element.
 * Provides controls for placeholder image, sizing, border,
 * opacity, and margin.
 */
export const ImageViewerElementStyleEditor: React.FC<
  ImageViewerElementStyleEditorProps
> = ({ elementId }) => {
  const placeholderImage = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatImageViewerElement)?.placeholderImage,
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

      <Stack gap={3}>
        <SectionLabel label="designs.border.label" />
        <Border elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.opacity.label" />
        <OpacityField elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.typography.margin.label" />
        <MarginFields elementId={elementId} />
      </Stack>
    </>
  );
};
