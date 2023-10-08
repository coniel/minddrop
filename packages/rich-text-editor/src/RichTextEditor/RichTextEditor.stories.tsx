import React from 'react';
import { RichTextEditor } from './RichTextEditor';
import {
  headingElement1,
  paragraphElement1,
  paragraphElement2,
} from '../test-utils/rich-text-editor.data';
import { registerRichTextElementConfig } from '../registerRichTextElementConfig';
import { HeadingOneElementConfig } from '../default-element-configs/HeadingOneElement';
import { ParagraphElementConfig } from '../default-element-configs/ParagraphElement';
import { ToDoElementConfig } from '../default-element-configs/ToDoElement';
import { defaultMarkConfigs } from '../default-mark-configs';
import { registerRichTextMarkConfig } from '../registerRichTextMarkConfig';

export default {
  title: 'editor/Editor',
  component: RichTextEditor,
};

[HeadingOneElementConfig, ParagraphElementConfig, ToDoElementConfig].forEach(
  (config) => registerRichTextElementConfig(config),
);

defaultMarkConfigs.forEach((config) => registerRichTextMarkConfig(config));

export const Default: React.FC = () => (
  <div>
    <RichTextEditor
      initialValue={[headingElement1, paragraphElement1, paragraphElement2]}
    />
  </div>
);
