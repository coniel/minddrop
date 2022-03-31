import React from 'react';
import { generateId } from '@minddrop/utils';
import { generateRichTextDocument } from '../generateRichTextDocument';
import {
  RichTextBlockElement,
  RichTextBlockElementConfig,
  RichTextInlineElement,
  RichTextInlineElementConfig,
} from '../types';

// Rich text document IDs
const richTextDoc1Id = generateId();
const richTextDoc2Id = generateId();
const richTextDoc3Id = generateId();
const richTextDoc4Id = generateId();

/* ******************************* */
/* Rich text block element configs */
/* ******************************* */

// Heading element
export const headingElementConfig: RichTextBlockElementConfig = {
  type: 'heading-1',
  level: 'block',
  component: ({ children, attributes }) => (
    <div {...attributes}>{children}</div>
  ),
};

// Paragraph element
export const paragraphElementConfig: RichTextBlockElementConfig = {
  type: 'paragraph',
  level: 'block',
  component: ({ children, attributes }) => (
    <div {...attributes}>{children}</div>
  ),
};

// Equation element (void)
export interface TestBlockEquationElement extends RichTextBlockElement {
  type: 'block-equation';
  expression: string;
}

export const blockEquationElementConfig: RichTextBlockElementConfig<TestBlockEquationElement> =
  {
    type: 'block-equation',
    level: 'block',
    void: true,
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

export interface TestLinkElement extends RichTextInlineElement {
  type: 'link';
  url: string;
}

export const linkElementConfig: RichTextInlineElementConfig<TestLinkElement> = {
  level: 'inline',
  type: 'link',
  component: ({ attributes, children, element }) => (
    <a {...attributes} href={element.url}>
      {children}
    </a>
  ),
};

export interface TestInlineEquationElement extends RichTextInlineElement {
  type: 'inline-equation';
  expression: string;
}

export const inlineEquationElementConfig: RichTextInlineElementConfig<TestInlineEquationElement> =
  {
    level: 'inline',
    type: 'inline-equation',
    void: true,
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
export const headingElement1: RichTextBlockElement = {
  id: generateId(),
  type: 'heading-1',
  parents: [{ type: 'rich-text-document', id: richTextDoc1Id }],
  children: [{ text: headingElement1PlainText }],
};
export const headingElement2: RichTextBlockElement = {
  id: generateId(),
  type: 'heading-1',
  parents: [{ type: 'rich-text-document', id: richTextDoc2Id }],
  children: [{ text: headingElement2PlainText }],
};
export const headingElement3: RichTextBlockElement = {
  id: generateId(),
  type: 'heading-1',
  parents: [{ type: 'rich-text-document', id: richTextDoc3Id }],
  children: [{ text: headingElement3PlainText }],
};
export const headingElement4: RichTextBlockElement = {
  id: generateId(),
  type: 'heading-1',
  parents: [{ type: 'rich-text-document', id: richTextDoc4Id }],
  children: [{ text: headingElement4PlainText }],
};

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
export const paragraphElement1: RichTextBlockElement = {
  id: generateId(),
  type: 'paragraph',
  parents: [{ type: 'rich-text-document', id: richTextDoc1Id }],
  children: [{ text: paragraphElement1PlainText }],
};
export const paragraphElement2: RichTextBlockElement = {
  id: generateId(),
  type: 'paragraph',
  parents: [{ type: 'rich-text-document', id: richTextDoc2Id }],
  children: [
    {
      text: paragraphElement2PlainText,
    },
  ],
};
export const paragraphElement3: RichTextBlockElement = {
  id: generateId(),
  type: 'paragraph',
  parents: [{ type: 'rich-text-document', id: richTextDoc3Id }],
  children: [
    {
      text: paragraphElement3PlainText,
    },
  ],
};
export const paragraphElement4: RichTextBlockElement = {
  id: generateId(),
  type: 'paragraph',
  parents: [{ type: 'rich-text-document', id: richTextDoc4Id }],
  children: [
    {
      text: paragraphElement4PlainText,
    },
  ],
};
export const blockEquationElement1: TestBlockEquationElement = {
  id: generateId(),
  type: 'block-equation',
  parents: [],
  expression: blockEquationElement1PlainText,
};

/* ************************* */
/* Rich text inline elements */
/* ************************* */

export const linkElement1PlainText = 'MindDrop website';
export const linkElement1: TestLinkElement = {
  type: 'link',
  id: generateId(),
  url: 'https://minddrop.app',
  parents: [],
  children: [{ text: linkElement1PlainText }],
};
export const inlineEquationElement1PlainText = 'e=mc^2';
export const inlineEquationElement1: TestInlineEquationElement = {
  type: 'inline-equation',
  id: generateId(),
  expression: inlineEquationElement1PlainText,
  parents: [],
};

/* ******************* */
/* Rich text documents */
/* ******************* */

export const richTextDocument1PlainText = `${headingElement1PlainText}\n\n${paragraphElement1PlainText}`;
export const richTextDocument2PlainText = `${headingElement2PlainText}\n\n${paragraphElement2PlainText}`;
export const richTextDocument3PlainText = `${headingElement3PlainText}\n\n${paragraphElement3PlainText}`;
export const richTextDocument4PlainText = `${headingElement4PlainText}\n\n${paragraphElement4PlainText}`;
export const richTextDocument1 = {
  ...generateRichTextDocument([headingElement1.id, paragraphElement1.id]),
  id: richTextDoc1Id,
};
export const richTextDocument2 = {
  ...generateRichTextDocument([headingElement2.id, paragraphElement2.id]),
  id: richTextDoc2Id,
};
export const richTextDocument3 = {
  ...generateRichTextDocument([headingElement3.id, paragraphElement3.id]),
  id: richTextDoc3Id,
};
export const richTextDocument4 = {
  ...generateRichTextDocument([headingElement4.id, paragraphElement4.id]),
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
  linkElementConfig,
  inlineEquationElementConfig,
];

// Block level rich text elements
export const richTextBlockElements = [
  headingElement1,
  headingElement2,
  headingElement3,
  headingElement4,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  paragraphElement4,
  blockEquationElement1,
];

// Inline level rich text elements
export const richTextInlineElements = [linkElement1, inlineEquationElement1];

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
