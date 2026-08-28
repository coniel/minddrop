import { afterEach, describe, expect, it } from 'vitest';
import { SettingsViewsStore } from '../SettingsViewsStore';
import { SettingsView } from '../types';
import { registerSettingsView } from './registerSettingsView';

const view: SettingsView = {
  id: 'test',
  label: 'labels.settings',
  description: 'labels.settings',
  icon: 'settings',
  component: () => null,
};

describe('registerSettingsView', () => {
  afterEach(() => {
    // Clear registered settings views
    SettingsViewsStore.clear();
  });

  it('adds the view to the settings views store', () => {
    registerSettingsView(view);

    expect(SettingsViewsStore.get(view.id)).toEqual(view);
  });
});
