import { Fs } from '@minddrop/file-system';
import { uuid } from '@minddrop/utils';

/**
 * Generates a media file name from a source file name or path,
 * preserving its extension. The timestamp prefix makes file names
 * sort newest-last, and therefore newest-first when reversed.
 *
 * @param source - The source file name or path.
 * @returns The generated file name.
 */
export function generateMediaFileName(source: string): string {
  const baseName = `${Date.now()}-${uuid()}`;
  const extension = Fs.getExtension(source);

  // Files without an extension keep the bare base name
  if (!extension) {
    return baseName;
  }

  return Fs.addFileExtension(baseName, extension);
}
