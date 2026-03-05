import { useCallback } from 'react';
import { IconElement } from '@minddrop/designs';
import {
  Button,
  ColorSelect,
  ContentColor,
  ContentIcon,
  FlexItem,
  Group,
  IconPicker,
  InputLabel,
  NumberField,
  Stack,
  SwitchField,
} from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  updateElementStyle,
  useElementData,
  useElementStyle,
} from '../../DesignStudioStore';
import { MarginFields } from '../../style-editors/MarginFields';
import { OpacityField } from '../../style-editors/OpacityField';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { StaticElementField } from '../../style-editors/StaticElementField';
import { FlatIconElement } from '../../types';

export interface IconElementStyleEditorProps {
  elementId: string;
}

const transparentOption = {
  value: 'transparent',
  label: 'color.transparent',
  swatchClass: 'color-select-swatch-transparent',
};

export const IconElementStyleEditor: React.FC<IconElementStyleEditorProps> = ({
  elementId,
}) => {
  const size = useElementStyle(elementId, 'size');
  const color = useElementStyle(elementId, 'color') as string;
  const containerSize = useElementStyle(elementId, 'containerSize');
  const containerBackgroundColor = useElementStyle(
    elementId,
    'containerBackgroundColor',
  ) as string;
  const containerBorderRadius = useElementStyle(
    elementId,
    'containerBorderRadius',
  );
  const containerRound = useElementStyle(elementId, 'containerRound');

  // Get the current icon string from the element
  const { icon: iconString } = useElementData(
    elementId,
    (element: FlatIconElement) => ({
      icon: element.icon,
    }),
  );

  // Handles selecting an icon from the picker, syncing the
  // color from the icon string into the style color field
  const handleIconSelect = useCallback(
    (newIconString: string) => {
      updateDesignElement<IconElement>(elementId, { icon: newIconString });

      // Extract color from content-icon string (e.g. "content-icon:cat:cyan")
      const parts = newIconString.split(':');

      if (parts[0] === 'content-icon' && parts[2]) {
        updateElementStyle(elementId, 'color', parts[2]);
      }
    },
    [elementId],
  );

  // Handles clearing the icon
  const handleIconClear = useCallback(() => {
    updateDesignElement<IconElement>(elementId, { icon: '' });
  }, [elementId]);

  // Handles changing the icon size, clamping container size
  // up if the icon outgrows it
  const handleSizeChange = useCallback(
    (value: number | null) => {
      if (value !== null) {
        updateElementStyle(elementId, 'size', value);

        // Sync container size when it matches icon size or icon outgrows it
        if (
          containerSize > 0 &&
          (value > containerSize || containerSize === size)
        ) {
          updateElementStyle(elementId, 'containerSize', value);
        }
      }
    },
    [elementId, containerSize, size],
  );

  // Handles changing the icon color, syncing back into
  // the icon string for content icons
  const handleColorChange = useCallback(
    (value: ContentColor) => {
      updateElementStyle(elementId, 'color', value);

      // Update the color in the icon string if it's a content icon
      if (iconString) {
        const parts = iconString.split(':');

        if (parts[0] === 'content-icon' && parts.length >= 3) {
          parts[2] = value;
          updateDesignElement<IconElement>(elementId, {
            icon: parts.join(':'),
          });
        }
      }
    },
    [elementId, iconString],
  );

  // Handles changing the container size, clamped to icon size as minimum
  const handleContainerSizeChange = useCallback(
    (value: number | null) => {
      const clamped = value ? Math.max(value, size) : 0;
      updateElementStyle(elementId, 'containerSize', clamped);
    },
    [elementId, size],
  );

  // Handles changing the container background color
  const handleContainerBackgroundColorChange = useCallback(
    (value: ContentColor) => {
      updateElementStyle(elementId, 'containerBackgroundColor', value);
    },
    [elementId],
  );

  // Handles changing the container border radius
  const handleContainerBorderRadiusChange = useCallback(
    (value: number | null) => {
      updateElementStyle(elementId, 'containerBorderRadius', value ?? 0);
    },
    [elementId],
  );

  // Handles toggling container round
  const handleContainerRoundChange = useCallback(
    (checked: boolean) => {
      updateElementStyle(elementId, 'containerRound', checked);
    },
    [elementId],
  );

  return (
    <>
      {/* Icon selection */}
      <Stack gap={3}>
        <SectionLabel label="designs.icon.label" />
        <Stack gap={2} style={{ alignItems: 'center' }}>
          <div
            style={{
              ['--icon-size-default' as any]: '40px',
              fontSize: '40px',
              lineHeight: 1,
              display: 'inline-flex',
            }}
          >
            <ContentIcon
              icon={iconString?.replace(
                /content-icon:([^:]+):.*/,
                'content-icon:$1:default',
              )}
            />
          </div>
          <IconPicker
            currentIcon={iconString}
            onSelect={handleIconSelect}
            onClear={handleIconClear}
            closeOnSelect
          >
            <Button variant="subtle" size="sm" label="designs.icon.change" />
          </IconPicker>
        </Stack>
        <StaticElementField elementId={elementId} />
      </Stack>

      {/* Icon size and color */}
      <Stack gap={3}>
        <SectionLabel label="designs.icon.appearance.label" />
        <Group gap={2}>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel size="xs" label="designs.icon.size.label" />
              <NumberField
                variant="subtle"
                size="md"
                value={size}
                onValueChange={handleSizeChange}
                min={8}
                max={512}
                step={1}
                trailing="px"
              />
            </Stack>
          </FlexItem>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel size="xs" label="designs.icon.color.label" />
              <ColorSelect
                size="md"
                variant="subtle"
                value={color as ContentColor}
                onValueChange={handleColorChange}
              />
            </Stack>
          </FlexItem>
        </Group>
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.opacity.label" />
          <OpacityField elementId={elementId} />
        </Stack>
      </Stack>

      {/* Container */}
      <Stack gap={3}>
        <SectionLabel label="designs.icon.container.label" />
        <Group gap={2}>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel size="xs" label="designs.icon.container.size" />
              <NumberField
                variant="subtle"
                size="md"
                value={containerSize}
                onValueChange={handleContainerSizeChange}
                min={size}
                max={512}
                step={1}
                trailing="px"
              />
            </Stack>
          </FlexItem>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel
                size="xs"
                label="designs.icon.container.background-color"
              />
              <ColorSelect
                size="md"
                variant="subtle"
                value={containerBackgroundColor as ContentColor}
                valueColor={
                  containerBackgroundColor === 'transparent'
                    ? 'muted'
                    : 'regular'
                }
                onValueChange={handleContainerBackgroundColorChange}
                extraOptions={[transparentOption]}
              />
            </Stack>
          </FlexItem>
        </Group>
        <Group gap={2} style={{ alignItems: 'end' }}>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <Stack gap={1}>
              <InputLabel size="xs" label="designs.icon.container.radius" />
              <NumberField
                variant="subtle"
                size="md"
                value={containerBorderRadius}
                onValueChange={handleContainerBorderRadiusChange}
                min={0}
                max={999}
                step={1}
                trailing="px"
                disabled={containerRound}
              />
            </Stack>
          </FlexItem>
          <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
            <div
              className="text-input-size-md"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <SwitchField
                size="md"
                label="designs.icon.container.round"
                checked={containerRound}
                onCheckedChange={handleContainerRoundChange}
              />
            </div>
          </FlexItem>
        </Group>
      </Stack>

      {/* Margin */}
      <Stack gap={3}>
        <SectionLabel label="designs.typography.margin.label" />
        <MarginFields elementId={elementId} />
      </Stack>
    </>
  );
};
