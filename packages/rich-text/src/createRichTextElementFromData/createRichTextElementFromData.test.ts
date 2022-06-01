import { setup, cleanup, core, paragraphElementConfig } from '../test-utils';
import { RTBlockElementConfig, RTInlineElementConfig } from '../types';
import { createRichTextElementFromData } from './createRichTextElementFromData';
import { DataInsert } from '@minddrop/core';
import { RTElementsResource } from '../RTElementsResource';

const dataInsert: DataInsert = {
  action: 'insert',
  types: ['text/plain'],
  data: { 'text/plain': 'Plain text data' },
};

interface ElementData {
  foo?: string;
}

// A test block level element config
const blockConfig: RTBlockElementConfig<ElementData> = {
  type: 'block-element',
  level: 'block',
  dataSchema: { foo: { type: 'string' } },
  component: paragraphElementConfig.component,
  initializeData: (dataInsert) => ({
    children: [
      { text: dataInsert ? dataInsert.data['text/plain'] : 'Hello world' },
    ],
  }),
};

// A test inline level element config
const inlineConfig: RTInlineElementConfig<ElementData> = {
  type: 'inline-element',
  level: 'inline',
  dataSchema: { foo: { type: 'string' } },
  component: paragraphElementConfig.component,
  initializeData: (fragment) => ({
    children: fragment
      ? fragment.map((part) => {
          if ('type' in part) {
            return part.id;
          }

          return part;
        })
      : [{ text: 'Hello world' }],
  }),
};

// A test block level element config which does not
// have a `initializeData` method.
const noCreateBlockConfig: RTBlockElementConfig<ElementData> = {
  type: 'no-create-block-element',
  level: 'block',
  dataSchema: { foo: { type: 'string' } },
  component: paragraphElementConfig.component,
};

// A test inline level element config which does not
// have a `initializeData` method.
const noCreateInlineConfig: RTInlineElementConfig<ElementData> = {
  type: 'no-create-inline-element',
  level: 'inline',
  dataSchema: { foo: { type: 'string' } },
  component: paragraphElementConfig.component,
};

describe('createRichTextElementFromData', () => {
  beforeEach(() => {
    setup();

    // Register the test block level element config
    RTElementsResource.register(core, blockConfig);
    // Register the test inline level element config
    RTElementsResource.register(core, inlineConfig);
    // Register the test no-create block level element config
    RTElementsResource.register(core, noCreateBlockConfig);
    // Register the test no-create inline level element config
    RTElementsResource.register(core, noCreateInlineConfig);
  });

  afterEach(cleanup);

  describe('block level element', () => {
    describe('without data', () => {
      it("creates an element using the config's `initializeData` method", () => {
        // Create a 'block-element'
        createRichTextElementFromData(core, 'block-element');

        // Get all elements of type 'block-element' (there should
        // only be one, the one created above).
        const elements = RTElementsResource.getAll();
        const blockElements = RTElementsResource.filter(elements, {
          type: ['block-element'],
        });

        // Should have created the element
        expect(Object.values(blockElements).length).toBe(1);
        // Should have the default content
        expect(Object.values(blockElements)[0].children).toEqual([
          { text: 'Hello world' },
        ]);
      });

      it('returns the new element', () => {
        // Create a 'block-element'
        const element = createRichTextElementFromData(core, 'block-element');

        // Should be a 'block-element'
        expect(element.type).toBe('block-element');
        // Should have the default content
        expect(element.children).toEqual([{ text: 'Hello world' }]);
      });

      it('creates an element for which the config has no `initializeData` method', () => {
        // Create a 'no-create-block-element'
        const element = createRichTextElementFromData(
          core,
          'no-create-block-element',
        );

        // Should be a 'no-create-block-element'
        expect(element.type).toBe('no-create-block-element');
        // Should have an empty text node as its children
        expect(element.children).toEqual([{ text: '' }]);
      });
    });

    describe('with data', () => {
      it('passes the data insert to the `initializeData` method', () => {
        // Create a 'block-element' with a DataInsert as data
        const element = createRichTextElementFromData(
          core,
          'block-element',
          dataInsert,
        );

        // Should have the inserted plain text content
        expect(element.children).toEqual([{ text: 'Plain text data' }]);
      });

      it('ignores data if it is a RTFragment', () => {
        // Create a 'block-element' with a RTFragment as data
        const element = createRichTextElementFromData(core, 'block-element', [
          { text: 'Rich text' },
        ]);
        // Should have the default content
        expect(element.children).toEqual([{ text: 'Hello world' }]);
      });

      it('ignores data if the element has no `initializeData` method', () => {
        // Create a 'no-create-block-element'
        const element = createRichTextElementFromData(
          core,
          'no-create-block-element',
          dataInsert,
        );

        // Should be a 'no-create-block-element'
        expect(element.type).toBe('no-create-block-element');
        // Should have an empty text node as its children
        expect(element.children).toEqual([{ text: '' }]);
      });
    });
  });

  describe('inline level element', () => {
    describe('without data', () => {
      it("creates an element using the config's `initializeData` method", () => {
        // Create a 'inline-element'
        createRichTextElementFromData(core, 'inline-element');

        // Get all elements of type 'inline-element' (there should
        // only be one, the one created above).
        const elements = RTElementsResource.getAll();
        const inlineElements = RTElementsResource.filter(elements, {
          type: ['inline-element'],
        });

        // Should have created the element
        expect(Object.values(inlineElements).length).toBe(1);
        // Should have the default content
        expect(Object.values(inlineElements)[0].children).toEqual([
          { text: 'Hello world' },
        ]);
      });

      it('returns the new element', () => {
        // Create a 'inline-element'
        const element = createRichTextElementFromData(core, 'inline-element');

        // Should be a 'inline-element'
        expect(element.type).toBe('inline-element');
        // Should have the default content
        expect(element.children).toEqual([{ text: 'Hello world' }]);
      });

      it('ignores data if the element has no `initializeData` method', () => {
        // Create a 'no-create-inline-element'
        const element = createRichTextElementFromData(
          core,
          'no-create-inline-element',
        );

        // Should be a 'no-create-inline-element'
        expect(element.type).toBe('no-create-inline-element');
        // Should have an empty text node as its children
        expect(element.children).toEqual([{ text: '' }]);
      });
    });

    describe('with data', () => {
      it('passes the fragment to the `initializeData` method', () => {
        // Create a 'inline-element' with a RTFragment as data
        const element = createRichTextElementFromData(core, 'inline-element', [
          { text: 'Fragment text' },
        ]);

        // Should have the inserted plain text content
        expect(element.children).toEqual([{ text: 'Fragment text' }]);
      });

      it('ignores data if it is a DataInsert', () => {
        // Create a 'inline-element' with a DataInsert as data
        const element = createRichTextElementFromData(core, 'inline-element', {
          action: 'insert',
          types: ['text/plain'],
          data: { 'text/plain': 'Plain text data' },
        });

        // Should have the default content
        expect(element.children).toEqual([{ text: 'Hello world' }]);
      });

      it('ignores data if the element has no `initializeData` method', () => {
        // Create a 'no-create-inline-element'
        const element = createRichTextElementFromData(
          core,
          'no-create-inline-element',
          [{ text: 'Fragment text' }],
        );

        // Should be a 'no-create-inline-element'
        expect(element.type).toBe('no-create-inline-element');
        // Should have an empty text node as its children
        expect(element.children).toEqual([{ text: '' }]);
      });
    });
  });
});
