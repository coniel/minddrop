import { describe, expect, it } from 'vitest';
import { Story } from '../../storyRegistry';
import { groupStories } from './groupStories';

const StoryComponent = () => null;

const button: Story = {
  group: 'Primitives',
  label: 'Button',
  component: StoryComponent,
};
const text: Story = {
  group: 'Primitives',
  label: 'Text',
  component: StoryComponent,
};
const dialog: Story = {
  group: 'Overlay',
  label: 'Dialog',
  component: StoryComponent,
};

describe('groupStories', () => {
  it('returns nothing for no stories', () => {
    expect(groupStories([])).toEqual([]);
  });

  it('groups stories by their group', () => {
    expect(groupStories([button, dialog, text])).toEqual([
      {
        group: 'Overlay',
        items: [{ label: 'Dialog', component: StoryComponent }],
      },
      {
        group: 'Primitives',
        items: [
          { label: 'Button', component: StoryComponent },
          { label: 'Text', component: StoryComponent },
        ],
      },
    ]);
  });

  it('sorts groups by name', () => {
    expect(groupStories([button, dialog]).map((group) => group.group)).toEqual([
      'Overlay',
      'Primitives',
    ]);
  });

  it('sorts stories within a group by label', () => {
    expect(
      groupStories([text, button])[0].items.map((item) => item.label),
    ).toEqual(['Button', 'Text']);
  });
});
