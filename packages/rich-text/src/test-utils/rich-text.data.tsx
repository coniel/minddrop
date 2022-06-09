import React from 'react';
import { Resources } from '@minddrop/resources';
import { generateId } from '@minddrop/utils';
import {
  RTBlockElementDocument,
  RTBlockElementConfig,
  RTInlineElementDocument,
  RTInlineElementConfig,
  RTBlockElement,
  RTInlineElement,
} from '../types';
import { toPlainText } from '../toPlainText';

// Rich text document IDs
const richTextDoc1Id = generateId();
const richTextDoc2Id = generateId();
const richTextDoc3Id = generateId();
const richTextDoc4Id = generateId();

/* ******************************* */
/* Rich text block element configs */
/* ******************************* */

// Heading element
export const headingElementConfig: RTBlockElementConfig = {
  type: 'heading-1',
  level: 'block',
  component: ({ children, attributes }) => (
    <div {...attributes}>{children}</div>
  ),
};

// Paragraph element
export const paragraphElementConfig: RTBlockElementConfig = {
  type: 'paragraph',
  level: 'block',
  initializeData: (dataInsert) => ({
    children: [{ text: dataInsert ? dataInsert.data['text/plain'] : '' }],
  }),
  component: ({ children, attributes }) => (
    <div {...attributes}>{children}</div>
  ),
};

// To-do element (interactive)
export interface TestToDoElementData {
  done: boolean;
}

export const toDoElementConfig: RTBlockElementConfig<TestToDoElementData> = {
  type: 'to-do',
  level: 'block',
  dataSchema: {
    done: {
      type: 'boolean',
    },
  },
  initializeData: () => ({ done: false }),
  component: ({ attributes, children }) => (
    <div {...attributes}>{children}</div>
  ),
};

// Equation element (void)
export interface TestBlockEquationElementData {
  expression: string;
}

export const blockEquationElementConfig: RTBlockElementConfig<TestBlockEquationElementData> =
  {
    type: 'block-equation',
    level: 'block',
    void: true,
    dataSchema: {
      expression: {
        type: 'string',
        required: true,
      },
    },
    toPlainText: (element) => element.expression,
    initializeData: () => ({ expression: '' }),
    convertData: (element) => ({ expression: toPlainText(element) }),
    component: ({ attributes, children, element }) => (
      <div {...attributes}>
        {element}
        {children}
      </div>
    ),
  };

/* ******************************** */
/* Rich text inline element configs */
/* ******************************** */

export interface TestLinkElementData {
  url: string;
}

export const linkElementConfig: RTInlineElementConfig<TestLinkElementData> = {
  level: 'inline',
  type: 'link',
  dataSchema: {
    url: {
      type: 'string',
      required: true,
      allowEmpty: false,
    },
  },
  initializeData: () => ({ url: '' }),
  component: ({ attributes, children, element }) => (
    <a {...attributes} href={element.url}>
      {children}
    </a>
  ),
};

export interface TestInlineEquationElementData {
  expression: string;
}

export const inlineEquationElementConfig: RTInlineElementConfig<TestBlockEquationElementData> =
  {
    level: 'inline',
    type: 'inline-equation',
    void: true,
    dataSchema: {
      expression: {
        type: 'string',
        required: true,
      },
    },
    initializeData: () => ({ expression: '' }),
    toPlainText: (element) => element.expression,
    component: ({ attributes, children, element }) => (
      <span {...attributes}>
        {element.expression}
        {children}
      </span>
    ),
  };

/* ************************ */
/* Rich text block elements */
/* ************************ */

// Headings
export const headingElement1PlainText = 'Position and its derivatives';
export const headingElement2PlainText = 'Classical mechanics';
export const headingElement3PlainText = 'Law of inertia';
export const headingElement4PlainText = 'Acceleration';
export const headingElement1Document: RTBlockElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'heading-1',
    children: [{ text: headingElement1PlainText }],
  }),
  id: 'heading-elem-1',
  parents: [{ resource: 'rich-text:document', id: richTextDoc1Id }],
};
export const headingElement2Document: RTBlockElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'heading-1',
    children: [{ text: headingElement2PlainText }],
  }),
  parents: [{ resource: 'rich-text:document', id: richTextDoc2Id }],
};
export const headingElement3Document: RTBlockElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'heading-1',
    children: [{ text: headingElement3PlainText }],
  }),
  parents: [{ resource: 'rich-text:document', id: richTextDoc3Id }],
};
export const headingElement4Document: RTBlockElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'heading-1',
    children: [{ text: headingElement4PlainText }],
  }),
  parents: [{ resource: 'rich-text:document', id: richTextDoc4Id }],
};
export const headingElement1 = headingElement1Document as RTBlockElement;
export const headingElement2 = headingElement2Document as RTBlockElement;
export const headingElement3 = headingElement3Document as RTBlockElement;
export const headingElement4 = headingElement4Document as RTBlockElement;

// Paragraphs
export const paragraphElement1PlainText =
  'The position of a point particle is defined in relation to a coordinate system centred on an arbitrary fixed reference point in space called the origin O. A simple coordinate system might describe the position of a particle P with a vector notated by an arrow labeled r that points from the origin O to point P.';
export const paragraphElement2PlainText =
  'Classical mechanics is a physical theory describing the motion of macroscopic objects, from parts of machinery to stars and galaxies.';
export const paragraphElement3PlainText =
  'An object at rest remains at rest, and an object that is moving will continue to move straight and with constant velocity, if and only if there is no net force acting on that object.';
export const paragraphElement4PlainText =
  'The acceleration, or rate of change of velocity, is the derivative of the velocity with respect to time.';
