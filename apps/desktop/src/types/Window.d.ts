import { ResourceStorageAdapterConfig } from '@minddrop/resources';
import { BackendUtilsApi } from '@minddrop/utils';
import { DesktopFileStorageAdapter } from './DesktopFileStorageAdapter.types';

export declare global {
  interface Window {
    ResourceStorageAdapter: ResourceStorageAdapterConfig;
    FileStorageAdapter: DesktopFileStorageAdapter;
    BackendUtilsAdapter: BackendUtilsApi;
  }
}
