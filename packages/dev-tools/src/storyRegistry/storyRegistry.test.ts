import { afterEach, describe, expect, it } from 'vitest';
import {
  Story,
  getRegisteredStories,
  loadStories,
  registerStory,
  registerStoryLoader,
  subscribeToStories,
  unregisterStory,
} from './storyRegistry';

const StoryComponent = () => null;

const buttonStory: Story = {
  group: 'Test',
  label: 'Button',
  component: StoryComponent,
};

const textStory: Story = {
  group: 'Test',
  label: 'Text',
  component: StoryComponent,
};

afterEach(() => {
  unregisterStory(buttonStory.group, buttonStory.label);
  unregisterStory(textStory.group, textStory.label);
});

describe('registerStory', () => {
  it('lists the story under its group', () => {
    registerStory(buttonStory);

    expect(getRegisteredStories()).toContainEqual({
      group: 'Test',
      items: [{ label: 'Button', component: StoryComponent }],
    });
  });

  it('sorts stories within a group by label', () => {
    registerStory(textStory);
    registerStory(buttonStory);

    const group = getRegisteredStories().find((item) => item.group === 'Test');

    expect(group?.items.map((item) => item.label)).toEqual(['Button', 'Text']);
  });

  it('replaces a story registered under the same group and label', () => {
    const ReplacementComponent = () => null;

    registerStory(buttonStory);
    registerStory({ ...buttonStory, component: ReplacementComponent });

    const group = getRegisteredStories().find((item) => item.group === 'Test');

    expect(group?.items).toEqual([
      { label: 'Button', component: ReplacementComponent },
    ]);
  });
});

describe('unregisterStory', () => {
  it('removes the story from its group', () => {
    registerStory(buttonStory);
    registerStory(textStory);
    unregisterStory(buttonStory.group, buttonStory.label);

    const group = getRegisteredStories().find((item) => item.group === 'Test');

    expect(group?.items.map((item) => item.label)).toEqual(['Text']);
  });

  it('drops the group once its last story is removed', () => {
    registerStory(buttonStory);
    unregisterStory(buttonStory.group, buttonStory.label);

    expect(getRegisteredStories().some((group) => group.group === 'Test')).toBe(
      false,
    );
  });
});

describe('loadStories', () => {
  it('lists the stories registered by the loaders', async () => {
    registerStoryLoader(async () => registerStory(buttonStory));

    await loadStories();

    const group = getRegisteredStories().find((item) => item.group === 'Test');

    expect(group?.items.map((item) => item.label)).toEqual(['Button']);
  });

  it('does not run a loader which has already run', async () => {
    let loadCount = 0;

    registerStoryLoader(async () => {
      loadCount += 1;
    });

    await loadStories();
    await loadStories();

    expect(loadCount).toBe(1);
  });

  it('runs a loader registered after an earlier load', async () => {
    await loadStories();

    registerStoryLoader(async () => registerStory(textStory));

    await loadStories();

    const group = getRegisteredStories().find((item) => item.group === 'Test');

    expect(group?.items.map((item) => item.label)).toEqual(['Text']);
  });
});

describe('subscribeToStories', () => {
  it('calls the callback when a story is registered', () => {
    let callCount = 0;
    const unsubscribe = subscribeToStories(() => {
      callCount += 1;
    });

    registerStory(buttonStory);
    unsubscribe();

    expect(callCount).toBe(1);
  });

  it('stops calling the callback once unsubscribed', () => {
    let callCount = 0;
    const unsubscribe = subscribeToStories(() => {
      callCount += 1;
    });

    unsubscribe();
    registerStory(buttonStory);

    expect(callCount).toBe(0);
  });

  it('hands out a new snapshot after each change', () => {
    registerStory(buttonStory);

    const before = getRegisteredStories();

    registerStory(textStory);

    expect(getRegisteredStories()).not.toBe(before);
  });
});
