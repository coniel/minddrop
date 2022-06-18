import { validateParameter } from '../validation';
import { AdapterNotRegisteredError } from '../errors';
import { BackendUtilsApi } from '../types';

const placeholderApi: BackendUtilsApi = {
  getWebpageMedata: () => {
    throw new AdapterNotRegisteredError('backend utils');
  },
};

let api: BackendUtilsApi = placeholderApi;

/**
 * Registers a backend utils API adapter
 * which allows backend utils to be called
 * from the frontend.
 *
 * @param adapter - A backend utils API adapter.
 */
export function registerBackendUtilsAdapter(adapter: BackendUtilsApi) {
  api = adapter;
}

/**
 * **Intended for use in tests only.**
 *
 * Unregisters the  backend utils API adapter
 * which allows backend utils to be called
 * from the frontend.
 */
export function unregisterBackendUtilsAdapter() {
  api = placeholderApi;
}

export const getWebpageMedata: BackendUtilsApi['getWebpageMedata'] = (url) => {
  // Ensure that the URL is a string
  validateParameter(
    { type: 'string', allowEmpty: false, required: true },
    'url',
    url,
  );

  // Call the adapter's `getWebpageMetadata` method
  return api.getWebpageMedata(url);
};
