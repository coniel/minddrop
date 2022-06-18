import { Core, DataInsert } from '@minddrop/core';
import { isDomainMatch } from '@minddrop/utils';
import { RegisteredDropTypeConfig, DropMap, Drop } from '../types';
import { DropsResource } from '../DropsResource';

function createFromFiles(
  core: Core,
  config: RegisteredDropTypeConfig,
  files: File[],
): Drop {
  const dropData = config.initializeData(core, {
    action: 'insert',
    types: ['files'],
    data: {},
    files,
  });

  return DropsResource.create(core, config.type, dropData);
}

/**
 * Creates drops of the appropriate type given a `DataInsert` object
 * and an array of `DropConfig` objects. Returns a promise resolving
 * to a `{ [id]: Drop }` map of the created drops. Dispatches a
 * `drops:create` event for each created drop.
 *
 * @param core A MindDrop core instance.
 * @param data The data from which to create the drops.
 * @param configs The drop configs from which to create the drops.
 */
export function createFromDataInsert(
  core: Core,
  dataInsert: DataInsert,
  configs: RegisteredDropTypeConfig[],
): DropMap {
  const drops: DropMap = {};

  if (dataInsert.files && dataInsert.files.length) {
    // Group the files by type
    const filesByType = dataInsert.files.reduce((filesByType, file) => {
      if (filesByType[file.type]) {
        return {
          ...filesByType,
          [file.type]: [...filesByType[file.type], file],
        };
      }

      return {
        ...filesByType,
        [file.type]: [file],
      };
    }, {} as Record<string, File[]>);

    // Create drops from the files using the first type config
    // with support for the file types.
    configs.forEach((config) => {
      if (config.fileTypes && config.initializeData) {
        // Get the supported files for this config
        const supportedFiles = config.fileTypes.reduce((files, fileType) => {
          if (filesByType[fileType]) {
            const newFiles = [...files, ...filesByType[fileType]];

            // Remove the used files
            delete filesByType[fileType];

            return newFiles;
          }

          return files;
        }, [] as File[]);

        if (config.multiFile) {
          // If the drop type supports multiple files at once,
          // create a single drop from all the supported files.
          const drop = createFromFiles(core, config, supportedFiles);

          // Add the drop to the drops map
          drops[drop.id] = drop;
        } else {
          // Create a drop for each supported file
          supportedFiles.forEach((file) => {
            const drop = createFromFiles(core, config, [file]);

            // Add the drop to the drops map
            drops[drop.id] = drop;
          });
        }
      }
    });
  }

  if (dataInsert.types.includes('text/url')) {
    // Get the URL
    const url = dataInsert.data['text/url'];

    // Get drop type configs which have a domain matcher
    // that matches the URL.
    const matchedConfigs = configs.filter(
      (config) =>
        config.initializeData &&
        config.domains &&
        isDomainMatch(url, config.domains),
    );

    // If there are matching drop configs, use the
    // first match to create the drop.
    if (matchedConfigs.length) {
      const dropData = matchedConfigs[0].initializeData(core, dataInsert);
      const drop = DropsResource.create(core, matchedConfigs[0].type, dropData);

      drops[drop.id] = drop;
    }
  }

  if (Object.keys(drops).length) {
    // If any drops were created above, return them here
    return drops;
  }

  // Get the drop configs which support the data insert's
  // data types and have an `initializeData` callback.
  const matchedDataConfigs = configs.filter(
    (config) =>
      config.dataTypes &&
      config.initializeData &&
      config.dataTypes.filter((type) => dataInsert.types.includes(type)).length,
  );

  // If there are matching drop configs, use the
  // first match to create the drop.
  if (matchedDataConfigs.length) {
    const dropData = matchedDataConfigs[0].initializeData(core, dataInsert);
    const drop = DropsResource.create(
      core,
      matchedDataConfigs[0].type,
      dropData,
    );

    drops[drop.id] = drop;
  }

  return drops;
}
