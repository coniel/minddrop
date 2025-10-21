import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { ItemTypeConfigsDir } from '../constants';
import { ItemTypeConfig } from '../types';

/**
 * Loads item type configs from the file system into the
 * ItemTypeConfigsStore.
 *
 * @dispatches item-types:load
 */
export async function loadItemTypes(): Promise<void> {
  let configs: Promise<ItemTypeConfig>[] = [];

  // Read item type config files from the file system
  const configFiles = await Fs.readDir(
    Fs.concatPath(Paths.workspaceConfigsPath, ItemTypeConfigsDir),
  );

  // For each config file
  configFiles.forEach((file) => {
    // Read the config
    const config = Fs.readJsonFile<ItemTypeConfig>(file.path);

    // Add the config to the configs array
    configs.push(config);
  });

  // Wait for all configs to be read
  const loadedConfigs = await Promise.all(configs);

  // Load configs into the store
  ItemTypeConfigsStore.load(loadedConfigs);

  // Dispatch item types load event
  Events.dispatch('item-types:load', loadedConfigs);
}
