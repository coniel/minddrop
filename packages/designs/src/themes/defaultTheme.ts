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
    // The entry's primary heading, prominent on the pages and
    // spaces it opens in, compact and truncated on list rows. The
    // three sizes are the same heading set larger or smaller in
    // each context, so every size carries its own per-layout sizes.
    title: {
      sm: {
        style: {
          fontSize: 'base',
          fontWeight: 'semibold',
          lineHeight: 'tight',
        },
        contextStyles: {
          list: {
            fontSize: 'sm',
            fontWeight: 'medium',
            lineHeight: 'none',
            truncate: 1,
          },
          page: { fontSize: '2xl', fontWeight: 'bold' },
          space: { fontSize: '2xl', fontWeight: 'bold' },
        },
      },
      md: {
        style: { fontSize: 'md', fontWeight: 'semibold', lineHeight: 'tight' },
        contextStyles: {
          list: {
            fontSize: 'base',
            fontWeight: 'medium',
            lineHeight: 'none',
            truncate: 1,
          },
          page: { fontSize: '4xl', fontWeight: 'bold' },
          space: { fontSize: '4xl', fontWeight: 'bold' },
        },
      },
      lg: {
        style: { fontSize: 'xl', fontWeight: 'semibold', lineHeight: 'tight' },
        contextStyles: {
          list: {
            fontSize: 'md',
            fontWeight: 'medium',
            lineHeight: 'none',
            truncate: 1,
          },
          page: { fontSize: '5xl', fontWeight: 'bold' },
          space: { fontSize: '5xl', fontWeight: 'bold' },
        },
      },
    },
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
      // A single-line input in the standard field chrome: a quiet
      // outline, gently rounded, padded to clear the text
      field: {
        style: {
          fontSize: 'base',
          lineHeight: 'none',
          borderStyle: 'solid',
          borderEmphasis: 'subtle',
          borderRadius: 'sm',
          paddingTop: '1',
          paddingRight: '2',
          paddingBottom: '1',
          paddingLeft: '2',
        },
        contextStyles: {
          list: { fontSize: 'sm', paddingTop: '0-5', paddingBottom: '0-5' },
        },
      },
      // The same field grown to a textarea, at a reading line
      // height for the multi-line value inside it
      'multiline-field': {
        style: {
          fontSize: 'base',
          lineHeight: 'normal',
          borderStyle: 'solid',
          borderEmphasis: 'subtle',
          borderRadius: 'sm',
          paddingTop: '1',
          paddingRight: '2',
          paddingBottom: '1',
          paddingLeft: '2',
        },
        contextStyles: {
          list: { fontSize: 'sm' },
        },
      },
    },
    'formatted-text': {
      // The content document opened for writing: compact on cards,
      // reading length on the pages and spaces it opens in. The
      // editor's blocks read at the normal line height throughout.
      editor: {
        style: { fontSize: 'base', lineHeight: 'normal' },
        contextStyles: {
          card: { fontSize: 'sm' },
          page: { fontSize: 'md', maxWidth: 'content' },
          space: { fontSize: 'md', maxWidth: 'content' },
        },
      },
      // The same document rendered read-only, on the same sizes
      // and line height so switching between the two does not
      // reflow the layout
      display: {
        style: { fontSize: 'base', lineHeight: 'normal' },
        contextStyles: {
          card: { fontSize: 'sm' },
          page: { fontSize: 'md', maxWidth: 'content' },
          space: { fontSize: 'md', maxWidth: 'content' },
        },
      },
    },
    // A number reads as a single-line value, sized to the layout
    // it is placed in
    number: {
      plain: {
        style: { fontSize: 'base', lineHeight: 'none' },
        contextStyles: {
          list: { fontSize: 'sm' },
        },
      },
    },
    // A date reads as a single-line value, sized to the layout it
    // is placed in
    date: {
      plain: {
        style: { fontSize: 'base', lineHeight: 'none' },
        contextStyles: {
          list: { fontSize: 'sm' },
        },
      },
    },
    select: {
      // The three chip sizes: the whole chip shape, with padding
      // and rounding growing with the size. Chips take their fill
      // and label colour from their select option, so the sizes
      // carry no colour of their own.
      'badges-sm': {
        style: { fontSize: '2xs', borderRadius: 'xs', padding: 'px' },
      },
      badges: {
        style: { fontSize: 'xs', borderRadius: 'sm', padding: '0-5' },
        contextStyles: {
          list: { fontSize: '2xs' },
        },
      },
      'badges-lg': {
        style: { fontSize: 'sm', borderRadius: 'md', padding: '1' },
        contextStyles: {
          list: { fontSize: 'xs' },
        },
      },
      // The selected options run together as a plain line of text
      text: {
        style: { fontSize: 'base', lineHeight: 'none', truncate: 1 },
        contextStyles: {
          list: { fontSize: 'sm' },
        },
      },
    },
    url: {
      // The address itself, kept to a single line: a wrapped URL
      // reads as two
      text: {
        style: { fontSize: 'base', lineHeight: 'none', truncate: 1 },
        contextStyles: {
          list: { fontSize: 'sm' },
        },
      },
      // The same address, set in the entry's colour at full
      // strength so it reads as something to follow. The colour key
      // is editable, so it acts as a default rather than a lock.
      link: {
        style: {
          fontSize: 'base',
          color: 'solid',
          lineHeight: 'none',
          truncate: 1,
        },
        contextStyles: {
          list: { fontSize: 'sm' },
        },
      },
      // An embedded page is placed for reading, so it takes the
      // space left in whatever it is dropped into
      webview: {
        style: { height: 'fill' },
      },
    },
    image: {
      // A placed picture starts on photograph proportions with a
      // covering fit, the cover-image look most images are placed
      // for
      image: {
        style: { aspectRatio: '4/3', objectFit: 'cover' },
      },
      // The viewer is placed to look at, so it takes the space
      // left in whatever it is dropped into
      viewer: {
        style: { height: 'fill' },
      },
    },
    icon: {
      // An icon sized to sit beside interface text, growing to a
      // feature icon on the pages and spaces an entry opens in
      plain: {
        style: { size: 'md' },
        contextStyles: {
          list: { size: 'sm' },
          page: { size: 'lg' },
          space: { size: 'lg' },
        },
      },
    },
  },
};
