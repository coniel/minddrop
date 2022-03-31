import { registerRichTextElementType } from '../registerRichTextElementType';
import { setup, cleanup, core, paragraphElementConfig } from '../test-utils';
import {
  RichTextBlockElementConfig,
  RichTextInlineElementConfig,
} from '../types';
import { getAllRichTextElements } from '../getAllRichTextElements';
import { createRichTextElementOfType } from './createRichTextElementOfType';
import { RichTextElementTypeNotRegisteredError } from '../errors';

// A test block level element config
const blockConfig: RichTextBlockElementConfig = {
  type: 'block-element',
  level: 'block',
  component: paragraphElementConfig.component,
  create: (core, dataInsert) => ({
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
  create: (core, fragment) => ({
    type: 'inline-element',
    children: fragment || [{ text: 'Hello world' }],
  }),
};

describe('createRichTextElementOfType', () => {
  beforeEach(() => {
    setup();

    // Register the test block level element config
    registerRichTextElementType(core, blockConfig);
    // Register the test inline level element config
    registerRichTextElementType(core, inlineConfig);
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

    it('passes the data insert to the `create` method', () => {
      // Create a 'block-element' with a DataInsert as data
      const element = createRichTextElementOfType(core, 'block-element', {
        action: 'insert',
        types: ['text/plain'],
        data: { 'text/plain': 'Plain text data' },
      });

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
  });

  describe('inline level element', () => {
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
  });
});
