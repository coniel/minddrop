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
  const { t } = useTranslation('theme.appearance');
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
          label={t('action')}
          icon={themeAppearance === Theme.Dark ? 'sun' : 'moon'}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="theme-appearance-setting-menu">
        <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={themeAppearanceSetting}
          onValueChange={handleChangeThemeAppearanceSetting}
        >
          <DropdownMenuRadioItem
            icon="toggle-right"
            value="system"
            label={t('system')}
          />
          <DropdownMenuRadioItem icon="sun" value="light" label={t('light')} />
          <DropdownMenuRadioItem icon="moon" value="dark" label={t('dark')} />
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
