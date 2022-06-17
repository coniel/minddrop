import { FileReference } from '@minddrop/files';
import { FileDownloadData } from '@minddrop/backend-utils';

export interface DesktopFileStorageAdapter {
  getUrl(id: string): string;
  save(file: File, fileReference: FileReference): Promise<void>;
  download(url: string): Promise<File>;
}

/**
 * Download file payloads
 */

export interface DownloadFileRequestPayload {
  eventId: string;
  url: string;
}

export interface DownloadFileSuccessPayload {
  eventId: string;
  base64: string;
  metadata: FileDownloadData['metadata'];
}

export interface DownloadFileErrorPayload {
  eventId: string;
  error: string;
}

/**
 * Save file payloads
 */

export interface SaveFileRequestPayload {
  eventId: string;
  base64: string;
}

export interface SaveFileSuccessPayload {
  eventId: string;
}

export interface SaveFileErrorPayload {
  eventId: string;
  error: string;
}
