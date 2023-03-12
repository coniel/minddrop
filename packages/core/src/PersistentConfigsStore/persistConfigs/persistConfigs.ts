import { ConfigsFile, ConfigsFileOptions } from '../../constants';
import { Fs } from '../../FileSystem';
import { PersistentConfigsStore } from '../PersistentConfigsStore';

/**
 * Persists configs by writing them to a configs.json
 * file inside app data.
 *
 * @returns A promise indicating the success or failure of the operation.
 */
export function persistConfigs(): Promise<void> {
  // Get the configs
  const configs = PersistentConfigsStore.getAll();

  // Create a `{ [id]: [values] }` map of the configs
  const configValues = Object.keys(configs).reduce(
    (map, key) => ({
      ...map,
      [key]: configs[key].values,
    }),
    {},
  );

  // Write to config values to 'configs.json' in app data
  return Fs.writeTextFile(
    ConfigsFile,
    JSON.stringify(configValues),
    ConfigsFileOptions,
  );
}
