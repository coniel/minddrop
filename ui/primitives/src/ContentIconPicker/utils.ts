import { fuzzySearch } from '@minddrop/utils';
import {
  MinifiedContentIcon,
  UnminifiedContentIcon,
} from './ContentIconPicker.types';

/**
 * Converts a minified content icon into a content
 * icon object. Adds icon name and categories to its
 * labels to make them searchable.
 */
export function unminifyContentIcon(
  icon: MinifiedContentIcon,
  categories: string[],
  labels: string[],
): UnminifiedContentIcon {
  return {
    name: icon[0],
    categories: icon[1].map((index) => categories[index]),
    // Merge categories into labels to make them searchable
    labels: [
      icon[0],
      ...icon[2].map((index) => labels[index]),
      ...icon[1].map((index) => categories[index]),
    ],
  };
}

/**
 * Groups icons by category, returns an array of
 * [category, ContentIcon[]] tuples.
 */
export function groupByCategory(icons: UnminifiedContentIcon[]) {
  return icons.reduce<[string, UnminifiedContentIcon[]][]>(
    (groups, icon) => {
      icon.categories.forEach((category) => {
        const groupIndex = groups.findIndex((group) => group[0] === category);

        if (groupIndex === -1) {
          groups.push([category, [icon]]);
        } else {
          groups[groupIndex][1].push(icon);
        }
      });

      return groups;
    },
    [] as [string, UnminifiedContentIcon[]][],
  );
}

/**
 * Extracts all unique labels from all icons and builds
 * a label-to-icon index for O(1) lookups during search.
 */
export function buildIconLabelIndex(icons: UnminifiedContentIcon[]) {
  const labelSet = new Set<string>();
  const labelToIcon = new Map<string, UnminifiedContentIcon[]>();

  for (const icon of icons) {
    for (const label of icon.labels) {
      labelSet.add(label);

      let items = labelToIcon.get(label);

      if (!items) {
        items = [];
        labelToIcon.set(label, items);
      }

      items.push(icon);
    }
  }

  return { labels: Array.from(labelSet), labelToIcon };
}

/**
 * Filters content icons based on a fuzzy search matching
 * their labels and category. Uses a pre-built label index
 * for fast lookups.
 */
export function searchContentIcons(
  icons: UnminifiedContentIcon[],
  labels: string[],
  labelToIcon: Map<string, UnminifiedContentIcon[]>,
  query: string,
) {
  const matchedLabels = fuzzySearch(labels, query);

  // If there is no query or a single character query
  // has no results, return everything
  if (!query || (query.length === 1 && !matchedLabels.length)) {
    return icons;
  }

  const results = new Set<UnminifiedContentIcon>();

  // Look up each matched label in the pre-built index
  for (const label of matchedLabels) {
    const items = labelToIcon.get(label);

    if (items) {
      for (const icon of items) {
        results.add(icon);
      }
    }
  }

  return Array.from(results);
}
