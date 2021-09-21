import React from 'react';
import '@storybook/react-native';
import { StoriesOf } from '@braindrop/test-utils-native';
import { Button } from './Button';
import { View } from 'react-native';

const createStory = (storiesOf: StoriesOf) => {
  const buttonStories = storiesOf('Button', module);

  buttonStories.add('default view', () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button label="Button" />
    </View>
  ));
};
export default createStory;
