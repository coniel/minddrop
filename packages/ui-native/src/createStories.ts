import { StoriesOf } from '@braindrop/test-utils-native';
import createButtonStories from './Button/Button.stories';

export const createStories = (storiesOf: StoriesOf) => {
  createButtonStories(storiesOf);
};
