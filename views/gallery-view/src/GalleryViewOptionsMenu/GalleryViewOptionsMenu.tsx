import { createI18nKeyBuilder, i18n } from '@minddrop/i18n';
import { DatabaseLayoutSelectionMenu } from '@minddrop/ui-components';
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  MenuLabel,
  Slider,
  Text,
} from '@minddrop/ui-primitives';
import { DataViewTypeSettingsMenuProps } from '@minddrop/views';
import { GalleryGap, GalleryViewOptions } from '../types';
import './GalleryViewOptionsMenu.css';

const t = createI18nKeyBuilder('views.gallery.options.');

export const GalleryViewOptionsMenu: React.FC<
  DataViewTypeSettingsMenuProps<GalleryViewOptions>
> = ({ view, options, onUpdateOptions }) => {
  return (
    <div className="gallery-view-options-menu">
      {/* Card width slider */}
      <MenuLabel
        label={t('cardWidth')}
        actionsAlwaysVisible
        actions={
          <Text size="xs" color="subtle">
            {options.minColumnWidth}px
          </Text>
        }
      />
      <div className="gallery-view-options-slider">
        <Slider
          size="lg"
          value={options.minColumnWidth}
          onValueChange={(value) =>
            onUpdateOptions({ minColumnWidth: value as number })
          }
          min={100}
          max={1000}
          step={10}
          ariaLabel={i18n.t(t('cardWidth'))}
        />
      </div>

      <DropdownMenuSeparator />

      {/* Card layout selection */}
      <DatabaseLayoutSelectionMenu
        databaseId={view.dataSource.id}
        layoutType="card"
        value={options.cardLayoutId}
        onValueChange={(layoutId) =>
          onUpdateOptions({ cardLayoutId: layoutId })
        }
      />

      <DropdownMenuSeparator />

      {/* Gap radio group */}
      <DropdownMenuRadioGroup
        value={options.gap}
        onValueChange={(value) => onUpdateOptions({ gap: value as GalleryGap })}
      >
        <MenuLabel label={t('gap')} />
        <DropdownMenuRadioItem label={t('none')} value="none" />
        <DropdownMenuRadioItem label={t('compact')} value="compact" />
        <DropdownMenuRadioItem label={t('comfortable')} value="comfortable" />
        <DropdownMenuRadioItem label={t('spacious')} value="spacious" />
      </DropdownMenuRadioGroup>
    </div>
  );
};
