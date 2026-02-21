import { Utils } from 'electrobun/bun';
import fsp from 'node:fs/promises';
import path from 'path';
import { BaseDirectory } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';

function getBaseDirPath(dir: BaseDirectory): string {
  switch (dir) {
    case BaseDirectory.AppData:
      return `${Utils.paths.appData}/MindDrop`;
    case BaseDirectory.AppConfig:
      return `${Utils.paths.config}/MindDrop`;
    case BaseDirectory.Documents:
      return Utils.paths.documents;
    default:
      throw new InvalidParameterError(`Invalid BaseDirectory value: ${dir}`);
  }
}

function resolvePath(filePath: string, baseDir?: BaseDirectory): string {
  if (!baseDir) return filePath;

  return path.join(getBaseDirPath(baseDir), filePath);
}

function isNonHiddenFileOrWorkspaceConfig(name: string): boolean {
  return !name.startsWith('.') || name === '.minddrop';
}

interface FsEntry {
  name: string;
  path: string;
  children?: FsEntry[];
}

async function readDirAsEntries(
  dirPath: string,
  recursive = false,
): Promise<FsEntry[]> {
  const entries = await fsp.readdir(dirPath, { withFileTypes: true });

  return Promise.all(
    entries
      .filter((entry) => isNonHiddenFileOrWorkspaceConfig(entry.name))
      .map(async (entry): Promise<FsEntry> => {
        const fullPath = path.join(dirPath, entry.name);
        const fsEntry: FsEntry = { name: entry.name, path: fullPath };

        if (entry.isDirectory()) {
          fsEntry.children = recursive
            ? await readDirAsEntries(fullPath, recursive)
            : [];
        }

        return fsEntry;
      }),
  );
}

export const fileSystemRpcHandlers = {
  fsGetBaseDirPath: async ({
    dir,
  }: {
    dir: BaseDirectory;
  }): Promise<string> => {
    return getBaseDirPath(dir);
  },

  fsIsDirectory: async ({
    path: filePath,
    baseDir,
  }: {
    path: string;
    baseDir?: BaseDirectory;
  }): Promise<boolean> => {
    const resolved = resolvePath(filePath, baseDir);

    try {
      const stat = await fsp.stat(resolved);

      return stat.isDirectory();
    } catch {
      return false;
    }
  },

  fsCopyFile: async ({
    source,
    destination,
    fromPathBaseDir,
    toPathBaseDir,
  }: {
    source: string;
    destination: string;
    fromPathBaseDir?: BaseDirectory;
    toPathBaseDir?: BaseDirectory;
  }): Promise<void> => {
    const input = Bun.file(resolvePath(source, fromPathBaseDir));
    const output = Bun.file(resolvePath(destination, toPathBaseDir));
    await Bun.write(output, input);
  },

  fsCreateDir: async ({
    path: dirPath,
    baseDir,
    recursive,
  }: {
    path: string;
    baseDir?: BaseDirectory;
    recursive?: boolean;
  }): Promise<void> => {
    const resolved = resolvePath(dirPath, baseDir);
    await fsp.mkdir(resolved, { recursive: recursive ?? false });
  },

  fsExists: async ({
    path: filePath,
    baseDir,
  }: {
    path: string;
    baseDir?: BaseDirectory;
  }): Promise<boolean> => {
    try {
      await fsp.stat(resolvePath(filePath, baseDir));

      return true;
    } catch {
      return false;
    }
  },

  fsReadDir: async ({
    path: dirPath,
    baseDir,
    recursive,
  }: {
    path: string;
    baseDir?: BaseDirectory;
    recursive?: boolean;
  }): Promise<FsEntry[]> =>
    readDirAsEntries(resolvePath(dirPath, baseDir), recursive),

  fsReadTextFile: async ({
    path: filePath,
    baseDir,
  }: {
    path: string;
    baseDir?: BaseDirectory;
  }): Promise<string> => Bun.file(resolvePath(filePath, baseDir)).text(),

  fsRemoveDir: async ({
    path: dirPath,
    baseDir,
    recursive,
  }: {
    path: string;
    baseDir?: BaseDirectory;
    recursive?: boolean;
  }): Promise<void> => {
    const resolved = resolvePath(dirPath, baseDir);
    await fsp.rm(resolved, { recursive: recursive ?? false, force: true });
  },

  fsRemoveFile: async ({
    path: filePath,
    baseDir,
  }: {
    path: string;
    baseDir?: BaseDirectory;
  }): Promise<void> => Bun.file(resolvePath(filePath, baseDir)).delete(),

  fsRename: async ({
    oldPath,
    newPath,
    oldPathBaseDir,
    newPathBaseDir,
  }: {
    oldPath: string;
    newPath: string;
    oldPathBaseDir?: BaseDirectory;
    newPathBaseDir?: BaseDirectory;
  }): Promise<void> => {
    const resolvedOld = resolvePath(oldPath, oldPathBaseDir);
    const resolvedNew = resolvePath(newPath, newPathBaseDir);
    await fsp.rename(resolvedOld, resolvedNew);
  },

  fsTrashDir: async ({ path: dirPath }: { path: string }): Promise<void> => {
    Utils.moveToTrash(dirPath);
  },

  fsTrashFile: async ({ path: filePath }: { path: string }): Promise<void> => {
    Utils.moveToTrash(filePath);
  },

  fsWriteBinaryFile: async ({
    path: filePath,
    file,
    baseDir,
  }: {
    path: string;
    file: Blob;
    baseDir?: BaseDirectory;
  }): Promise<void> => {
    await Bun.write(resolvePath(filePath, baseDir), file);
  },

  fsWriteTextFile: async ({
    path: filePath,
    contents,
    baseDir,
  }: {
    path: string;
    contents: string;
    baseDir?: BaseDirectory;
  }): Promise<void> => {
    await Bun.write(resolvePath(filePath, baseDir), contents);
  },

  fsDownloadFile: async ({
    url,
    path: filePath,
    baseDir,
  }: {
    url: string;
    path: string;
    baseDir?: BaseDirectory;
  }): Promise<void> => {
    const resolved = resolvePath(filePath, baseDir);
    const response = await fetch(url, {
      headers: { 'User-Agent': 'MindDrop/1.0' },
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    await Bun.write(resolved, response);
  },
};
