import { createI18nKeyBuilder, i18n } from '@minddrop/i18n';
import { DatabaseDesignSelectionMenu } from '@minddrop/ui-components';
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  MenuLabel,
  Slider,
  Text,
} from '@minddrop/ui-primitives';
import { ViewTypeSettingsMenuProps } from '@minddrop/views';
import { GalleryGap, GalleryViewOptions } from '../types';
import './GalleryViewOptionsMenu.css';

const t = createI18nKeyBuilder('views.gallery.options.');

export const GalleryViewOptionsMenu: React.FC<
  ViewTypeSettingsMenuProps<GalleryViewOptions>
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

      {/* Card design selection */}
      <DatabaseDesignSelectionMenu
        databaseId={view.dataSource.id}
        designType="card"
        value={options.cardDesignId}
        onValueChange={(designId) =>
          onUpdateOptions({ cardDesignId: designId })
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
