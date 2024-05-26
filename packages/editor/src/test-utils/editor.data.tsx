import { defaultMarkConfigs } from '../default-mark-configs';
import { toPlainText } from '../toPlainText';
import {
  BlockElementConfig,
  InlineElementConfig,
  BlockElement,
  InlineElement,
} from '../types';

export {
  boldMarkConfig,
  italicMarkConfig,
  underlineMarkConfig,
  strikethroughMarkConfig,
} from '../default-mark-configs';

export const EDITOR_TEST_DATA = {
  markConfigs: defaultMarkConfigs,
};

/* ********************* */
/* Block element configs */
/* ********************* */

// Heading element
export const headingElementConfig: BlockElementConfig = {
  type: 'heading-1',
  level: 'block',
  toMarkdown: () => '',
  component: ({ children, attributes }) => (
    <div {...attributes}>{children}</div>
  ),
};

// Paragraph element
export const paragraphElementConfig: BlockElementConfig = {
  type: 'paragraph',
  level: 'block',
  component: ({ children, attributes }) => (
    <div {...attributes}>{children}</div>
  ),
};

// To-do element (interactive)
export interface TestToDoElementData {
  done: boolean;
}

export const toDoElementConfig: BlockElementConfig<TestToDoElementData> = {
  type: 'to-do',
  level: 'block',
  initialize: () => ({
    done: false,
    children: [{ text: '' }],
    level: 'block',
    type: 'to-do',
  }),
  toMarkdown: () => '',
  component: ({ attributes, children }) => (
    <div {...attributes}>{children}</div>
  ),
};

// Math element (void)
export interface TestMathElementData {
  expression: string;
}

export const blockMathElementConfig: BlockElementConfig<TestMathElementData> = {
  type: 'math-block',
  level: 'block',
  void: true,
  toPlainText: (element) => element.expression,
  toMarkdown: (element) => `$$\n\n${element.expression}\n\n$$`,
  initialize: () => ({
    expression: '',
    level: 'block',
    type: 'math-block',
    children: [{ text: '' }],
  }),
  convert: (element) => ({
    expression: toPlainText(element),
    level: 'block',
    type: 'math-block',
    children: [{ text: '' }],
  }),
  component: ({ attributes, children, element }) => (
    <div {...attributes}>
      {element}
      {children}
    </div>
  ),
};

/* ********************** */
/* Inline element configs */
/* ********************** */

export interface TestLinkElementData {
  url: string;
}

export const linkElementConfig: InlineElementConfig<TestLinkElementData> = {
  level: 'inline',
  type: 'link',
  initialize: () => ({
    url: '',
    children: [{ text: '' }],
    type: 'link',
    level: 'inline',
  }),
  toMarkdown: () => '',
  component: ({ attributes, children, element }) => (
    <a {...attributes} href={element.url}>
      {children}
    </a>
  ),
};

export interface TestInlineMathElementData {
  expression: string;
}

export const inlineMathElementConfig: InlineElementConfig<TestMathElementData> =
  {
    level: 'inline',
    type: 'math-inline',
    void: true,
    initialize: () => ({
      expression: '',
      children: [{ text: '' }],
      type: 'math-inline',
      level: 'inline',
    }),
    toPlainText: (element) => element.expression,
    toMarkdown: (element) => `$${element.expression}$`,
    component: ({ attributes, children, element }) => (
      <span {...attributes}>
        {element.expression}
        {children}
      </span>
    ),
  };

/* ************** */
/* Block elements */
/* ************** */

// Headings
export const headingElement1PlainText = 'Position and its derivatives';
export const headingElement2PlainText = 'Classical mechanics';
export const headingElement3PlainText = 'Law of inertia';
export const headingElement4PlainText = 'Acceleration';
export const headingElement1: BlockElement = {
  type: 'heading-1',
  level: 'block',
  children: [{ text: headingElement1PlainText }],
};
export const headingElement2: BlockElement = {
  type: 'heading-1',
  level: 'block',
  children: [{ text: headingElement2PlainText }],
};
export const headingElement3: BlockElement = {
  type: 'heading-1',
  level: 'block',
  children: [{ text: headingElement3PlainText }],
};
export const headingElement4: BlockElement = {
  type: 'heading-1',
  level: 'block',
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
export const blockMathElement1PlainText = 'e=mc^2';
export const paragraphElement1: BlockElement = {
  type: 'paragraph',
  level: 'block',
  children: [{ text: paragraphElement1PlainText }],
};
export const paragraphElement2: BlockElement = {
  type: 'paragraph',
  level: 'block',
  children: [{ text: paragraphElement2PlainText }],
};
export const paragraphElement3: BlockElement = {
  type: 'paragraph',
  level: 'block',
  children: [{ text: paragraphElement3PlainText }],
};
export const paragraphElement4: BlockElement = {
  type: 'paragraph',
  level: 'block',
  children: [{ text: paragraphElement4PlainText }],
};
export const emptyParagraphElement: BlockElement = {
  type: 'paragraph',
  level: 'block',
  children: [{ text: '' }],
};

// Math block
export const blockMathElement1: BlockElement<TestMathElementData> = {
  type: 'math-block',
  level: 'block',
  expression: blockMathElement1PlainText,
  children: [{ text: '' }],
};

// To-do
export const toDoElementCompleted1: BlockElement<TestToDoElementData> = {
  type: 'to-do',
  level: 'block',
  done: true,
  children: [{ text: '' }],
};

export const toDoElementIncomplete1: BlockElement<TestToDoElementData> = {
  type: 'to-do',
  level: 'block',
  done: false,
  children: [{ text: '' }],
};

/* *************** */
/* Inline elements */
/* *************** */

export const inlineMathElement1PlainText = 'E=mc^2';

// Link
export const linkElement1: InlineElement<TestLinkElementData> = {
  type: 'link',
  level: 'inline',
  url: 'https://minddrop.app',
  children: [{ text: 'MindDrop website' }],
};

export const inlineMathElement1: InlineElement<TestMathElementData> = {
  type: 'math-inline',
  level: 'inline',
  expression: inlineMathElement1PlainText,
  children: [{ text: '' }],
};

/* **************** */
/* Combined exports */
/* **************** */

// Element configs
export const elementConfigs = [
  headingElementConfig,
  paragraphElementConfig,
  blockMathElementConfig,
  toDoElementConfig,
  linkElementConfig,
  inlineMathElementConfig,
];

// Block level elements
export const blockElements = [
  headingElement1,
  headingElement2,
  headingElement3,
  headingElement4,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  paragraphElement4,
  emptyParagraphElement,
  blockMathElement1,
  toDoElementCompleted1,
  toDoElementIncomplete1,
];

// Inline level elements
export const inlineElements = [linkElement1, inlineMathElement1];

// All elements
export const elements = [...blockElements, ...inlineElements];
