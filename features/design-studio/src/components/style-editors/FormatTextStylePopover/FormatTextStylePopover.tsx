import { useCallback } from 'react';
import {
  FontFamily,
  FontWeight,
  TextElementStyle,
  fontWeights,
  fonts,
} from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { ContentColor } from '@minddrop/theme';
import {
  Button,
  ColorSelect,
  FlexItem,
  Group,
  IconButton,
  InputLabel,
  NumberField,
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
  Select,
  SelectItem,
  Stack,
} from '@minddrop/ui-primitives';
import {
  saveDesign,
  updateDesignElement,
  useDesignStudioStore,
} from '../../../DesignStudioStore';
import { FlatNumberElement } from '../../../types';

export interface FormatTextStylePopoverProps {
  elementId: string;
  styleKey: 'prefixStyle' | 'suffixStyle';
  label: string;
}

export const FormatTextStylePopover = ({
  elementId,
  styleKey,
  label,
}: FormatTextStylePopoverProps) => {
  const { t } = useTranslation();

  const element = useDesignStudioStore(
    (state) => state.elements[elementId] as FlatNumberElement,
  );

  const baseStyle = element?.style;
  const overrideStyle = element?.format?.[styleKey];
  const hasCustomStyles =
    overrideStyle !== undefined && Object.keys(overrideStyle).length > 0;

  const resetStyle = useCallback(() => {
    useDesignStudioStore.setState((state) => {
      const element = {
        ...state.elements[elementId],
      } as FlatNumberElement;
      const { [styleKey]: _, ...rest } = element.format || {};

      element.format = rest as FlatNumberElement['format'];

      return { elements: { ...state.elements, [elementId]: element } };
    });
    saveDesign();
  }, [elementId, styleKey]);

  const updateStyle = useCallback(
    (updates: Partial<TextElementStyle>) => {
      updateDesignElement(elementId, {
        format: { [styleKey]: { ...overrideStyle, ...updates } },
      });
    },
    [elementId, styleKey, overrideStyle],
  );

  const fontFamily =
    overrideStyle?.['font-family'] ?? baseStyle?.['font-family'] ?? 'inherit';
  const fontWeight =
    overrideStyle?.['font-weight'] ?? baseStyle?.['font-weight'] ?? 'inherit';
  const fontSize =
    overrideStyle?.['font-size'] ?? baseStyle?.['font-size'];
  const letterSpacing =
    overrideStyle?.['letter-spacing'] ?? baseStyle?.['letter-spacing'];
  const color = overrideStyle?.color ?? baseStyle?.color ?? 'default';
  const opacity = overrideStyle?.opacity ?? baseStyle?.opacity;
  const italic = overrideStyle?.italic ?? baseStyle?.italic ?? false;
  const underline =
    overrideStyle?.underline ?? baseStyle?.underline ?? false;
  const marginKey =
    styleKey === 'prefixStyle' ? 'margin-right' : 'margin-left';
  const margin = overrideStyle?.[marginKey] ?? baseStyle?.[marginKey] ?? 2 / 16;

  return (
    <Popover>
      <PopoverTrigger>

          <IconButton icon="palette" label={label} size="md" variant="subtle" color={hasCustomStyles ? 'regular' : 'muted'} />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner side="left" sideOffset={8}>
          <PopoverContent style={{ width: 'var(--design-studio-panel-content-width)' }}>
            <Stack gap={3} style={{ padding: 'var(--space-3)' }}>
              <Stack gap={1}>
                <Select
                  variant="subtle"
                  value={fontFamily}
                  valueColor={fontFamily === 'inherit' ? 'muted' : 'regular'}
                  onValueChange={(value: FontFamily) =>
                    updateStyle({ 'font-family': value })
                  }
                  options={fonts.map((font) => ({
                    label: t(font.label),
                    value: font.value,
                  }))}
                >
                  {fonts.map((font) => (
                    <SelectItem
                      key={font.value}
                      className={font.value}
                      label={font.label}
                      value={font.value}
                    />
                  ))}
                </Select>
                <Group gap={1}>
                  <FlexItem grow={1}>
                    <Select
                      variant="subtle"
                      value={fontWeight}
                      valueColor={fontWeight === 'inherit' ? 'muted' : 'regular'}
                      onValueChange={(value: FontWeight) =>
                        updateStyle({ 'font-weight': value })
                      }
                      options={fontWeights.map((weight) => ({
                        label: t(weight.label),
                        value: weight.value,
                      }))}
                    >
                      {fontWeights.map((weight) => (
                        <SelectItem
                          key={weight.value}
                          className={`weight-${weight.value} ${fontFamily}`}
                          label={weight.label}
                          value={weight.value}
                        />
                      ))}
                    </Select>
                  </FlexItem>
                  <IconButton
                    icon="italic"
                    label="designs.typography.italic"
                    size="sm"
                    active={italic}
                    onClick={() => updateStyle({ italic: !italic })}
                  />
                  <IconButton
                    icon="underline"
                    label="designs.typography.underline"
                    size="sm"
                    active={underline}
                    onClick={() => updateStyle({ underline: !underline })}
                  />
                </Group>
              </Stack>

            <Stack gap={1}>
              <InputLabel size="xs" label="designs.typography.color.label" />
              <ColorSelect
                size="md"
                variant="subtle"
                value={color}
                valueColor={color === 'default' ? 'muted' : 'regular'}
                onValueChange={(value: ContentColor | null) => {
                  if (value) {
                    updateStyle({ color: value });
                  }
                }}
              />
            </Stack>

            <Group gap={2}>
              <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
                <Stack gap={1}>
                  <InputLabel
                    size="xs"
                    label="designs.typography.font-size.label"
                  />
                  <NumberField
                    variant="subtle"
                    size="md"
                    value={
                      fontSize !== undefined
                        ? Math.round(fontSize * 16)
                        : undefined
                    }
                    onValueChange={(value: number | null) => {
                      if (value !== null) {
                        updateStyle({ 'font-size': value / 16 });
                      }
                    }}
                    min={4}
                    max={160}
                    step={1}
                    trailing="px"
                  />
                </Stack>
              </FlexItem>
              <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
                <Stack gap={1}>
                  <InputLabel
                    size="xs"
                    label="designs.typography.margin.label"
                  />
                  <NumberField
                    variant="subtle"
                    size="md"
                    value={
                      margin !== undefined
                        ? Math.round(margin * 16)
                        : undefined
                    }
                    onValueChange={(value: number | null) => {
                      if (value !== null) {
                        updateStyle({ [marginKey]: value / 16 });
                      }
                    }}
                    min={0}
                    step={1}
                    trailing="px"
                  />
                </Stack>
              </FlexItem>
              <FlexItem grow={1} style={{ flexBasis: 0, minWidth: 0 }}>
                <Stack gap={1}>
                  <InputLabel
                    size="xs"
                    label="designs.typography.letter-spacing.label"
                  />
                  <NumberField
                    variant="subtle"
                    size="md"
                    value={
                      letterSpacing !== undefined
                        ? parseFloat((letterSpacing * 16).toFixed(2))
                        : undefined
                    }
                    onValueChange={(value: number | null) => {
                      if (value !== null) {
                        updateStyle({ 'letter-spacing': value / 16 });
                      }
                    }}
                    step={0.1}
                    trailing="px"
                  />
                </Stack>
              </FlexItem>
            </Group>

            <Stack gap={1}>
              <InputLabel size="xs" label="designs.opacity.label" />
              <NumberField
                variant="subtle"
                size="md"
                value={
                  opacity !== undefined
                    ? Math.round(opacity * 100)
                    : undefined
                }
                onValueChange={(value: number | null) => {
                  if (value !== null) {
                    updateStyle({ opacity: value / 100 });
                  }
                }}
                min={0}
                max={100}
                step={1}
                trailing="%"
              />
            </Stack>

            <Button
              variant="ghost"
              size="sm"
              label="actions.reset"
              startIcon="rotate-ccw"
              onClick={resetStyle}
              disabled={!hasCustomStyles}
            />
            </Stack>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};