export const blockEquationElement1PlainText = 'e=mc^2';
export const paragraphElement1Document: RTBlockElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'paragraph',
    children: [{ text: paragraphElement1PlainText }],
  }),
  parents: [{ resource: 'rich-text:document', id: richTextDoc1Id }],
};
export const paragraphElement2Document: RTBlockElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'paragraph',
    children: [{ text: paragraphElement2PlainText }],
  }),
  parents: [{ resource: 'rich-text:document', id: richTextDoc2Id }],
};
export const paragraphElement3Document: RTBlockElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'paragraph',
    children: [{ text: paragraphElement3PlainText }],
  }),
  parents: [{ resource: 'rich-text:document', id: richTextDoc3Id }],
};
export const paragraphElement4Document: RTBlockElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'paragraph',
    children: [{ text: paragraphElement4PlainText }],
  }),
  parents: [{ resource: 'rich-text:document', id: richTextDoc4Id }],
};
export const emptyParagraphElementDocument: RTBlockElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'paragraph',
    children: [{ text: '' }],
  }),
};
export const paragraphElement1 = paragraphElement1Document as RTBlockElement;
export const paragraphElement2 = paragraphElement2Document as RTBlockElement;
export const paragraphElement3 = paragraphElement3Document as RTBlockElement;
export const paragraphElement4 = paragraphElement4Document as RTBlockElement;
export const emptyParagraphElement =
  emptyParagraphElementDocument as RTBlockElement;

// Block equations
export const blockEquationElement1Document: RTBlockElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'block-equation',
    expression: blockEquationElement1PlainText,
  }),
};
export const blockEquationElement1 =
  blockEquationElement1Document as RTBlockElement;

// To-dos
export const toDoElementCompleted1Document: RTBlockElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'to-do',
    done: true,
    children: [{ text: '' }],
  }),
};
export const toDoElementCompleted1 =
  toDoElementCompleted1Document as RTBlockElement;

export const toDoElementIncomplete1Document: RTBlockElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'to-do',
    done: true,
    children: [{ text: '' }],
  }),
};
export const toDoElementIncomplete1 =
  toDoElementIncomplete1Document as RTBlockElement;

// Unregistered element type

export const unregisteredElementDocument: RTBlockElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'no-registered',
    children: [{ text: '' }],
  }),
};
export const unregisteredElement =
  unregisteredElementDocument as RTBlockElement;

/* ************************* */
/* Rich text inline elements */
/* ************************* */

export const linkElement1PlainText = 'MindDrop website';
export const linkElement1Document: RTInlineElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'link',
    url: 'https://minddrop.app',
    children: [{ text: linkElement1PlainText }],
  }),
};
export const linkElement1 = linkElement1Document as RTInlineElement;

export const inlineEquationElement1PlainText = 'e=mc^2';
export const inlineEquationElement1Document: RTInlineElementDocument = {
  ...Resources.generateDocument('rich-text:element', {
    type: 'inline-equation',
    expression: inlineEquationElement1PlainText,
  }),
};
export const inlineEquationElement1 =
  inlineEquationElement1Document as RTInlineElement;

/* ******************* */
/* Rich text documents */
/* ******************* */

export const richTextDocument1PlainText = `${headingElement1PlainText}\n\n${paragraphElement1PlainText}`;
export const richTextDocument2PlainText = `${headingElement2PlainText}\n\n${paragraphElement2PlainText}`;
export const richTextDocument3PlainText = `${headingElement3PlainText}\n\n${paragraphElement3PlainText}`;
export const richTextDocument4PlainText = `${headingElement4PlainText}\n\n${paragraphElement4PlainText}`;
export const richTextDocument1 = {
  ...Resources.generateDocument('rich-text:document', {
    children: [headingElement1.id, paragraphElement1.id],
  }),
  id: richTextDoc1Id,
};
export const richTextDocument2 = {
  ...Resources.generateDocument('rich-text:document', {
    children: [headingElement2.id, paragraphElement2.id],
  }),
  id: richTextDoc2Id,
};
export const richTextDocument3 = {
  ...Resources.generateDocument('rich-text:document', {
    children: [headingElement3.id, paragraphElement3.id],
  }),
  id: richTextDoc3Id,
};
export const richTextDocument4 = {
  ...Resources.generateDocument('rich-text:document', {
    children: [headingElement4.id, paragraphElement4.id],
  }),
  id: richTextDoc4Id,
};

/* **************** */
/* Combined exports */
/* **************** */

// Rich text element configs
export const richTextElementConfigs = [
  headingElementConfig,
  paragraphElementConfig,
  blockEquationElementConfig,
  toDoElementConfig,
  linkElementConfig,
  inlineEquationElementConfig,
];

// Block level rich text elements
export const richTextBlockElements = [
  headingElement1Document,
  headingElement2Document,
  headingElement3Document,
  headingElement4Document,
  paragraphElement1Document,
  paragraphElement2Document,
  paragraphElement3Document,
  paragraphElement4Document,
  emptyParagraphElementDocument,
  blockEquationElement1Document,
  toDoElementCompleted1Document,
  toDoElementIncomplete1Document,
];

// Inline level rich text elements
export const richTextInlineElements = [
  linkElement1Document,
  inlineEquationElement1Document,
];

// All rich text elements
export const richTextElements = [
  ...richTextBlockElements,
  ...richTextInlineElements,
];

// Rich text documents
export const richTextDocuments = [
  richTextDocument1,
  richTextDocument2,
  richTextDocument3,
  richTextDocument4,
];

// Block level rich text element IDs
export const richTextBlockElementIds = richTextBlockElements.map(
  (element) => element.id,
);
// Inline level rich text element IDs
export const richTextInlineElementIds = richTextInlineElements.map(
  (element) => element.id,
);
// All rich text element IDs
export const richTextElementIds = [
  ...richTextBlockElementIds,
  ...richTextInlineElementIds,
];
