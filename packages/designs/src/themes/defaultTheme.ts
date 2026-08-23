import { DesignTheme } from '../types';

/**
 * The default design theme: the built-in styling of every property
 * element variant, authored as theme data so a later theme design
 * tool edits a copy of the same structure. Variants without an
 * entry render unstyled. Every text variant sets an explicit font
 * size, so nothing depends on what the surrounding context happens
 * to cascade.
 */
export const DefaultDesignTheme: DesignTheme = {
  propertyElements: {
    text: {
      // A single-line value (a name, an email): truncated to one
      // line by default, with no line height of its own so it adds
      // no spacing to whatever it sits in
      short: {
        style: { fontSize: 'base', lineHeight: 'none', truncate: 1 },
        contextStyles: {
          list: { fontSize: 'sm' },
        },
      },
      // A multi-line piece of text, at the content editor's line
      // height. Otherwise identical to the short value: the two
      // differ only in single- versus multi-line rendering.
      long: {
        style: { fontSize: 'base', lineHeight: 'normal' },
        contextStyles: {
          list: { fontSize: 'sm', truncate: 1 },
        },
      },
      // Secondary text under a title, starting subtle and sized
      // to the layout it is placed in. The colour key is editable,
      // so it acts as a default rather than a lock.
      subtitle: {
        style: { fontSize: 'md', color: 'subtle', lineHeight: 'snug' },
        contextStyles: {
          list: { fontSize: 'sm', truncate: 1 },
          page: { fontSize: 'lg' },
          space: { fontSize: 'lg' },
        },
      },
      // Fine print, starting subtle
      caption: {
        style: { fontSize: 'xs', color: 'subtle' },
        contextStyles: {
          list: { truncate: 1 },
        },
      },
      quote: {
        style: { fontSize: 'base', fontFamily: 'serif', italic: true },
        contextStyles: {
          list: { fontSize: 'sm', truncate: 1 },
        },
      },
    },
  },
};
