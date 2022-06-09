import {
  Resources,
  RDDataSchema,
  ResourceFieldValidator,
} from '@minddrop/resources';
import { Schema } from '@minddrop/utils';
import {
  BaseRTElementDocumentData,
  BaseCreateRTElementDocumentData,
  BaseUpdateRTElementDocumentData,
  RTInlineElementConfig,
  RTBlockElementConfig,
  RTElementDocument,
  RTElement,
  RTInlineElement,
  RTNode,
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

function serializeChildren(
  children?: RTElement['children'] | RTElementDocument['children'],
): RTElementDocument['children'] {
  if (!children) {
    return [{ text: '' }];
  }

  return children.map((child: RTInlineElement | RTNode | string) => {
    if (typeof child === 'string') {
      // Child is a inline element ID,
      // return it as is.
      return child;
    }

    if ('type' in child) {
      // Child is an inline rich text
      // element, return its ID.
      return child.id;
    }

    // Child is a rich text node,
    // return it as is.
    return child;
  });
}

const dataSchema: RDDataSchema<BaseRTElementDocumentData> = {
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
  BaseRTElementDocumentData,
  BaseCreateRTElementDocumentData,
  BaseUpdateRTElementDocumentData,
  RTInlineElementConfig | RTBlockElementConfig
>({
  resource: 'rich-text:element',
  dataSchema,
  onCreate: (core, data) => {
    const config = RTElementsResource.getTypeConfig(data.type);

    const document: RTElementDocument = { ...data, level: config.level };

    if (!config.void) {
      return { ...document, children: serializeChildren(document.children) };
    }

    return document;
  },
  onUpdate: (core, update) => {
    if (
      'children' in update.changes &&
      Array.isArray(update.changes.children)
    ) {
      return {
        ...update.changes,
        children: serializeChildren(update.changes.children),
      };
    }

    return update.changes;
  },
  // onGet: (document) => ({
  //   ...document,
  //   children: document.children
  //     ? document.children.map((node) =>
  //         typeof node === 'string' ? RTElementsResource.get(node) : node,
  //       )
  //     : undefined,
  // }),
});
