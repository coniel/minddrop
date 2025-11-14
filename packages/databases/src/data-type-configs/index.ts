import { AudioDataType } from './AudioDataType';
import { FileDataType } from './FileDataType';
import { ImageDataType } from './ImageDataType';
import { ObjectDataType } from './ObjectDataType';
import { PdfDataType } from './PdfDataType';
import { SpaceDataType } from './SpaceDataType';
import { UrlDataType } from './UrlDataType';
import { VideoDataType } from './VideoDataType';
import { ViewDataType } from './ViewDataType';

export * from './AudioDataType';
export * from './ObjectDataType';
export * from './FileDataType';
export * from './ImageDataType';
export * from './PdfDataType';
export * from './UrlDataType';
export * from './VideoDataType';
export * from './ViewDataType';
export * from './SpaceDataType';

export const coreDataTypes = [
  ObjectDataType,
  UrlDataType,
  ImageDataType,
  PdfDataType,
  AudioDataType,
  VideoDataType,
  FileDataType,
  ViewDataType,
  SpaceDataType,
];
