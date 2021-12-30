import { imageFile, textFile } from '@minddrop/test-utils';
import { generateFileReference } from './generateFileReference';

describe('generateFileReference', () => {
  it('gets the appropriate data from the file', async () => {
    const result = await generateFileReference(textFile);

    expect(result.type).toBe('text/plain');
    expect(result.name).toBe('text.txt');
    expect(result.size).toBe(56);
  });

  it('adds dimensions to image files', async () => {
    const result = await generateFileReference(imageFile);

    expect(result.dimensions).toBeDefined();
  });

  it('accepts attachedTo values', async () => {
    const result = await generateFileReference(imageFile, ['resource-id']);

    expect(result.attachedTo).toEqual(['resource-id']);
  });
});
