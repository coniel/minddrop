import React from 'react';
import { Editor } from './Editor';
import {
  headingElement1,
  paragraphElement1,
  paragraphElement2,
} from '../test-utils/editor.data';
import { registerElementConfig } from '../registerElementConfig';
import { HeadingOneElementConfig } from '../default-element-configs/HeadingOneElement';
import { ParagraphElementConfig } from '../default-element-configs/ParagraphElement';
import { ToDoElementConfig } from '../default-element-configs/ToDoElement';
import { defaultMarkConfigs } from '../default-mark-configs';
import { registerMarkConfig } from '../registerMarkConfig';

export default {
  title: 'editor/Editor',
  component: Editor,
};

[HeadingOneElementConfig, ParagraphElementConfig, ToDoElementConfig].forEach(
  (config) => registerElementConfig(config),
);

defaultMarkConfigs.forEach((config) => registerMarkConfig(config));

export const Default: React.FC = () => (
  <div>
    <Editor
      initialValue={[headingElement1, paragraphElement1, paragraphElement2]}
    />
  </div>
);
