import { describe, it, expect } from 'vitest';
import {
  getAllLabels,
  groupByCategory,
  searchContentIcons,
  unminifyContentIcon,
} from './utils';
import { UnminifiedContentIcon, MinifiedContentIcon } from './IconPicker.types';

const categories = ['category 0', 'category 1', 'category 2'];
const labels = ['label 0', 'label 1', 'label 2', 'label 3'];
const minifiedIcon: MinifiedContentIcon = ['cat', [0, 2], [1, 3]];

const contentIcon1: UnminifiedContentIcon = {
  name: minifiedIcon[0],
  categories: [categories[0], categories[2]],
  labels: [minifiedIcon[0], labels[1], labels[3], categories[0], categories[2]],
};

const contentIcon2: UnminifiedContentIcon = {
  name: 'dog',
  categories: [categories[0], categories[1]],
  labels: ['dog', labels[1], labels[2], categories[0], categories[1]],
};

const allLabels = [
  contentIcon1.name,
  labels[1],
  labels[3],
  categories[0],
  categories[2],
  contentIcon2.name,
  labels[2],
  categories[1],
];

describe('<IconPicker /> utils', () => {
  describe('unminifyIcons', () => {
    it('unminifies icons', () => {
      expect(unminifyContentIcon(minifiedIcon, categories, labels)).toEqual(
        contentIcon1,
      );
    });
  });

  describe('groupByCategory', () => {
    it('groups the icons by category', () => {
      expect(groupByCategory([contentIcon1, contentIcon2])).toEqual([
        ['category 0', [contentIcon1, contentIcon2]],
        ['category 2', [contentIcon1]],
        ['category 1', [contentIcon2]],
      ]);
    });
  });

  describe('getAllLabels', () => {
    it('merges all labels into a single array without duplicates', () => {
      expect(getAllLabels([contentIcon1, contentIcon2])).toEqual(allLabels);
    });
  });

  describe('searchContentIcons', () => {
    it('performs a search', () => {
      expect(
        searchContentIcons([contentIcon1, contentIcon2], allLabels, 'dog'),
      ).toEqual([contentIcon2]);
    });

    it('dedupes results', () => {
      expect(
        searchContentIcons([contentIcon1, contentIcon2], allLabels, 'category'),
      ).toEqual([contentIcon1, contentIcon2]);
    });
  });
});
