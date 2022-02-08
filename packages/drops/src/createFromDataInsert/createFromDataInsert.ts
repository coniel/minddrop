import { Core, DataInsert } from '@minddrop/core';
import { Drop, DropConfig, DropMap } from '../types';

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
export async function createFromDataInsert(
  core: Core,
  dataInsert: DataInsert,
  configs: DropConfig<any>[],
): Promise<DropMap> {
  const drops: DropMap = {};

  // Get drop configs which support the data
  // insert's data types
  const dataTypes = Object.keys(dataInsert.data);
  const matchedDataConfigs = configs.filter(
    (config) =>
      config.dataTypes &&
      config.dataTypes.filter((type) => dataTypes.includes(type)).length,
  );

  // If there are matching drop configs, use the
  // first match to create the drop.
  if (matchedDataConfigs.length) {
    const drop = await matchedDataConfigs[0].create(core, dataInsert);

    drops[drop.id] = drop;
  }

  if (dataInsert.files.length) {
    const fileDropPromises: Promise<Drop>[] = [];
    const fileTypes = dataInsert.files.reduce((types, file) => {
      if (!types.includes(file.type)) {
        return [...types, file.type];
      }

      return types;
    }, [] as string[]);

    // Group files by type
    const filesByType = fileTypes.reduce(
      (files, type) => ({
        ...files,
        [type]: dataInsert.files.filter((file) => file.type === type),
      }),
      {} as Record<string, File[]>,
    );

    // Group files by supported drop config
    configs.forEach((config) => {
      if (config.fileTypes) {
        const supportedFiles = config.fileTypes.reduce((files, fileType) => {
          if (filesByType[fileType]) {
            const newFiles = [...files, ...filesByType[fileType]];
            delete filesByType[fileType];

            return newFiles;
          }

          return files;
        }, [] as File[]);

        if (config.multiFile) {
          fileDropPromises.push(
            config.create(core, {
              types: ['files'],
              data: {},
              files: supportedFiles,
            }),
          );
        } else {
          supportedFiles.forEach((file) => {
            fileDropPromises.push(
              config.create(core, {
                types: ['files'],
                data: {},
                files: [file],
              }),
            );
          });
        }
      }
    });

    const fileDrops = await Promise.all(fileDropPromises);

    fileDrops.forEach((drop) => {
      drops[drop.id] = drop;
    });
  }

  return drops;
}
