import { StoryGroup } from '@minddrop/ui-primitives/stories';
import { EditorStories } from './EditorStories';

/**
 * Local dev tools stories, merged with the ui-primitives story
 * registry in the dev tools stories section.
 */
export const localStories: StoryGroup[] = [
  {
    group: 'Editor',
    items: [{ label: 'Editor', component: EditorStories }],
  },
];
