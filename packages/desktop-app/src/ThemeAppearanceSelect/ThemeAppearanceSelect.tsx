import { useCallback } from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  Theme,
  ThemeAppearanceSetting,
  useThemeAppearance,
  useThemeAppearanceSetting,
} from '@minddrop/theme';
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

  const handleChangeThemeAppearanceSetting = useCallback(
    (setting: string) =>
      Theme.setAppearanceSetting(setting as ThemeAppearanceSetting),
    [],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconButton
          label={t('themeAppearanceSetting')}
          icon={themeAppearance === Theme.Dark ? 'sun' : 'moon'}
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
