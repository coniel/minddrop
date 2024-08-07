import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { render, userEvent } from '@minddrop/test-utils';
import { i18n } from '@minddrop/i18n';
import { Theme } from '@minddrop/theme';
import {
  FILE_SYSTEM_TEST_DATA,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { setup, cleanup } from '../../test-utils';
import { ThemeAppearanceSelect } from './ThemeAppearanceSelect';

const { configsFileDescriptor } = FILE_SYSTEM_TEST_DATA;

initializeMockFileSystem([
  // Persistent configs file
  configsFileDescriptor,
]);

describe('<AppSidebar />', () => {
  beforeEach(() => {
    setup();

    // Set theme appearance to 'light'
    Theme.setAppearanceSetting(Theme.Light);
  });

  afterEach(cleanup);

  it('sets the theme appearance setting', async () => {
    const menuTriggerLabel = i18n.t('theme.appearance.action');
    const menuOptionLabel = i18n.t('theme.appearance.dark');

    const { getByLabelText, getByText } = render(<ThemeAppearanceSelect />);

    // Open the dropdown menu
    await userEvent.click(getByLabelText(menuTriggerLabel));
    // Click on the 'Dark' option
    await userEvent.click(getByText(menuOptionLabel));

    // Theme appearance setting should be set to 'dark'
    expect(Theme.getAppearanceSetting()).toBe(Theme.Dark);
  });
});
