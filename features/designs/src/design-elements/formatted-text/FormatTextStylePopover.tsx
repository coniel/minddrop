import { useCallback } from 'react';
import {
  FontFamily,
  FontWeight,
  NumberElement,
  TextElementStyle,
  fontWeights,
  fonts,
} from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
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
import { ContentColor } from '@minddrop/ui-theme';
import {
  saveDesign,
  updateDesignElement,
  useDesignStudioStore,
  useElementData,
} from '../../DesignStudioStore';
import { FlatNumberElement } from '../../types';

export interface FormatTextStylePopoverProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;

  /**
   * Which affix style to configure.
   */
  styleKey: 'prefixStyle' | 'suffixStyle';

  /**
   * The i18n label for the popover trigger button.
   */
  label: string;
}

/**
 * Renders a popover with typography controls for customising the
 * prefix or suffix style on a number design element.
 */
export const FormatTextStylePopover = ({
  elementId,
  styleKey,
  label,
}: FormatTextStylePopoverProps) => {
  const { t } = useTranslation();
  const marginKey = styleKey === 'prefixStyle' ? 'margin-right' : 'margin-left';

  // Read all derived style values from the element
  const {
    overrideStyle,
    hasCustomStyles,
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    color,
    opacity,
    italic,
    underline,
    margin,
  } = useElementData(elementId, (element: FlatNumberElement) => {
    const baseStyle = element?.style;
    const override = element?.format?.[styleKey];

    return {
      overrideStyle: override,
      hasCustomStyles:
        override !== undefined && Object.keys(override).length > 0,
      fontFamily:
        override?.['font-family'] ?? baseStyle?.['font-family'] ?? 'inherit',
      fontWeight:
        override?.['font-weight'] ?? baseStyle?.['font-weight'] ?? 'inherit',
      fontSize: override?.['font-size'] ?? baseStyle?.['font-size'],
      letterSpacing:
        override?.['letter-spacing'] ?? baseStyle?.['letter-spacing'],
      color: override?.color ?? baseStyle?.color ?? 'default',
      opacity: override?.opacity ?? baseStyle?.opacity,
      italic: override?.italic ?? baseStyle?.italic ?? false,
      underline: override?.underline ?? baseStyle?.underline ?? false,
      margin: override?.[marginKey] ?? baseStyle?.[marginKey] ?? 2 / 16,
    };
  });

  // Reset the override style back to element defaults
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

  // Update a style property on the override
  const updateStyle = useCallback(
    (updates: Partial<TextElementStyle>) => {
      updateDesignElement<NumberElement>(elementId, {
        format: {
          [styleKey]: {
            ...(overrideStyle as Partial<TextElementStyle>),
            ...updates,
          },
        },
      });
    },
    [elementId, styleKey, overrideStyle],
  );

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          icon="palette"
          label={label}
          size="md"
          variant="subtle"
          color={hasCustomStyles ? 'regular' : 'muted'}
        />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner side="left" sideOffset={8}>
          <PopoverContent
            style={{ width: 'var(--design-studio-panel-content-width)' }}
          >
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
                      valueColor={
                        fontWeight === 'inherit' ? 'muted' : 'regular'
                      }
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
                    variant="subtle"
                    size="md"
                    active={italic}
                    onClick={() => updateStyle({ italic: !italic })}
                  />
                  <IconButton
                    icon="underline"
                    label="designs.typography.underline"
                    variant="subtle"
                    size="md"
                    active={underline}
                    onClick={() => updateStyle({ underline: !underline })}
                  />
                </Group>
              </Stack>

              <ColorSelect
                size="md"
                variant="subtle"
                label="designs.typography.color.label"
                value={color}
                valueColor={color === 'default' ? 'muted' : 'regular'}
                onValueChange={(value: ContentColor | null) => {
                  if (value) {
                    updateStyle({ color: value });
                  }
                }}
              />

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
