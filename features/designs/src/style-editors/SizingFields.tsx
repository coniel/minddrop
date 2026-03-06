import { useCallback, useRef, useState } from 'react';
import {
  FlexItem,
  Group,
  IconButton,
  InputLabel,
  NumberField,
  Stack,
} from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../DesignStudioStore';

export interface SizingFieldsProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders width, height, max-width, and max-height fields with
 * sync and unit toggle controls.
 */
export const SizingFields: React.FC<SizingFieldsProps> = ({ elementId }) => {
  const width = useElementStyle(elementId, 'width');
  const height = useElementStyle(elementId, 'height');
  const maxWidth = useElementStyle(elementId, 'maxWidth');
  const maxHeight = useElementStyle(elementId, 'maxHeight');
  const widthUnit = useElementStyle(elementId, 'widthUnit') || 'px';
  const maxWidthUnit = useElementStyle(elementId, 'maxWidthUnit') || 'px';

  const widthRef = useRef<HTMLDivElement>(null);
  const maxWidthRef = useRef<HTMLDivElement>(null);

  const [sizeSynced, setSizeSynced] = useState(false);
  const [maxSizeSynced, setMaxSizeSynced] = useState(false);

  // Handles width changes, syncing height if linked.
  // In % mode the field always displays 100 when unset, so
  // increment is disabled at max=100 and decrement goes to 99.
  const handleWidthChange = useCallback(
    (value: number | null) => {
      const resolved = value ?? 0;

      updateElementStyle(elementId, 'width', resolved);

      if (sizeSynced) {
        updateElementStyle(elementId, 'height', resolved);
      }
    },
    [elementId, sizeSynced],
  );

  // On blur, switch empty px width to % (displays as 100%)
  const handleWidthBlur = useCallback(() => {
    if (!width && widthUnit !== '%') {
      updateElementStyle(elementId, 'widthUnit', '%');
    }
  }, [elementId, width, widthUnit]);

  // Handles height changes, syncing width if linked.
  // When the field is empty and a stepper button is clicked,
  // jump to 200 instead of going from 0.
  const handleHeightChange = useCallback(
    (value: number | null) => {
      let resolved = value ?? 0;

      if (!height && value !== null) {
        resolved = 200;
      }

      updateElementStyle(elementId, 'height', resolved);

      if (sizeSynced) {
        updateElementStyle(elementId, 'width', resolved);
      }
    },
    [elementId, sizeSynced, height],
  );

  // Handles max-width changes, syncing max-height if linked
  const handleMaxWidthChange = useCallback(
    (value: number | null) => {
      const resolved = value ?? 0;

      updateElementStyle(elementId, 'maxWidth', resolved);

      if (maxSizeSynced) {
        updateElementStyle(elementId, 'maxHeight', resolved);
      }
    },
    [elementId, maxSizeSynced],
  );

  // On blur, switch empty px max-width to % (displays as 100%)
  const handleMaxWidthBlur = useCallback(() => {
    if (!maxWidth && maxWidthUnit !== '%') {
      updateElementStyle(elementId, 'maxWidthUnit', '%');
    }
  }, [elementId, maxWidth, maxWidthUnit]);

  // Handles max-height changes, syncing max-width if linked.
  // When empty, stepper jumps to 200 instead of going from 0.
  const handleMaxHeightChange = useCallback(
    (value: number | null) => {
      let resolved = value ?? 0;

      // Jump to 200 when the field is empty
      if (!maxHeight && value !== null) {
        resolved = 200;
      }

      updateElementStyle(elementId, 'maxHeight', resolved);

      if (maxSizeSynced) {
        updateElementStyle(elementId, 'maxWidth', resolved);
      }
    },
    [elementId, maxHeight, maxSizeSynced],
  );

  // Toggles size sync, switching width to px when syncing
  const handleToggleSizeSync = useCallback(() => {
    if (!sizeSynced) {
      // Switch width to px when syncing, since % height doesn't work
      if (widthUnit === '%') {
        updateElementStyle(elementId, 'widthUnit', 'px');
      }

      if (width) {
        updateElementStyle(elementId, 'height', width);
      }
    }

    setSizeSynced((current) => !current);
  }, [elementId, sizeSynced, width, widthUnit]);

  // Toggles max-size sync, switching max-width to px when syncing
  const handleToggleMaxSizeSync = useCallback(() => {
    if (!maxSizeSynced) {
      // Switch max-width to px when syncing, since % height doesn't work
      if (maxWidthUnit === '%') {
        updateElementStyle(elementId, 'maxWidthUnit', 'px');
      }

      if (maxWidth) {
        updateElementStyle(elementId, 'maxHeight', maxWidth);
      }
    }

    setMaxSizeSynced((current) => !current);
  }, [elementId, maxSizeSynced, maxWidth, maxWidthUnit]);

  // Toggles a sizing field between px and % units.
  // When switching to %, clamps value to 100.
  // When switching to px, matches the other field's px value if available.
  // Focuses the field after toggling.
  const toggleWidthUnit = useCallback(() => {
    const newUnit = widthUnit === 'px' ? '%' : 'px';

    updateElementStyle(elementId, 'widthUnit', newUnit);

    if (newUnit === '%' && width > 100) {
      updateElementStyle(elementId, 'width', 100);
    }

    // Use the element's rendered width when switching to px
    if (newUnit === 'px') {
      const element = document.querySelector(
        `[data-element-id="${elementId}"]`,
      ) as HTMLElement | null;

      if (element) {
        updateElementStyle(elementId, 'width', element.clientWidth);
      }
    }

    requestAnimationFrame(() => {
      widthRef.current?.querySelector('input')?.focus();
    });
  }, [elementId, width, widthUnit, maxWidth, maxWidthUnit]);

  const toggleMaxWidthUnit = useCallback(() => {
    const newUnit = maxWidthUnit === 'px' ? '%' : 'px';

    updateElementStyle(elementId, 'maxWidthUnit', newUnit);

    if (newUnit === '%' && maxWidth > 100) {
      updateElementStyle(elementId, 'maxWidth', 100);
    }

    // Use the element's rendered width when switching to px
    if (newUnit === 'px') {
      const element = document.querySelector(
        `[data-element-id="${elementId}"]`,
      ) as HTMLElement | null;

      if (element) {
        updateElementStyle(elementId, 'maxWidth', element.clientWidth);
      }
    }

    requestAnimationFrame(() => {
      maxWidthRef.current?.querySelector('input')?.focus();
    });
  }, [elementId, maxWidth, maxWidthUnit, width, widthUnit]);

  return (
    <>
      {/* Width / Height row */}
      <Group gap={1}>
        <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
          <Stack gap={1}>
            <InputLabel size="xs" label="designs.image.sizing.width" />
            <NumberField
              ref={widthRef}
              variant="subtle"
              size="md"
              value={widthUnit === '%' ? width || 100 : width || null}
              onValueChange={handleWidthChange}
              onBlur={handleWidthBlur}
              min={0}
              max={widthUnit === '%' ? 100 : undefined}
              step={1}
              trailing={widthUnit}
              clearable={widthUnit !== '%'}
              placeholder="designs.image.sizing.width-placeholder"
            />
          </Stack>
        </FlexItem>
        <IconButton
          icon="percent"
          label="designs.image.sizing.toggle-unit"
          variant="subtle"
          size="md"
          active={widthUnit === '%'}
          disabled={sizeSynced}
          onClick={toggleWidthUnit}
          style={{ alignSelf: 'flex-end' }}
        />
        <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
          <Stack gap={1}>
            <InputLabel size="xs" label="designs.image.sizing.height" />
            <NumberField
              variant="subtle"
              size="md"
              value={height || null}
              onValueChange={handleHeightChange}
              min={0}
              step={1}
              trailing={height ? 'px' : undefined}
              clearable
              placeholder="designs.image.sizing.height-placeholder"
            />
          </Stack>
        </FlexItem>
        <IconButton
          icon={sizeSynced ? 'link' : 'unlink'}
          label="designs.image.sizing.sync"
          variant="subtle"
          size="md"
          color={sizeSynced ? 'regular' : 'muted'}
          onClick={handleToggleSizeSync}
          style={{ alignSelf: 'flex-end' }}
        />
      </Group>

      {/* Max-width / Max-height row */}
      <Group gap={1}>
        <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
          <Stack gap={1}>
            <InputLabel size="xs" label="designs.image.sizing.max-width" />
            <NumberField
              ref={maxWidthRef}
              variant="subtle"
              size="md"
              value={maxWidthUnit === '%' ? maxWidth || 100 : maxWidth || null}
              onValueChange={handleMaxWidthChange}
              onBlur={handleMaxWidthBlur}
              min={0}
              max={maxWidthUnit === '%' ? 100 : undefined}
              step={1}
              trailing={maxWidthUnit}
              clearable={maxWidthUnit !== '%'}
              placeholder="designs.image.sizing.max-width-placeholder"
            />
          </Stack>
        </FlexItem>
        <IconButton
          icon="percent"
          label="designs.image.sizing.toggle-unit"
          variant="subtle"
          size="md"
          active={maxWidthUnit === '%'}
          disabled={maxSizeSynced}
          onClick={toggleMaxWidthUnit}
          style={{ alignSelf: 'flex-end' }}
        />
        <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
          <Stack gap={1}>
            <InputLabel size="xs" label="designs.image.sizing.max-height" />
            <NumberField
              variant="subtle"
              size="md"
              value={maxHeight || null}
              onValueChange={handleMaxHeightChange}
              min={0}
              step={1}
              trailing={maxHeight ? 'px' : undefined}
              clearable
              placeholder="designs.image.sizing.max-placeholder"
            />
          </Stack>
        </FlexItem>
        <IconButton
          icon={maxSizeSynced ? 'link' : 'unlink'}
          label="designs.image.sizing.sync"
          variant="subtle"
          size="md"
          color={maxSizeSynced ? 'regular' : 'muted'}
          onClick={handleToggleMaxSizeSync}
          style={{ alignSelf: 'flex-end' }}
        />
      </Group>
    </>
  );
};
