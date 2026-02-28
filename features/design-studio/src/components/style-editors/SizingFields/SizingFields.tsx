import { useCallback, useState } from 'react';
import { SizeUnit } from '@minddrop/designs';
import {
  FlexItem,
  Group,
  IconButton,
  InputLabel,
  NumberField,
  Stack,
} from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface SizingFieldsProps {
  elementId: string;
}

export const SizingFields: React.FC<SizingFieldsProps> = ({ elementId }) => {
  const width = useElementStyle(elementId, 'width');
  const height = useElementStyle(elementId, 'height');
  const maxWidth = useElementStyle(elementId, 'maxWidth');
  const maxHeight = useElementStyle(elementId, 'maxHeight');
  const widthUnit = useElementStyle(elementId, 'widthUnit') || 'px';
  const maxWidthUnit = useElementStyle(elementId, 'maxWidthUnit') || 'px';

  const [sizeSynced, setSizeSynced] = useState(false);
  const [maxSizeSynced, setMaxSizeSynced] = useState(false);

  // Handles width changes, syncing height if linked
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

  // Handles height changes, syncing width if linked
  const handleHeightChange = useCallback(
    (value: number | null) => {
      const resolved = value ?? 0;

      updateElementStyle(elementId, 'height', resolved);

      if (sizeSynced) {
        updateElementStyle(elementId, 'width', resolved);
      }
    },
    [elementId, sizeSynced],
  );

  // Resolves a max-size value, defaulting to 150 when incrementing from empty
  const resolveMaxSize = useCallback(
    (value: number | null, current: number): number => {
      if (value === null) {
        return 0;
      }

      if (!current && value === 1) {
        return 150;
      }

      return value;
    },
    [],
  );

  // Handles max-width changes, syncing max-height if linked
  const handleMaxWidthChange = useCallback(
    (value: number | null) => {
      const resolved = resolveMaxSize(value, maxWidth);

      updateElementStyle(elementId, 'maxWidth', resolved);

      if (maxSizeSynced) {
        updateElementStyle(elementId, 'maxHeight', resolved);
      }
    },
    [elementId, maxWidth, maxSizeSynced, resolveMaxSize],
  );

  // Handles max-height changes, syncing max-width if linked
  const handleMaxHeightChange = useCallback(
    (value: number | null) => {
      const resolved = resolveMaxSize(value, maxHeight);

      updateElementStyle(elementId, 'maxHeight', resolved);

      if (maxSizeSynced) {
        updateElementStyle(elementId, 'maxWidth', resolved);
      }
    },
    [elementId, maxHeight, maxSizeSynced, resolveMaxSize],
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

  // Toggles a sizing field between px and % units, clamping to 100 when
  // switching to % if the current value exceeds 100
  const toggleUnit = useCallback(
    (
      unitField: 'widthUnit' | 'maxWidthUnit',
      valueField: 'width' | 'maxWidth',
      currentUnit: SizeUnit,
      currentValue: number,
    ) => {
      const newUnit = currentUnit === 'px' ? '%' : 'px';

      updateElementStyle(elementId, unitField, newUnit);

      // Clamp value to 100 when switching to %
      if (newUnit === '%' && currentValue > 100) {
        updateElementStyle(elementId, valueField, 100);
      }
    },
    [elementId],
  );

  return (
    <>
      {/* Width / Height row */}
      <Group gap={1}>
        <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
          <Stack gap={1}>
            <InputLabel size="xs" label="designs.image.sizing.width" />
            <NumberField
              variant="subtle"
              size="md"
              value={width || null}
              onValueChange={handleWidthChange}
              min={0}
              max={widthUnit === '%' ? 100 : undefined}
              step={1}
              trailing={widthUnit}
              clearable
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
          onClick={() => toggleUnit('widthUnit', 'width', widthUnit, width)}
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
              variant="subtle"
              size="md"
              value={maxWidth || null}
              onValueChange={handleMaxWidthChange}
              min={0}
              max={maxWidthUnit === '%' ? 100 : undefined}
              step={1}
              trailing={maxWidth ? maxWidthUnit : undefined}
              clearable
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
          onClick={() =>
            toggleUnit('maxWidthUnit', 'maxWidth', maxWidthUnit, maxWidth)
          }
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
