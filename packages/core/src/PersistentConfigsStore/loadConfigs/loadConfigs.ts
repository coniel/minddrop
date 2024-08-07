import { Fs, ConfigsFile, ConfigsFileOptions } from '@minddrop/file-system';
import { ConfigItem, PersistentConfigsStore } from '../PersistentConfigsStore';

/**
 * Does something useful.
 */
export async function loadConfigs(): Promise<void> {
  // Verify that the configs file exists
  const exists = await Fs.exists(ConfigsFile, ConfigsFileOptions);

  if (!exists) {
    // Stop here if the file does not exist
    return;
  }

  // Get the stringified configs data from the app-config
  // configs.json file.
  const configsRaw = await Fs.readTextFile(ConfigsFile, ConfigsFileOptions);

  try {
    // Parse the configs data
    const data = JSON.parse(configsRaw);

    // Format the config data into individual config items
    const configs: ConfigItem[] = Object.keys(data).reduce(
      (items, key) => [...items, { id: key, values: data[key] }],
      [] as ConfigItem[],
    );

    // Load the configs into the store
    PersistentConfigsStore.load(configs);
  } catch (err) {
    return;
  }
}
