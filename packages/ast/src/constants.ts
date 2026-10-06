// The character an anchor fragment starts with. Tells an anchor apart
// from a heading.
export const AnchorPrefix = '^';

// The spacing of markdown's tab stops, in columns
export const MarkdownTabWidth = 4;

/**
 * The wikilink spelling: a reference, optionally followed by a `#` fragment
 * and by a label. None of the parts may contain the characters which close
 * the link, so an unclosed `[[` does not match. `#` is reserved as the
 * fragment separator, so a reference cannot contain one.
 */
export const WikilinkPattern =
  /\[\[([^[\]|#]+)(?:#([^[\]|]+))?(?:\|([^[\]]*))?\]\]/g;
