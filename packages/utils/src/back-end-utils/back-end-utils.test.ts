import { afterEach, describe, expect, it } from 'vitest';
import { AdapterNotRegisteredError, InvalidParameterError } from '../errors';
import { BackendUtilsAdapter } from '../types';
import {
  getWebpageMetadata,
  registerBackendUtilsAdapter,
  unregisterBackendUtilsAdapter,
} from './back-end-utils';

const adapter: BackendUtilsAdapter = {
  getWebpageHtml: async () =>
    '<html><head><title>IB Guides</title></head></html>',
  open: async () => {},
};

describe('backend-utils', () => {
  afterEach(() => {
    unregisterBackendUtilsAdapter();
  });

  describe('registerBackendUtilsAdapter', () => {
    it('registers a backend utils adapter', async () => {
      // Register a backend utils adapter
      registerBackendUtilsAdapter(adapter);

      // Call the getWebpageMetadata function
      const metadata = await getWebpageMetadata('https://ibguides.com');

      // Should return the data from the reigstered
      // adapter's 'getWebpageMetadata' method.
      expect(metadata.title).toBe('IB Guides');
    });
  });

  describe('unregisterBackendUtilsAdapter', () => {
    it('unregisters a backend utils adapter', async () => {
      // Register a backend utils adapter
      registerBackendUtilsAdapter(adapter);
      // Unregister the backend utils adapter
      unregisterBackendUtilsAdapter();

      // Call the getWebpageMetadata function, should
      // throw a `AdapterNotRegisteredError`.
      expect(() =>
        getWebpageMetadata('https://ibguides.com'),
      ).rejects.toThrowError(AdapterNotRegisteredError);
    });
  });

  describe('getWebpageMedata', () => {
    it('throws if there is no registered adapter', () => {
      // Call without a registered adapter, should
      // throw a `AdapterNotRegisteredError`.
      expect(() =>
        getWebpageMetadata('https://ibguides.com'),
      ).rejects.toThrowError(AdapterNotRegisteredError);
    });

    it('throws if the URL is invalid', () => {
      // Call with an invalid URL, should
      // throw a `ValidationError`.
      // @ts-expect-error Testing invalid input
      expect(() => getWebpageMetadata(1234)).rejects.toThrowError(
        InvalidParameterError,
      );
    });

    it("calls the registered adapter's `getWebpageMedata` method", async () => {
      // Register a backend utils adapter
      registerBackendUtilsAdapter(adapter);

      // Call the getWebpageMetadata function
      const metadata = await getWebpageMetadata('https://ibguides.com');

      // Should return the result from the adapter's
      // 'getWebpageMetadata' method.
      expect(metadata.title).toBe('IB Guides');
    });
  });
});
