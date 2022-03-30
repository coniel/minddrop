import {
  setup,
  cleanup,
  headingElement1,
  paragraphElement1,
  paragraphElement2,
  core,
} from '../test-utils';
import { nestRichTextElements } from '../nestRichTextElements';
import { unnestRichTextElements } from './unnestRichTextElements';
import { getRichTextElement } from '../getRichTextElement';
import { RichTextBlockElement } from '../types';
import { arrayContainsObject } from '@minddrop/utils';
import { ParentReferences } from '@minddrop/core';
import { getRichTextElements } from '../getRichTextElements';

describe('unnestRichTextElements', () => {
  beforeEach(() => {
    setup();

    // Nest a couple of elements
    nestRichTextElements(core, headingElement1.id, [
      paragraphElement1.id,
      paragraphElement2.id,
    ]);
  });

  afterEach(cleanup);

  it('removes the nested element IDs from the element', () => {
    // Unnest elements
    unnestRichTextElements(core, headingElement1.id, [
      paragraphElement1.id,
      paragraphElement2.id,
    ]);

    // Get the element from the store
    const element = getRichTextElement<RichTextBlockElement>(
      headingElement1.id,
    );

    // Element should no longer contain the nested element IDs
    expect(element.nestedElements).not.toContain(paragraphElement1.id);
    expect(element.nestedElements).not.toContain(paragraphElement2.id);
  });

  it('removes the element as a parent from the nested elements', () => {
    // Unnest an element
    unnestRichTextElements(core, headingElement1.id, [paragraphElement1.id]);

    // Get the unnested element from the store
    const element = getRichTextElement(paragraphElement1.id);

    // The parent reference
    const parentReference = ParentReferences.generate(
      'rich-text-element',
      headingElement1.id,
    );

    // Unnested element should no longer have element as a parent
    expect(arrayContainsObject(element.parents, parentReference)).toBeFalsy();
  });

  it('returns the updated element', () => {
    // Unnest an element
    const result = unnestRichTextElements(core, headingElement1.id, [
      paragraphElement1.id,
    ]);

    // Get the element from the store
    const element = getRichTextElement(headingElement1.id);

    // Returned value should equal the updated element
    expect(result).toEqual(element);
  });

  it('dispatches a `rich-text-elements:unnest` event', (done) => {
    // Listen to 'rich-text-elements:unnest' events
    core.addEventListener('rich-text-elements:unnest', (payload) => {
      // Get the updated element
      const element = getRichTextElement(headingElement1.id);
      // Get the updated unnested elements
      const unnestedElements = getRichTextElements([
        paragraphElement1.id,
        paragraphElement2.id,
      ]);

      // Event payload should contain the element
      expect(payload.data.element).toEqual(element);
      // Event payload should contain the unnested elements as a map
      expect(payload.data.unnestedElements).toEqual(unnestedElements);
      done();
    });

    // Unnest elements
    unnestRichTextElements(core, headingElement1.id, [
      paragraphElement1.id,
      paragraphElement2.id,
    ]);
  });
});
