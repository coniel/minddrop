import { useCallback } from 'react';
import { InputLabel, Stack, SwitchField } from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  updateElementStyle,
  useDesignStudioStore,
  useElementStyle,
} from '../../../DesignStudioStore';
import { FlatImageElement } from '../../../types';
import { Border } from '../Border';
import { MarginFields } from '../MarginFields';
import { ObjectFitSelect } from '../ObjectFitSelect';
import { OpacityField } from '../OpacityField';
import { PlaceholderImageField } from '../PlaceholderImageField';
import { SectionLabel } from '../SectionLabel';
import { SizingFields } from '../SizingFields';
import { StaticElementField } from '../StaticElementField';

export interface ImageElementStyleEditorProps {
  elementId: string;
}

export const ImageElementStyleEditor: React.FC<
  ImageElementStyleEditorProps
> = ({ elementId }) => {
  const width = useElementStyle(elementId, 'width');
  const height = useElementStyle(elementId, 'height');
  const round = useElementStyle(elementId, 'round');

  const placeholderImage = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatImageElement)?.placeholderImage,
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
            updateDesignElement(elementId, { placeholderImage: fileName })
          }
          onRemove={() =>
            updateDesignElement(elementId, { placeholderImage: '' })
          }
        />
        <StaticElementField elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.image.sizing.label" />
        <SizingFields elementId={elementId} />
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.image.sizing.object-fit.label" />
          <ObjectFitSelect elementId={elementId} />
        </Stack>
        <SwitchField
          size="md"
          label="designs.image.round.label"
          checked={round}
          onCheckedChange={handleRoundChange}
        />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.border.label" />
        <Border elementId={elementId} disableRadius={round} />
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
