import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  MenuLabel,
} from '@minddrop/ui-primitives';
import { ViewTypeSettingsMenuProps } from '@minddrop/views';
import { GalleryGap, GalleryViewOptions } from '../types';
import './GalleryViewOptionsMenu.css';

export const GalleryViewOptionsMenu: React.FC<
  ViewTypeSettingsMenuProps<GalleryViewOptions>
> = ({ options, onUpdateOptions }) => {
  const { t } = useTranslation({ keyPrefix: 'views.gallery.options' });

  return (
    <DropdownMenuContent className="gallery-view-options-menu">
      {/* Max columns radio group */}
      <DropdownMenuRadioGroup
        value={String(options.maxColumns)}
        onValueChange={(value) =>
          onUpdateOptions({ maxColumns: Number(value) })
        }
      >
        <MenuLabel label={t('maxColumns')} />
        <DropdownMenuRadioItem label="3" value="3" />
        <DropdownMenuRadioItem label="4" value="4" />
        <DropdownMenuRadioItem label="5" value="5" />
        <DropdownMenuRadioItem label="6" value="6" />
      </DropdownMenuRadioGroup>

      <DropdownMenuSeparator />

      {/* Card size radio group */}
      <DropdownMenuRadioGroup
        value={String(options.minColumnWidth)}
        onValueChange={(value) =>
          onUpdateOptions({ minColumnWidth: Number(value) })
        }
      >
        <MenuLabel label={t('cardSize')} />
        <DropdownMenuRadioItem label={t('small')} value="200" />
        <DropdownMenuRadioItem label={t('medium')} value="300" />
        <DropdownMenuRadioItem label={t('large')} value="400" />
      </DropdownMenuRadioGroup>

      <DropdownMenuSeparator />

      {/* Gap radio group */}
      <DropdownMenuRadioGroup
        value={options.gap}
        onValueChange={(value) => onUpdateOptions({ gap: value as GalleryGap })}
      >
        <MenuLabel label={t('gap')} />
        <DropdownMenuRadioItem label={t('compact')} value="compact" />
        <DropdownMenuRadioItem label={t('comfortable')} value="comfortable" />
        <DropdownMenuRadioItem label={t('spacious')} value="spacious" />
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  );
};
