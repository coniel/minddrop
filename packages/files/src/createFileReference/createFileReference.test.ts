import { imageFile, textFile } from '@minddrop/test-utils';
import { InvalidParameterError } from '@minddrop/utils';
import { FileReferencesResource } from '../FileReferencesResource';
import { cleanup, core } from '../test-utils';
import { createFileReference } from './createFileReference';

describe('createFileReference', () => {
  afterEach(cleanup);

  it('throws if the file is invalid', () => {
    // Attempt to create a file reference with an invalid file.
    // Should throw an `InvalidParameterError`.
    // @ts-ignore
    expect(() => createFileReference(core, {})).rejects.toThrowError(
      InvalidParameterError,
    );
  });

  it('creates a file reference', async () => {
    // Create a file reference
    const fileReference = await createFileReference(core, textFile);

    // Should create the file reference
    expect(FileReferencesResource.get(fileReference.id)).toEqual(fileReference);
  });

  it('adds dimensions to image files', async () => {
    // Create a file reference for an image file
    const fileReference = await createFileReference(core, imageFile);

    // File reference should contain the image dimensions
    expect(fileReference.dimensions).toBeDefined();
  });
});
