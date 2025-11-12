import { AudioDataType } from './AudioDataType';
import { FileDataType } from './FileDataType';
import { ImageDataType } from './ImageDataType';
import { ObjectDataType } from './ObjectDataType';
import { PdfDataType } from './PdfDataType';
import { UrlDataType } from './UrlDataType';
import { VideoDataType } from './VideoDataType';

export * from './AudioDataType';
export * from './ObjectDataType';
export * from './FileDataType';
export * from './ImageDataType';
export * from './PdfDataType';
export * from './UrlDataType';
export * from './VideoDataType';

export const coreDataTypes = [
  AudioDataType,
  FileDataType,
  ImageDataType,
  PdfDataType,
  UrlDataType,
  VideoDataType,
  ObjectDataType,
];
