import { Files, FILES_TEST_DATA } from '@minddrop/files';
import { getRichTextElement } from '../getRichTextElement';
import { setup, cleanup, core, headingElement1 } from '../test-utils';
import { addFilesToRichTextElement } from './addFilesToRichTextElement';

const { imageFileRef } = FILES_TEST_DATA;

describe('addFilesToRichTextElement', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the file IDs to the element', () => {
    // Add a file to an element
    addFilesToRichTextElement(core, headingElement1.id, [imageFileRef.id]);

    // Get the element from the store
    const element = getRichTextElement(headingElement1.id);

    // Element should contain the file ID
    expect(element.files).toContain(imageFileRef.id);
  });

  it('returns the updated element', () => {
    // Add files to an element
    const element = addFilesToRichTextElement(core, headingElement1.id, [
      imageFileRef.id,
    ]);

    // Returned element should contain the file ID
    expect(element.files).toContain(imageFileRef.id);
  });

  it('adds the element as a parent on the files', () => {
    // Add a file to an element
    addFilesToRichTextElement(core, headingElement1.id, [imageFileRef.id]);

    // Get the file reference
    const fileReference = Files.get(imageFileRef.id);

    // File reference should have the elemen as a parent
    expect(fileReference.attachedTo).toContain(headingElement1.id);
  });

  it('dispatches a `rich-text-elements:add-files` event', (done) => {
    // Listen to 'rich-text-elements:add-files' events
    core.addEventListener('rich-text-elements:add-files', (payload) => {
      // Get the updated element
      const element = getRichTextElement(headingElement1.id);
      // Get the updated file references
      const fileReferences = Files.get([imageFileRef.id]);

      // Payload data should contain the updated element
      expect(payload.data.element).toEqual(element);
      // Payload data should contain the updated file references as a map
      expect(payload.data.files).toEqual(fileReferences);
      done();
    });

    // Add a file to an element
    addFilesToRichTextElement(core, headingElement1.id, [imageFileRef.id]);
  });
});
