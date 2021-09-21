/// <reference types="node" />
import { ReactNode } from 'react';
import { StoryApi } from '@storybook/addons';

export type StoriesOf = (
  kind: string,
  module: NodeModule,
) => StoryApi<ReactNode>;
