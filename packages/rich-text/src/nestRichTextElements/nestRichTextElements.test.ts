import { ParentReferences } from '@minddrop/core';
import { contains } from '@minddrop/utils';
import { getRichTextElement } from '../getRichTextElement';
import { getRichTextElements } from '../getRichTextElements';
import {
  setup,
  cleanup,
  core,
  headingElement1,
  paragraphElement1,
  paragraphElement2,
} from '../test-utils';
import { RichTextBlockElement } from '../types';
import { nestRichTextElements } from './nestRichTextElements';

describe('nestRichTextElements', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the nested element IDs to the element', () => {
    // Nest a couple of elements
    nestRichTextElements(core, headingElement1.id, [
      paragraphElement1.id,
      paragraphElement2.id,
    ]);

    // Get the element from the store
    const element = getRichTextElement<RichTextBlockElement>(
      headingElement1.id,
    );

    // Element should have the nested elements
    expect(element.nestedElements).toContain(paragraphElement1.id);
    expect(element.nestedElements).toContain(paragraphElement2.id);
  });

  it('adds the element as a parent on the nested elements', () => {
    // Nest an element
    nestRichTextElements(core, headingElement1.id, [paragraphElement1.id]);

    // Get the nested element from the store
    const nestedElement = getRichTextElement(paragraphElement1.id);

    // The parent reference
    const parentReference = ParentReferences.generate(
      'rich-text-element',
      headingElement1.id,
    );

    // Nested element should have the element as a parent
    expect(contains(nestedElement.parents, [parentReference])).toBeTruthy();
  });

  it('returns the updated element', () => {
    // Nest an element
    const result = nestRichTextElements(core, headingElement1.id, [
      paragraphElement1.id,
    ]);

    // Get the element from the store
    const element = getRichTextElement(headingElement1.id);

    // Returned value should equal the updated element
    expect(result).toEqual(element);
  });

  it('dispatches a `rich-text-elements:nest` event', (done) => {
    // Listen to 'rich-text-elements:nest' events
    core.addEventListener('rich-text-elements:nest', (payload) => {
      // Get the updated element
      const element = getRichTextElement(headingElement1.id);
      // Get the updated nested elements
      const nestedElements = getRichTextElements([
        paragraphElement1.id,
        paragraphElement2.id,
      ]);

      // Event payload should contain the element
      expect(payload.data.element).toEqual(element);
      // Event payload should contain the nested elements as a map
      expect(payload.data.nestedElements).toEqual(nestedElements);
      done();
    });

    // Nest elements
    nestRichTextElements(core, headingElement1.id, [
      paragraphElement1.id,
      paragraphElement2.id,
    ]);
  });
});
