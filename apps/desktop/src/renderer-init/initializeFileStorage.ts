import { Files, FileStorageApi } from '@minddrop/files';

export function initializeFileStorage(): FileStorageApi {
  const api = window.FileStorageAdapter;

  return {
    getUrl: api.getUrl,
    save: async (core, file) => {
      // Create a file reference
      const fileReference = await Files.createReference(core, file);

      // Save the file to the attachments directory
      await api.save(file, fileReference);

      return fileReference;
    },
    download: async (core, url) => {
      // Download the file
      const file = await api.download(url);

      // Create a file reference
      const fileReference = await Files.createReference(core, file);

      // Save the downloaded file to the attachments directory
      await api.save(file, fileReference);

      return fileReference;
    },
  };
}
