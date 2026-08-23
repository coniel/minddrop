import { describe, expect, it } from 'vitest';
import {
  NumberPropertyElementConfig,
  TextPropertyElementConfig,
} from '../../property-element-configs';
import { DesignTheme } from '../../types';
import { resolvePropertyElementStyle } from './resolvePropertyElementStyle';

// A minimal theme styling the short value variant, used to
// check the theme parameter is honoured
const customTheme: DesignTheme = {
  propertyElements: {
    text: {
      short: { style: { fontFamily: 'mono' } },
    },
  },
};

describe('resolvePropertyElementStyle', () => {
  it('resolves the default variant when no selection is made', () => {
    // The short value's single-line styling
    expect(
      resolvePropertyElementStyle(TextPropertyElementConfig, undefined),
    ).toEqual({ fontSize: 'base', lineHeight: 'none', truncate: 1 });
  });

  it('applies the layout context styles of the variant', () => {
    // List rows keep short values compact
    expect(
      resolvePropertyElementStyle(TextPropertyElementConfig, undefined, 'list'),
    ).toEqual({ lineHeight: 'none', truncate: 1, fontSize: 'sm' });
  });

  it('resolves the selected presentation variant', () => {
    expect(
      resolvePropertyElementStyle(
        TextPropertyElementConfig,
        'subtitle',
        'card',
      ),
    ).toEqual({ color: 'subtle', lineHeight: 'snug', fontSize: 'md' });
  });

  it('applies context styles over the variant styles', () => {
    // The caption's own font size survives the list context, which
    // only adds truncation
    expect(
      resolvePropertyElementStyle(TextPropertyElementConfig, 'caption', 'list'),
    ).toEqual({ fontSize: 'xs', color: 'subtle', truncate: 1 });
  });

  it('falls back to the default variant on an unknown selection', () => {
    expect(
      resolvePropertyElementStyle(TextPropertyElementConfig, 'unknown', 'list'),
    ).toEqual({ lineHeight: 'none', truncate: 1, fontSize: 'sm' });
  });

  it('resolves nothing for variants without a theme entry', () => {
    expect(
      resolvePropertyElementStyle(NumberPropertyElementConfig, undefined),
    ).toEqual({});
  });

  it('resolves against the given theme', () => {
    expect(
      resolvePropertyElementStyle(
        TextPropertyElementConfig,
        undefined,
        undefined,
        customTheme,
      ),
    ).toEqual({ fontFamily: 'mono' });
  });
});
