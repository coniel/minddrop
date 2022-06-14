import { textFile } from '@minddrop/test-utils';
import { AdapterNotRegisteredError } from '@minddrop/utils';
import { core } from '../test-utils';
import { FileStorageApi } from '../types';
import {
  registerFileStorageAdapter,
  unregisterFileStorageAdapter,
  getFileUrl,
  saveFileToStorage,
  downloadFileToStorage,
} from './file-storage';

const adapter: FileStorageApi = {
  save: async () => null,
  getUrl: () => 'file-url',
  download: async () => null,
};

describe('file-storage', () => {
  afterEach(() => {
    unregisterFileStorageAdapter();
  });

  describe('registerFileStorageAdapter', () => {
    it('registers a file storage adapter', () => {
      // Register a file storage adapter
      registerFileStorageAdapter(adapter);

      // Call the getFileUrl function
      const url = getFileUrl('file-id');

      // Should return the data from the reigstered
      // adapter's 'getUrl' method.
      expect(url).toBe('file-url');
    });
  });

  describe('unregisterFileStorageAdapter', () => {
    it('unregisters a file storage adapter', async () => {
      // Register a file storage adapter
      registerFileStorageAdapter(adapter);
      // Unregister the file storage adapter
      unregisterFileStorageAdapter();

      // Call the getFileUrl function, should throw
      // a `AdapterNotRegisteredError`.
      expect(() => getFileUrl('file-id')).toThrowError(
        AdapterNotRegisteredError,
      );
    });
  });

  describe('getFileUrl', () => {
    it('throws if there is no registered adapter', () => {
      // Call without a registered adapter, should
      // throw a `AdapterNotRegisteredError`.
      expect(() => getFileUrl('file-id')).toThrowError(
        AdapterNotRegisteredError,
      );
    });

    it("calls the registered adapter's `getUrl` method", () => {
      // Register a file storage adapter
      registerFileStorageAdapter(adapter);

      // Call the getFileUrl function
      const url = getFileUrl('file-id');

      // Should return the result from the adapter's
      // 'getUrl' method.
      expect(url).toBe('file-url');
    });
  });

  describe('saveFileToStorage', () => {
    it('throws if there is no registered adapter', () => {
      // Call without a registered adapter, should
      // throw a `AdapterNotRegisteredError`.
      expect(() => saveFileToStorage(core, textFile)).toThrowError(
        AdapterNotRegisteredError,
      );
    });

    it("calls the registered adapter's `save` method", async () => {
      jest.spyOn(adapter, 'save');

      // Register a file storage adapter
      registerFileStorageAdapter(adapter);

      // Call the saveFileToStorage function
      await saveFileToStorage(core, textFile);

      // Should call the registered adapters `save` method
      expect(adapter.save).toHaveBeenCalledWith(core, textFile);
    });
  });

  describe('downloadFileToStorage', () => {
    it('throws if there is no registered adapter', () => {
      // Call without a registered adapter, should
      // throw a `AdapterNotRegisteredError`.
      expect(() => downloadFileToStorage(core, 'file-url')).toThrowError(
        AdapterNotRegisteredError,
      );
    });

    it("calls the registered adapter's `download` method", async () => {
      jest.spyOn(adapter, 'download');

      // Register a file storage adapter
      registerFileStorageAdapter(adapter);

      // Call the downloadFileToStorage function
      await downloadFileToStorage(core, 'file-url');

      // Should call the registered adapters `download` method
      expect(adapter.download).toHaveBeenCalledWith(core, 'file-url');
    });
  });
});
