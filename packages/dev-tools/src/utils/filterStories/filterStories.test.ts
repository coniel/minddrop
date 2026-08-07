import { describe, expect, it } from 'vitest';
import { StoryGroup } from '../../storyRegistry';
import { filterStories } from './filterStories';

const StoryComponent = () => null;

const fields: StoryGroup = {
  group: 'Fields',
  items: [
    { label: 'Select', component: StoryComponent },
    { label: 'TextInput', component: StoryComponent },
  ],
};

const overlay: StoryGroup = {
  group: 'Overlay',
  items: [{ label: 'Dialog', component: StoryComponent }],
};

const groups = [fields, overlay];

describe('filterStories', () => {
  it('returns every group without search text', () => {
    expect(filterStories(groups, '  ')).toEqual(groups);
  });

  it('keeps only the matching stories, ignoring case', () => {
    expect(filterStories(groups, 'SELECT')).toEqual([
      {
        group: 'Fields',
        items: [{ label: 'Select', component: StoryComponent }],
      },
    ]);
  });

  it('drops groups without a matching story', () => {
    expect(filterStories(groups, 'dialog')).toEqual([overlay]);
  });

  it('keeps every story of a group whose name matches', () => {
    expect(filterStories(groups, 'fields')).toEqual([fields]);
  });

  it('returns nothing when no story matches', () => {
    expect(filterStories(groups, 'nothing')).toEqual([]);
  });
});
