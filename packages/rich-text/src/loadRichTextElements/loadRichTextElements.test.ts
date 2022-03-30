import { generateId } from '@minddrop/utils';
import {
  setup,
  cleanup,
  headingElement1,
  paragraphElement1,
  core,
} from '../test-utils';
import { getRichTextElements } from '../getRichTextElements';
import { loadRichTextElements } from './loadRichTextElements';
import { RichTextElementNotFoundError } from '../errors';

// The elements to load
const elements = [
  { ...headingElement1, id: generateId() },
  { ...paragraphElement1, id: generateId() },
];

describe('loadRichTextElements', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads the elements into the store', () => {
    // Load some elements
    loadRichTextElements(core, elements);

    // The elements should be in the store (should not throw
    // a `RichTextElementsNotFoundError`).
    expect(() =>
      getRichTextElements(elements.map((element) => element.id)),
    ).not.toThrowError(RichTextElementNotFoundError);
  });

  it('dispatches a `rich-text-elements:load` event', (done) => {
    // Listen to 'rich-text-elements:load' events
    core.addEventListener('rich-text-elements:load', (payload) => {
      // Payload data should be the loaded elements
      expect(payload.data).toEqual(elements);
      done();
    });

    // Load some elements
    loadRichTextElements(core, elements);
  });
});
