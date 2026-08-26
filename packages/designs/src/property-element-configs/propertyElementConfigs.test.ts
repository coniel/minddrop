import { describe, expect, it } from 'vitest';
import { DefaultDesignTheme } from '../themes';
import {
  getPropertyElementConfig,
  getPropertyElementConfigs,
} from './registry';

describe('property element configs', () => {
  it('offers an element for every display property type', () => {
    const propertyTypes = getPropertyElementConfigs().map(
      (config) => config.propertyType,
    );

    expect(propertyTypes).toEqual([
      'title',
      'text',
      'number',
      'date',
      'select',
      'url',
      'image',
      'icon',
    ]);
  });

  it('binds each element to its own property type', () => {
    getPropertyElementConfigs().forEach((config) => {
      expect(config.bindsPropertyTypes).toContain(config.propertyType);
    });
  });

  it('names a default variant which exists', () => {
    getPropertyElementConfigs().forEach((config) => {
      const variantIds = config.variants.map((variant) => variant.id);

      expect(variantIds).toContain(config.defaultVariant);
    });
  });

  it('previews or describes every variant a picker offers', () => {
    getPropertyElementConfigs()
      // A single fixed presentation shows no picker, so it has
      // nothing to explain
      .filter((config) => config.variants.length > 1)
      .forEach((config) => {
        config.variants.forEach((variant) => {
          // A variant reads as either a sample of what it renders
          // or a line saying what it renders, never as a bare name
          expect(variant.sample || variant.description).toBeTruthy();
        });
      });
  });

  it('gives every text-like variant an explicit font size', () => {
    getPropertyElementConfigs().forEach((config) => {
      config.variants
        .filter((variant) => variant.styleCategory === 'typography')
        .forEach((variant) => {
          // Nothing depends on what the surrounding context
          // happens to cascade
          const themeStyle =
            DefaultDesignTheme.propertyElements[config.propertyType]?.[
              variant.id
            ]?.style;

          expect(themeStyle).toHaveProperty('fontSize');
        });
    });
  });

  it('keeps the font size outside every editable whitelist', () => {
    getPropertyElementConfigs().forEach((config) => {
      config.variants.forEach((variant) => {
        // Size is the variant's own typographic shape, never an
        // element-level override
        expect(variant.editableStyles ?? []).not.toContain('fontSize');
      });
    });
  });

  it('splits a variant onto the style category it is rendered as', () => {
    // The URL element is the clearest case of the split: its two
    // text presentations are styled as typography, an embedded
    // page as a frame
    const url = getPropertyElementConfig('url');

    expect(url.variants.map((variant) => variant.styleCategory)).toEqual([
      'typography',
      'typography',
      'embed',
    ]);
  });

  it('throws for property types without an element', () => {
    expect(() => getPropertyElementConfig('toggle')).toThrow();
  });

  it('returns null for property types without an element when not throwing', () => {
    expect(getPropertyElementConfig('toggle', false)).toBeNull();
  });
});
