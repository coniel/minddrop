import { HTMLProps } from 'react';
import { LucideIconSvg } from '../LucideIconSvg';
import { BuiltInContentIconSetId } from '../constants';
import { registerContentIconSet } from '../contentIconSetRegistry';
import {
  ContentIconSet,
  ContentIconSetContents,
  ContentIconSetMetadata,
} from '../types';

/**
 * Initializes icons by registering the available content icon
 * sets. Registered sets load on first use.
 */
export function initializeIcons(): void {
  // Register the built-in set
  registerContentIconSet({
    id: BuiltInContentIconSetId,
    name: 'Lucide',
    load: loadBuiltInContentIconSet,
  });
}

/**
 * Loads the built-in set's icon components and metadata.
 */
async function loadBuiltInContentIconSet(): Promise<ContentIconSetContents> {
  // Load the icon SVG contents and picker metadata in parallel
  const [{ ContentIcons }, metadata] = await Promise.all([
    import('../content-icons.min'),
    import('../content-icons.min.json'),
  ]);

  // Wrap each icon's SVG contents in a framed SVG component
  const icons = Object.entries(ContentIcons).reduce<ContentIconSet>(
    (map, [name, content]) => ({
      ...map,
      [name]: (props: HTMLProps<SVGSVGElement>) => (
        <LucideIconSvg {...props}>{content}</LucideIconSvg>
      ),
    }),
    {},
  );

  return {
    icons,
    metadata: metadata.default as unknown as ContentIconSetMetadata,
  };
}
