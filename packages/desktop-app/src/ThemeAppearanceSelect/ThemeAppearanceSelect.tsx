import { useCallback } from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  Theme,
  ThemeAppearanceSetting,
  useThemeAppearance,
  useThemeAppearanceSetting,
} from '@minddrop/theme';
import { useCore } from '@minddrop/core';
import {
  IconButton,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from '@minddrop/ui';

export const ThemeAppearanceSelect: React.FC = () => {
  const { t } = useTranslation();
  const themeAppearance = useThemeAppearance();
  const themeAppearanceSetting = useThemeAppearanceSetting();
  const core = useCore('minddrop:app');

  const handleChangeThemeAppearanceSetting = useCallback(
    (setting: string) => {
      Theme.setAppearanceSetting(core, setting as ThemeAppearanceSetting);
    },
    [core],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconButton
          label="Theme appearance"
          icon={themeAppearance === 'dark' ? 'sun' : 'moon'}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="theme-appearance-setting-menu">
        <DropdownMenuLabel>{t('themeAppearance')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={themeAppearanceSetting}
          onValueChange={handleChangeThemeAppearanceSetting}
        >
          <DropdownMenuRadioItem
            value="system"
            label={t('themeAppearanceSystem')}
          />
          <DropdownMenuRadioItem
            value="light"
            label={t('themeAppearanceLight')}
          />
          <DropdownMenuRadioItem
            value="dark"
            label={t('themeAppearanceDark')}
          />
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
