import { resolveIndentationWidth } from '@minddrop/utils';
import { MarkdownTabWidth } from '../../constants';

// A list item marker: a bullet, or a number of up to nine digits followed
// by `.` or `)`, then spaces or tabs, or the end of the line.
const ListItemMarkerPattern = /^([-*+]|\d{1,9}[.)])([ \t]+|$)/;

// The most columns of spacing after a marker which belong to it. Spacing
// past them is the indentation of code within the item.
const MaxMarkerSpacing = 4;

export interface ListItemMarker {
  /**
   * The column the item's content starts at. Lines in the item are
   * indented to this column.
   */
  contentColumn: number;

  /**
   * The rest of the line after the marker and the spacing belonging to
   * it. Spacing past the marker's is kept as spaces.
   */
  content: string;
}

/**
 * Parses the list item marker a line opens with.
 *
 * @param content - The line with its indentation removed.
 * @param indentation - The width of the line's indentation.
 * @returns The item's content column and content, or null if the line opens no list item.
 */
export function parseListItemMarker(
  content: string,
  indentation: number,
): ListItemMarker | null {
  // Match the marker and the spacing after it
  const match = content.match(ListItemMarkerPattern);

  // Check the line starts with a marker. If not, it opens no list item.
  if (!match) {
    return null;
  }

  // Measure the spacing in columns from the end of the marker
  const [source, marker, spacing] = match;
  const markerEnd = indentation + marker.length;
  const spacingWidth = resolveIndentationWidth(
    spacing,
    MarkdownTabWidth,
    markerEnd,
  );
  const rest = content.slice(source.length);

  // Check if the marker ends the line or is followed by more spacing than
  // belongs to it. If so, count a single column after it, and keep the
  // rest of the spacing as indentation.
  if (!spacingWidth || spacingWidth > MaxMarkerSpacing) {
    return {
      contentColumn: markerEnd + 1,
      content: `${' '.repeat(Math.max(spacingWidth - 1, 0))}${rest}`,
    };
  }

  // Start the content after the marker and its spacing
  return { contentColumn: markerEnd + spacingWidth, content: rest };
}
