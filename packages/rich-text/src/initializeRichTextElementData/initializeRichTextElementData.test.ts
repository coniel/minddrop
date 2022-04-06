import { DataInsert } from '@minddrop/core';
import { registerRichTextElementType } from '../registerRichTextElementType';
import { setup, cleanup, core, paragraphElementConfig } from '../test-utils';
import {
  RichTextBlockElement,
  RichTextBlockElementConfig,
  RichTextFragment,
  RichTextInlineElement,
  RichTextInlineElementConfig,
} from '../types';
import { RichTextElementTypeNotRegisteredError } from '../errors';
import { initializeRichTextElementData } from './initializeRichTextElementData';

const dataInsert: DataInsert = {
  action: 'insert',
  types: ['text/plain'],
  data: { 'text/plain': 'Plain text data' },
};

interface ElementData {
  customProperty: string;
  children?: RichTextFragment;
}

// A test block level element config
const blockConfig: RichTextBlockElementConfig<
  RichTextBlockElement,
  ElementData
> = {
  type: 'block-element',
  level: 'block',
  component: paragraphElementConfig.component,
  initializeData: (dataInsert) => ({
    customProperty: 'foo',
    children: [
      { text: dataInsert ? dataInsert.data['text/plain'] : 'Hello world' },
    ],
  }),
};

// A test inline level element config
const inlineConfig: RichTextInlineElementConfig<
  RichTextInlineElement,
  ElementData
> = {
  type: 'inline-element',
  level: 'inline',
  component: paragraphElementConfig.component,
  initializeData: (fragment) => ({
    customProperty: 'foo',
    children: fragment || [{ text: 'Hello world' }],
  }),
};

// A test block level element config which does not
// have a `initializeData` method.
const noCreateBlockConfig: RichTextBlockElementConfig = {
  type: 'no-create-block-element',
  level: 'block',
  component: paragraphElementConfig.component,
};

// A test inline level element config which does not
// have a `initializeData` method.
const noCreateInlineConfig: RichTextInlineElementConfig = {
  type: 'no-create-inline-element',
  level: 'inline',
  component: paragraphElementConfig.component,
};

describe('initializeRichTextElementData', () => {
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
    expect(() => initializeRichTextElementData('not-registered')).toThrowError(
      RichTextElementTypeNotRegisteredError,
    );
  });

  describe('block level element', () => {
    describe('without data', () => {
      it("initializes the data using the config's `initializeData` method", () => {
        // Create data for a 'block-element'
        const data =
          initializeRichTextElementData<ElementData>('block-element');

        // Should have the data from `initializeData`
        expect(data.customProperty).toBe('foo');
      });

      it('supports element types with no `initializeData` method', () => {
        // Create a 'no-create-block-element'
        const data = initializeRichTextElementData('no-create-block-element');

        // Should return an empty object
        expect(data).toEqual({});
      });
    });

    describe('with data', () => {
      it('passes the data insert to the `initializeData` method', () => {
        // Create a 'block-element' with a DataInsert as data
        const data = initializeRichTextElementData<ElementData>(
          'block-element',
          dataInsert,
        );

        // Should have the inserted plain text content
        expect(data.children).toEqual([{ text: 'Plain text data' }]);
      });

      it('ignores data if it is a RichTextFragment', () => {
        // Create a 'block-element' with a RichTextFragment as data
        const data = initializeRichTextElementData<ElementData>(
          'block-element',
          [{ text: 'Rich text' }],
        );

        // Should have the default content
        expect(data.children).toEqual([{ text: 'Hello world' }]);
      });

      it('ignores data if the element has no `initializeData` method', () => {
        // Create a 'no-create-block-element'
        const data = initializeRichTextElementData(
          'no-create-block-element',
          dataInsert,
        );

        // Should return an empty object
        expect(data).toEqual({});
      });
    });
  });

  describe('inline level element', () => {
    describe('without data', () => {
      it("initializes the data using the config's `initializeData` method", () => {
        // Create the data for a 'inline-element'
        const data =
          initializeRichTextElementData<ElementData>('inline-element');

        // Should have the data from `initializeData`
        expect(data.customProperty).toBe('foo');
      });

      it('supports elements types with no `initializeData` method', () => {
        // Create a 'no-create-inline-element'
        const data = initializeRichTextElementData('no-create-inline-element');

        // Should return an empty object
        expect(data).toEqual({});
      });
    });

    describe('with data', () => {
      it('passes the fragment to the `initializeData` method', () => {
        // Create a 'inline-element' with a RichTextFragment as data
        const data = initializeRichTextElementData<ElementData>(
          'inline-element',
          [{ text: 'Fragment text' }],
        );

        // Should have the inserted plain text content
        expect(data.children).toEqual([{ text: 'Fragment text' }]);
      });

      it('ignores data if it is a DataInsert', () => {
        // Create a 'inline-element' with a DataInsert as data
        const data = initializeRichTextElementData<ElementData>(
          'inline-element',
          {
            action: 'insert',
            types: ['text/plain'],
            data: { 'text/plain': 'Plain text data' },
          },
        );

        // Should have the default content
        expect(data.children).toEqual([{ text: 'Hello world' }]);
      });

      it('ignores data if the element has no `initializeData` method', () => {
        // Create a 'no-create-inline-element'
        const data = initializeRichTextElementData('no-create-inline-element', [
          { text: 'Fragment text' },
        ]);

        // Should return an empty object
        expect(data).toEqual({});
      });
    });
  });
});
