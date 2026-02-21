import { registerFileSystemAdapter as register } from '@minddrop/file-system';

export const registerFileSystemAdapter = (rpc: any) =>
  register({
    getBaseDirPath: (dir) => rpc.request.fsGetBaseDirPath({ dir }),

    convertFileSrc: (path) => path,

    isDirectory: (path, options = {}) =>
      rpc.request.fsIsDirectory({ path, baseDir: options.baseDir }),

    copyFile: (source, destination, options = {}) =>
      rpc.request.fsCopyFile({
        source,
        destination,
        fromPathBaseDir: options.fromPathBaseDir,
        toPathBaseDir: options.toPathBaseDir,
      }),

    createDir: (dir, options = {}) =>
      rpc.request.fsCreateDir({
        path: dir,
        baseDir: options.baseDir,
        recursive: options.recursive,
      }),

    exists: (path, options = {}) =>
      rpc.request.fsExists({ path, baseDir: options.baseDir }),

    readDir: (path, options = {}) =>
      rpc.request.fsReadDir({
        path,
        baseDir: options.baseDir,
        recursive: options.recursive,
      }),

    readTextFile: (path, options = {}) =>
      rpc.request.fsReadTextFile({ path, baseDir: options.baseDir }),

    removeDir: (path, options = {}) =>
      rpc.request.fsRemoveDir({
        path,
        baseDir: options.baseDir,
        recursive: options.recursive,
      }),

    removeFile: (path, options = {}) =>
      rpc.request.fsRemoveFile({ path, baseDir: options.baseDir }),

    trashDir: (path) => rpc.request.fsTrashDir({ path }),

    trashFile: (path) => rpc.request.fsTrashFile({ path }),

    rename: (oldPath, newPath, options = {}) =>
      rpc.request.fsRename({
        oldPath,
        newPath,
        oldPathBaseDir: options.oldPathBaseDir,
        newPathBaseDir: options.newPathBaseDir,
      }),

    writeBinaryFile: async (path, file, options = {}) => {
      return uploadQueue.add(async () => {
        const response = await fetch(
          `http://localhost:14567/upload?path=${encodeURIComponent(path)}`,
          {
            method: 'POST',
            body: file,
          },
        );

        if (!response.ok)
          throw new Error(`Upload failed: ${response.statusText}`);
      });
    },

    writeTextFile: (path, contents, options = {}) =>
      rpc.request.fsWriteTextFile({ path, contents, baseDir: options.baseDir }),

    downloadFile: (url, path, options = {}) =>
      rpc.request.fsDownloadFile({ url, path, baseDir: options.baseDir }),

    openFilePicker: async () => {
      throw new Error('openFilePicker is not implemented');
    },
  });

const uploadQueue = {
  concurrency: 5,
  running: 0,
  queue: [] as Array<() => Promise<void>>,

  async add(task: () => Promise<void>) {
    return new Promise<void>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          await task();
          resolve();
        } catch (err) {
          reject(err);
        } finally {
          this.running--;
          this.next();
        }
      });
      this.next();
    });
  },

  next() {
    while (this.running < this.concurrency && this.queue.length) {
      this.running++;
      const task = this.queue.shift()!;
      task();
    }
  },
};
