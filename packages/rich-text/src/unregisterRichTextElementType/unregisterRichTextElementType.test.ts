import { RichTextElementTypeNotRegisteredError } from '../errors';
import { setup, cleanup, core, headingElementConfig } from '../test-utils';
import { useRichTextStore } from '../useRichTextStore';
import { unregisterRichTextElementType } from './unregisterRichTextElementType';

describe('unregisterRichTextElementType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the element config from the rich text store', () => {
    // Unregister the element type
    unregisterRichTextElementType(core, headingElementConfig.type);

    // Element config should no longer be in the store
    expect(
      useRichTextStore.getState().elementConfigs[headingElementConfig.type],
    ).toBeUndefined();
  });

  it('throws a `RichTextElementTypeNotRegisteredError` if the type is not registered', () => {
    // Should throw an error
    expect(() =>
      unregisterRichTextElementType(core, 'missing-type'),
    ).toThrowError(RichTextElementTypeNotRegisteredError);
  });

  it('dispatches a `rich-text-elements:unregister` event', (done) => {
    // Listen to 'rich-text-elements:unregsiter' events
    core.addEventListener('rich-text-elements:unregister', (payload) => {
      // Payload data should be the unregistered config
      expect(payload.data).toEqual(headingElementConfig);
      done();
    });

    // Unregister the element type
    unregisterRichTextElementType(core, headingElementConfig.type);
  });
});
