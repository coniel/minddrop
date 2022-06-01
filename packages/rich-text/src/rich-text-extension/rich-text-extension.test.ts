import { onDisable, onRun } from './rich-text-extension';
import {
  setup,
  cleanup,
  core,
  headingElement1,
  paragraphElementConfig,
  richTextDocument1,
} from '../test-utils';
import { RichTextDocuments } from '../RichTextDocuments';
import { RichTextElements } from '../RichTextElements';
import { Resources, ResourceTypeNotRegisteredError } from '@minddrop/resources';

describe('rich text extension', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('onRun', () => {
    it('registers the `rich-text:element` resource', () => {
      // Run the extension
      onRun(core);

      // Should register the 'rich-text:element' resource
      expect(Resources.get('rich-text:element')).toBeDefined();
    });

    it('registers the `rich-text:document` resource', () => {
      // Run the extension
      onRun(core);

      // Should register the 'rich-text:document' resource
      expect(Resources.get('rich-text:document')).toBeDefined();
    });
  });

  describe('onDisable', () => {
    beforeEach(() => onRun(core));

    it('unregisters the `rich-text:element` resource', () => {
      // Disable the extension
      onDisable(core);

      // Should unregister the 'rich-text:element' resource
      expect(Resources.get('rich-text:element')).toBeUndefined();
    });

    it('unregisters the `rich-text:document` resource', () => {
      // Disable the extension
      onDisable(core);

      // Should unregister the 'rich-text:document' resource
      expect(Resources.get('rich-text:document')).toBeUndefined();
    });

    it('clears registered rich text element types', () => {
      // Register a test rich text element types
      RichTextElements.register(core, paragraphElementConfig);

      // Disable the exension
      onDisable(core);

      // Rich text elements type store should have been cleared
      expect(() =>
        RichTextElements.getTypeConfig(paragraphElementConfig.type),
      ).toThrowError(ResourceTypeNotRegisteredError);
    });

    it('clears the rich text elements store', () => {
      // Load a rich text element into the store
      RichTextElements.store.load(core, [headingElement1]);

      // Disable the exension
      onDisable(core);

      // Rich text elements store should have been cleared
      expect(RichTextElements.getAll()).toEqual({});
    });

    it('clears the rich text documents store', () => {
      // Load a rich text document into the store
      RichTextDocuments.store.load(core, [richTextDocument1]);

      // Disable the exension
      onDisable(core);

      // Rich text documents store should have been cleared
      expect(RichTextDocuments.getAll()).toEqual({});
    });

    it('clears all event listeners', () => {
      // Disable the extension
      onDisable(core);

      // There should no longer be any rich text related event listeners
      expect(core.hasEventListeners()).toBeFalsy();
    });
  });
});
