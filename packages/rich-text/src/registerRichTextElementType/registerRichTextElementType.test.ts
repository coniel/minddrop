import { cleanup, core, headingElementConfig } from '../test-utils';
import { useRichTextStore } from '../useRichTextStore';
import { RichTextElementTypeAlreadyRegisteredError } from '../errors';
import { registerRichTextElementType } from './registerRichTextElementType';

describe('registerRichTextElementType', () => {
  afterEach(cleanup);

  it('adds the config to the rich text store', () => {
    // Register a new element type
    registerRichTextElementType(core, headingElementConfig);

    // Config should be added to the rich text store
    expect(
      useRichTextStore.getState().elementConfigs[headingElementConfig.type],
    ).toBeDefined();
  });

  it('throws a `RichTextElementTypeAlreadyRegistered` error if the type is already registered', () => {
    // Register a new element type
    registerRichTextElementType(core, headingElementConfig);

    // Registering the same type again should throw an error
    expect(() =>
      registerRichTextElementType(core, headingElementConfig),
    ).toThrowError(RichTextElementTypeAlreadyRegisteredError);
  });

  it('dispatches a `rich-text-elements:register` event', (done) => {
    // Listen to 'rich-text-elements:register' events
    core.addEventListener('rich-text-elements:register', (payload) => {
      // Payload data should be the registered config
      expect(payload.data).toEqual(headingElementConfig);
      done();
    });

    // Register a new element type
    registerRichTextElementType(core, headingElementConfig);
  });
});
