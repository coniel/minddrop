import { Files, FILES_TEST_DATA } from '@minddrop/files';
import {
  setup,
  cleanup,
  core,
  headingElement1,
  headingElement2,
} from '../test-utils';
import { addFilesToRichTextElement } from '../addFilesToRichTextElement';
import { removeFilesFromRichTextElement } from './removeFilesFromRichTextElement';
import { getRichTextElement } from '../getRichTextElement';

const { imageFileRef } = FILES_TEST_DATA;

describe('removeFilesFromRichTextElement', () => {
  beforeEach(() => {
    setup();

    // Add a file to an element
    addFilesToRichTextElement(core, headingElement1.id, [imageFileRef.id]);
    // Add the same file to a second element so that it doesn't
    // get deleted when the first element is removed as a parent.
    addFilesToRichTextElement(core, headingElement2.id, [imageFileRef.id]);
  });

  afterEach(cleanup);

  it('removes the file IDs from the element', () => {
    // Remove a file from an element
    removeFilesFromRichTextElement(core, headingElement1.id, [imageFileRef.id]);

    // Get the element from the store
    const element = getRichTextElement(headingElement1.id);

    // Element should no longer contain the file ID
    expect(element.files).not.toContain(imageFileRef.id);
  });

  it('returns the updated element', () => {
    // Remove a file from an element
    const element = removeFilesFromRichTextElement(core, headingElement1.id, [
      imageFileRef.id,
    ]);

    // Returned element should not contain the file ID
    expect(element.files).not.toContain(imageFileRef.id);
  });

  it('removes the element as a parent from the files', () => {
    // Remove an element from a file
    removeFilesFromRichTextElement(core, headingElement1.id, [imageFileRef.id]);

    // Get the updated file reference
    const fileReference = Files.get(imageFileRef.id);

    // File reference should no longer have the element as a parent
    expect(fileReference.attachedTo).not.toContain(headingElement1.id);
  });

  it('dispatches a `rich-text-elements:remove-files` event', (done) => {
    // Listen to 'rich-text-elements:remove-files' events
    core.addEventListener('rich-text-elements:remove-files', (payload) => {
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

    // Remove a file from an element
    removeFilesFromRichTextElement(core, headingElement1.id, [imageFileRef.id]);
  });
});
