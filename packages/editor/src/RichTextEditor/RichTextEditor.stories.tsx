import React from 'react';
import { RichTextEditor } from './RichTextEditor';
import {
  headingElement1,
  paragraphElement1,
  paragraphElement2,
} from '../test-utils/editor.data';
import { HeadingOneElementConfig } from '../default-element-configs/HeadingElement';
import { ParagraphElementConfig } from '../default-element-configs/ParagraphElement';
import { ToDoElementConfig } from '../default-element-configs/ToDoElement';
import { defaultMarkConfigs } from '../default-mark-configs';
import { registerMarkConfig } from '../registerMarkConfig';
import { EditorBlockElementConfigsStore } from '../BlockElementTypeConfigsStore';

export default {
  title: 'editor/Editor',
  component: RichTextEditor,
};

[HeadingOneElementConfig, ParagraphElementConfig, ToDoElementConfig].forEach(
  (config) => EditorBlockElementConfigsStore.add(config),
);

defaultMarkConfigs.forEach((config) => registerMarkConfig(config));

export const Default: React.FC = () => (
  <div>
    <RichTextEditor
      initialValue={[headingElement1, paragraphElement1, paragraphElement2]}
    />
  </div>
);
