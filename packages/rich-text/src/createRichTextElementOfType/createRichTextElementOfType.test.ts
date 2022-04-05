import { registerRichTextElementType } from '../registerRichTextElementType';
import { setup, cleanup, core, paragraphElementConfig } from '../test-utils';
import {
  RichTextBlockElementConfig,
  RichTextInlineElementConfig,
} from '../types';
import { getAllRichTextElements } from '../getAllRichTextElements';
import { createRichTextElementOfType } from './createRichTextElementOfType';
import { RichTextElementTypeNotRegisteredError } from '../errors';
import { DataInsert } from '@minddrop/core';

const dataInsert: DataInsert = {
  action: 'insert',
  types: ['text/plain'],
  data: { 'text/plain': 'Plain text data' },
};

// A test block level element config
const blockConfig: RichTextBlockElementConfig = {
  type: 'block-element',
  level: 'block',
  component: paragraphElementConfig.component,
  create: (dataInsert) => ({
    type: 'block-element',
    children: [
      { text: dataInsert ? dataInsert.data['text/plain'] : 'Hello world' },
    ],
  }),
};

// A test inline level element config
const inlineConfig: RichTextInlineElementConfig = {
  type: 'inline-element',
  level: 'inline',
  component: paragraphElementConfig.component,
  create: (fragment) => ({
    type: 'inline-element',
    children: fragment || [{ text: 'Hello world' }],
  }),
};

// A test block level element config which does not
// have a `create` method.
const noCreateBlockConfig: RichTextBlockElementConfig = {
  type: 'no-create-block-element',
  level: 'block',
  component: paragraphElementConfig.component,
};

// A test inline level element config which does not
// have a `create` method.
const noCreateInlineConfig: RichTextInlineElementConfig = {
  type: 'no-create-inline-element',
  level: 'inline',
  component: paragraphElementConfig.component,
};

describe('createRichTextElementOfType', () => {
  beforeEach(() => {
    setup();

    // Register the test block level element config
    registerRichTextElementType(core, blockConfig);
    // Register the test inline level element config
    registerRichTextElementType(core, inlineConfig);
    // Register the test no-create block level element config
    registerRichTextElementType(core, noCreateBlockConfig);
    // Register the test no-create inline level element config
    registerRichTextElementType(core, noCreateInlineConfig);
  });

  afterEach(cleanup);

  it('throws if the element type is not registered', () => {
    // Attempt to create an element of an unregistered type.
    // Should throw a `RichTextElementTypeNotRegisteredError`.
    expect(() =>
      createRichTextElementOfType(core, 'not-registered'),
    ).toThrowError(RichTextElementTypeNotRegisteredError);
  });

  describe('block level element', () => {
    describe('without data', () => {
      it("creates an element using the config's `create` method", () => {
        // Create a 'block-element'
        createRichTextElementOfType(core, 'block-element');

        // Get all elements of type 'block-element' (there should
        // only be one, the one created above).
        const elements = getAllRichTextElements({ type: ['block-element'] });

        // Should have created the element
        expect(Object.values(elements).length).toBe(1);
        // Should have the default content
        expect(Object.values(elements)[0].children).toEqual([
          { text: 'Hello world' },
        ]);
      });

      it('returns the new element', () => {
        // Create a 'block-element'
        const element = createRichTextElementOfType(core, 'block-element');

        // Should be a 'block-element'
        expect(element.type).toBe('block-element');
        // Should have the default content
        expect(element.children).toEqual([{ text: 'Hello world' }]);
      });

      it('creates an element for which the config has no `create` method', () => {
        // Create a 'no-create-block-element'
        const element = createRichTextElementOfType(
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
      it('passes the data insert to the `create` method', () => {
        // Create a 'block-element' with a DataInsert as data
        const element = createRichTextElementOfType(
          core,
          'block-element',
          dataInsert,
        );

        // Should have the inserted plain text content
        expect(element.children).toEqual([{ text: 'Plain text data' }]);
      });

      it('ignores data if it is a RichTextFragment', () => {
        // Create a 'block-element' with a RichTextFragment as data
        const element = createRichTextElementOfType(core, 'block-element', [
          { text: 'Rich text' },
        ]);
        // Should have the default content
        expect(element.children).toEqual([{ text: 'Hello world' }]);
      });

      it('ignores data if the element has no `create` method', () => {
        // Create a 'no-create-block-element'
        const element = createRichTextElementOfType(
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
      it("creates an element using the config's `create` method", () => {
        // Create a 'inline-element'
        createRichTextElementOfType(core, 'inline-element');

        // Get all elements of type 'inline-element' (there should
        // only be one, the one created above).
        const elements = getAllRichTextElements({ type: ['inline-element'] });

        // Should have created the element
        expect(Object.values(elements).length).toBe(1);
        // Should have the default content
        expect(Object.values(elements)[0].children).toEqual([
          { text: 'Hello world' },
        ]);
      });

      it('returns the new element', () => {
        // Create a 'inline-element'
        const element = createRichTextElementOfType(core, 'inline-element');

        // Should be a 'inline-element'
        expect(element.type).toBe('inline-element');
        // Should have the default content
        expect(element.children).toEqual([{ text: 'Hello world' }]);
      });

      it('ignores data if the element has no `create` method', () => {
        // Create a 'no-create-inline-element'
        const element = createRichTextElementOfType(
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
      it('passes the fragment to the `create` method', () => {
        // Create a 'inline-element' with a RichTextFragment as data
        const element = createRichTextElementOfType(core, 'inline-element', [
          { text: 'Fragment text' },
        ]);

        // Should have the inserted plain text content
        expect(element.children).toEqual([{ text: 'Fragment text' }]);
      });

      it('ignores data if it is a DataInsert', () => {
        // Create a 'inline-element' with a DataInsert as data
        const element = createRichTextElementOfType(core, 'inline-element', {
          action: 'insert',
          types: ['text/plain'],
          data: { 'text/plain': 'Plain text data' },
        });

        // Should have the default content
        expect(element.children).toEqual([{ text: 'Hello world' }]);
      });

      it('ignores data if the element has no `create` method', () => {
        // Create a 'no-create-inline-element'
        const element = createRichTextElementOfType(
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
