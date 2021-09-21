/**
 * @format
 */
import 'react-native-get-random-values';
import { AppRegistry, asyncStorage } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';
import { name as appName } from './app.json';

configure(() => {
  require('./src/stories.ts');
}, module);

const StorybookUIRoot = getStorybookUI({ asyncStorage });

AppRegistry.registerComponent(appName, () => StorybookUIRoot);
