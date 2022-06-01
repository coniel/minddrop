import {
  Resources,
  RDDataSchema,
  ResourceFieldValidator,
} from '@minddrop/resources';
import { Schema } from '@minddrop/utils';
import {
  BaseRTElementData,
  BaseCreateRTElementData,
  BaseUpdateRTElementData,
  RTInlineElementConfig,
  RTBlockElementConfig,
  RTElement,
} from './types';

const richTextNodeDataSchema: Schema<ResourceFieldValidator> = {
  text: {
    type: 'string',
    required: true,
    allowEmpty: true,
  },
  bold: {
    type: 'boolean',
    required: false,
  },
  italic: {
    type: 'boolean',
    required: false,
  },
  underline: {
    type: 'boolean',
    required: false,
  },
  strikethrough: {
    type: 'boolean',
    required: false,
  },
  code: {
    type: 'boolean',
    required: false,
  },
  color: {
    type: 'content-color',
    required: false,
  },
  backgroundColor: {
    type: 'content-color',
    required: false,
  },
};

const dataSchema: RDDataSchema<BaseRTElementData> = {
  level: {
    type: 'enum',
    options: ['inline', 'block'],
  },
  children: {
    type: 'array',
    required: true,
    items: {
      type: [
        {
          type: 'object',
          schema: richTextNodeDataSchema,
        },
        {
          type: 'resource-id',
          resource: 'rich-text:element',
        },
      ],
    },
  },
  nestedElements: {
    type: 'resource-ids',
    resource: 'rich-text:element',
  },
};

export const RTElementsResource = Resources.createTyped<
  BaseRTElementData,
  BaseCreateRTElementData,
  BaseUpdateRTElementData,
  RTInlineElementConfig | RTBlockElementConfig
>({
  resource: 'rich-text:element',
  dataSchema,
  onCreate: (core, data) => {
    const config = RTElementsResource.getTypeConfig(data.type);

    const document: RTElement = { ...data, level: config.level };

    if (!config.void && !document.children) {
      return { ...document, children: [{ text: '' }] };
    }

    return document;
  },
});
