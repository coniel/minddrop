import { fuzzySearch } from '@minddrop/utils';
import {
  UnminifiedContentIcon,
  MinifiedContentIcon,
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

// Get all labels from all icons as an array
export const getAllLabels = (icons: UnminifiedContentIcon[]) => {
  const labels = new Set<string>();

  icons.forEach((icon) => {
    icon.labels.forEach((label) => {
      labels.add(label);
    });
  });

  return Array.from(labels);
};

/**
 * Filters content icons based on a fuzzy search matching
 * their labels and category.
 */
export function searchContentIcons(
  icons: UnminifiedContentIcon[],
  labels: string[],
  query: string,
) {
  const matchedLabels = fuzzySearch(labels, query);

  // If there is no query or a single character query
  // has no results, return everything.
  if (!query || (query.length === 1 && !matchedLabels.length)) {
    return icons;
  }

  const results = new Set<UnminifiedContentIcon>();

  matchedLabels.forEach((label) => {
    // Add all icons with the matched label to the results
    // set.
    icons
      .filter((icon) => icon.labels.includes(label))
      .forEach((icon) => results.add(icon));
  });

  return Array.from(results);
}
