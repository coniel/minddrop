import { RPCSchema } from 'electrobun';
import { BaseDirectory } from '@minddrop/file-system';
import type { FsEntry, FsWatchEventKind } from '@minddrop/file-system';

export type WebviewRPC = {
  bun: RPCSchema<{
    requests: {
      fsGetBaseDirPath: {
        params: { dir: BaseDirectory };
        response: string;
      };
      fsIsDirectory: {
        params: { path: string; baseDir?: BaseDirectory };
        response: boolean;
      };
      fsCopyFile: {
        params: {
          source: string;
          destination: string;
          fromPathBaseDir?: BaseDirectory;
          toPathBaseDir?: BaseDirectory;
        };
        response: void;
      };
      fsCreateDir: {
        params: { path: string; baseDir?: BaseDirectory; recursive?: boolean };
        response: void;
      };
      fsExists: {
        params: { path: string; baseDir?: BaseDirectory };
        response: boolean;
      };
      fsReadDir: {
        params: { path: string; baseDir?: BaseDirectory; recursive?: boolean };
        response: FsEntry[];
      };
      fsReadTextFile: {
        params: { path: string; baseDir?: BaseDirectory };
        response: string;
      };
      fsRemoveDir: {
        params: { path: string; baseDir?: BaseDirectory; recursive?: boolean };
        response: void;
      };
      fsRemoveFile: {
        params: { path: string; baseDir?: BaseDirectory };
        response: void;
      };
      fsRename: {
        params: {
          oldPath: string;
          newPath: string;
          oldPathBaseDir?: BaseDirectory;
          newPathBaseDir?: BaseDirectory;
        };
        response: void;
      };
      fsTrashDir: {
        params: { path: string };
        response: void;
      };
      fsTrashFile: {
        params: { path: string };
        response: void;
      };
      fsWriteBinaryFile: {
        params: { path: string; file: Blob; baseDir?: BaseDirectory };
        response: void;
      };
      fsWriteTextFile: {
        params: { path: string; contents: string; baseDir?: BaseDirectory };
        response: void;
      };
      fsDownloadFile: {
        params: { url: string; path: string; baseDir?: BaseDirectory };
        response: void;
      };
      fsWatch: {
        params: {
          paths: string[];
          recursive?: boolean;
          baseDir?: BaseDirectory;
        };
        response: string;
      };
      fsUnwatch: {
        params: { id: string };
        response: void;
      };
      fsOpenFilePicker: {
        params: {
          directory?: boolean;
          multiple?: boolean;
          accept?: string[];
        };
        response: string | string[] | null;
      };
      openUrl: {
        params: { url: string };
        response: void;
      };
      openFile: {
        params: { path: string };
        response: void;
      };
      getWebpageHtml: {
        params: { url: string };
        response: string;
      };
      showItemInFolder: {
        params: { path: string };
        response: void;
      };
    };
  }>;
  webview: RPCSchema<{
    messages: {
      logToWebview: {
        message: string;
      };
      fsWatchEvent: {
        id: string;
        kind: FsWatchEventKind;
        paths: string[];
      };
    };
  }>;
};
