import { Files, FILES_TEST_DATA } from '@minddrop/files';
import {
  setup,
  cleanup,
  core,
  headingElement1,
  headingElement2,
  paragraphElement1,
} from '../test-utils';
import { addFilesToRichTextElement } from '../addFilesToRichTextElement';
import { replaceFilesInRichTextElement } from './replaceFilesInRichTextElement';
import { getRichTextElement } from '../getRichTextElement';

const { imageFileRef, imageFileRef2 } = FILES_TEST_DATA;

describe('replaceFilesInRichTextElement', () => {
  beforeEach(() => {
    setup();

    // Add a file to an element
    addFilesToRichTextElement(core, headingElement1.id, [imageFileRef2.id]);
    // Add the same file to a second element so that it doesn't
    // get deleted when the first element is removed as a parent.
    addFilesToRichTextElement(core, headingElement2.id, [imageFileRef2.id]);
  });

  afterEach(cleanup);

  it('replaces the files in an element', () => {
    // Replace the files in an element
    replaceFilesInRichTextElement(core, headingElement1.id, [imageFileRef.id]);

    // Get the element from the store
    const element = getRichTextElement(headingElement1.id);

    // Element should no longer contain the original file ID
    expect(element.files).not.toContain(imageFileRef2.id);
    // Element should contain the added file ID
    expect(element.files).toContain(imageFileRef.id);
  });

  it('returns the updated element', () => {
    // Replace the files in an element
    const element = replaceFilesInRichTextElement(core, headingElement1.id, [
      imageFileRef.id,
    ]);

    // Element should no longer contain the original file ID
    expect(element.files).not.toContain(imageFileRef2.id);
    // Element should contain the added file ID
    expect(element.files).toContain(imageFileRef.id);
  });

  it('removes the element as a parent from the removed files', () => {
    // Replace the files in an element
    replaceFilesInRichTextElement(core, headingElement1.id, [imageFileRef.id]);

    // Get the updated removed file reference
    const fileReference = Files.get(imageFileRef2.id);

    // File reference should no longer have the element as a parent
    expect(fileReference.attachedTo).not.toContain(headingElement1.id);
  });

  it('adds the element as a parent on the added files', () => {
    // Replace the files in an element
    replaceFilesInRichTextElement(core, headingElement1.id, [imageFileRef.id]);

    // Get the updated added file reference
    const fileReference = Files.get(imageFileRef.id);

    // File reference should have the elemen as a parent
    expect(fileReference.attachedTo).toContain(headingElement1.id);
  });

  it('works with an element which has no current files', () => {
    // Replace the files in an element which contains no files
    const element = replaceFilesInRichTextElement(core, paragraphElement1.id, [
      imageFileRef.id,
    ]);
    // Element should contain the added file ID
    expect(element.files).toContain(imageFileRef.id);
  });

  it('dispatches a `rich-text-elements:replace-files` event', (done) => {
    // Listen to 'rich-text-elements:remove-replace' events
    core.addEventListener('rich-text-elements:replace-files', (payload) => {
      // Get the updated element
      const element = getRichTextElement(headingElement1.id);
      // Get the updated removed file references
      const removedFiles = Files.get([imageFileRef2.id]);
      // Get the updated added file references
      const addedFiles = Files.get([imageFileRef.id]);

      // Payload data should contain the updated element
      expect(payload.data.element).toEqual(element);
      // Payload data should contain the updated removed file references as a map
      expect(payload.data.removedFiles).toEqual(removedFiles);
      // Payload data should contain the updated added file references as a map
      expect(payload.data.addedFiles).toEqual(addedFiles);
      done();
    });

    // Replace the files in an element
    replaceFilesInRichTextElement(core, headingElement1.id, [imageFileRef.id]);
  });
});
