import { useCallback } from 'react';
import { BadgesElement, BadgesSize, BadgesVariant } from '@minddrop/designs';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import {
  InputLabel,
  RadioToggleGroup,
  Select,
  Stack,
  Toggle,
} from '@minddrop/ui-primitives';
import { updateDesignElement, useElementData } from '../../DesignStudioStore';
import { MarginFields } from '../../style-editors/MarginFields';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { StaticElementField } from '../../style-editors/StaticElementField';
import { TextAlignToggle } from '../../style-editors/TextAlignToggle';
import { Typography } from '../../style-editors/Typography';
import { FlatBadgesElement } from '../../types';
import { BadgesPlaceholderField } from './BadgesPlaceholderField';

const sizeOptions: { label: TranslationKey; value: BadgesSize }[] = [
  { label: 'designs.badges.size.small', value: 'sm' },
  { label: 'designs.badges.size.medium', value: 'md' },
  { label: 'designs.badges.size.large', value: 'lg' },
];

export interface BadgesElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders the style editor panel for badges design elements.
 * Provides placeholder, badge appearance (variant, size),
 * typography, alignment, and margin controls.
 */
export const BadgesElementStyleEditor: React.FC<
  BadgesElementStyleEditorProps
> = ({ elementId }) => {
  const { t } = useTranslation();

  // Read badge-specific values from the store
  const { variant, size } = useElementData(
    elementId,
    (element: FlatBadgesElement) => ({
      variant: element.variant ?? 'rectangular',
      size: element.size ?? 'md',
    }),
  );

  // Update variant
  const handleVariantChange = useCallback(
    (value: BadgesVariant) => {
      updateDesignElement<BadgesElement>(elementId, { variant: value });
    },
    [elementId],
  );

  // Update size
  const handleSizeChange = useCallback(
    (value: BadgesSize) => {
      updateDesignElement<BadgesElement>(elementId, { size: value });
    },
    [elementId],
  );

  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.badges.placeholder.label" />
        <BadgesPlaceholderField elementId={elementId} />
        <StaticElementField elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.badges.variant.label" />

        <RadioToggleGroup
          size="md"
          value={variant}
          onValueChange={handleVariantChange}
        >
          <Toggle
            value="rectangular"
            label={t('designs.badges.variant.rectangular')}
          />
          <Toggle value="round" label={t('designs.badges.variant.round')} />
        </RadioToggleGroup>

        <InputLabel size="xs" label="designs.badges.size.label" />
        <Select
          variant="subtle"
          value={size}
          onValueChange={handleSizeChange}
          options={sizeOptions.map((option) => ({
            label: t(option.label),
            value: option.value,
          }))}
        />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.typography.label" />
        <Typography elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.typography.alignment.label" />
        <TextAlignToggle elementId={elementId} />
        <Stack gap={1}>
          <InputLabel size="xs" label="designs.typography.margin.label" />
          <MarginFields elementId={elementId} />
        </Stack>
      </Stack>
    </>
  );
};
