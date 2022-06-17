import { WebpageMetadata } from '@minddrop/utils';

export interface WebpageMetadataRequestPayload {
  eventId: string;
  url: string;
}

export interface WebpageMetadataSuccessPayload {
  eventId: string;
  metadata: WebpageMetadata;
}

export interface WebpageMetadataErrorPayload {
  eventId: string;
  error: string;
}
