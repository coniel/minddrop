import { ConfigsFile, ConfigsFileOptions, Fs } from '@minddrop/file-system';
import { ConfigItem, PersistentConfigsStore } from '../PersistentConfigsStore';

/**
 * Loads the app config files from the AppData directory.
 * If the AppData directory does not exist, it will be created.
 */
export async function loadConfigs(): Promise<void> {
  const appDataDir = await Fs.getBaseDirPath(ConfigsFileOptions.baseDir!);

  // Ensure the configs directory exists
  if (!(await Fs.exists(appDataDir))) {
    await Fs.createDir(appDataDir);
  }

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
  } catch (error) {
    console.error(error);

    return;
  }
}
