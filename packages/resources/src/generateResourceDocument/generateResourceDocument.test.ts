import { generateResourceDocument } from './generateResourceDocument';

describe('generateResourceDocument', () => {
  it('adds the extensionApiVersion if present', () => {
    // Generate a document
    const document = generateResourceDocument<{}>(1, {}, 2);

    // Document should contain extensionApiVersion
    expect(document.extensionApiVersion).toBe(2);
  });
});
