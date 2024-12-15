import {
  Ast,
  HeadingElement,
  ToDoElement,
  ParagraphElement,
  MathBlockElement,
  MathInlineElement,
  LinkElement,
} from '@minddrop/ast';
import { defaultMarkConfigs } from '../default-mark-configs';
import { EditorBlockElementConfig, EditorInlineElementConfig } from '../types';

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
export const headingElementConfig: EditorBlockElementConfig<HeadingElement> = {
  type: 'heading',
  component: ({ children, attributes }) => (
    <div {...attributes}>{children}</div>
  ),
};

// Paragraph element
export const paragraphElementConfig: EditorBlockElementConfig<ParagraphElement> =
  {
    type: 'paragraph',
    component: ({ children, attributes }) => (
      <div {...attributes}>{children}</div>
    ),
  };

export const toDoElementConfig: EditorBlockElementConfig<ToDoElement> = {
  type: 'to-do',
  initialize: () =>
    Ast.generateElement<ToDoElement>('to-do', {
      checked: false,
    }),
  component: ({ attributes, children }) => (
    <div {...attributes}>{children}</div>
  ),
};

export const blockMathElementConfig: EditorBlockElementConfig<MathBlockElement> =
  {
    type: 'math-block',
    isVoid: true,
    initialize: () =>
      Ast.generateElement<MathBlockElement>('math-block', {
        expression: '',
      }),
    convert: (element) =>
      Ast.generateElement<MathBlockElement>('math-block', {
        expression: Ast.toPlainText(element),
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

export const linkElementConfig: EditorInlineElementConfig<LinkElement> = {
  type: 'link',
  initialize: () =>
    Ast.generateElement<LinkElement>('link', {
      url: '',
    }),
  component: ({ attributes, children, element }) => (
    <a {...attributes} href={element.url}>
      {children}
    </a>
  ),
};

export const inlineMathElementConfig: EditorInlineElementConfig<MathInlineElement> =
  {
    type: 'math-inline',
    isVoid: true,
    initialize: () =>
      Ast.generateElement<MathInlineElement>('math-inline', {
        expression: '',
      }),
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
export const headingElement1 = Ast.generateElement<HeadingElement>('heading', {
  level: 1,
  children: [{ text: headingElement1PlainText }],
});
export const headingElement2 = Ast.generateElement<HeadingElement>('heading', {
  level: 2,
  children: [{ text: headingElement2PlainText }],
});
export const headingElement3 = Ast.generateElement<HeadingElement>('heading', {
  level: 3,
  children: [{ text: headingElement3PlainText }],
});
export const headingElement4 = Ast.generateElement<HeadingElement>('heading', {
  level: 4,
  children: [{ text: headingElement4PlainText }],
});

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
export const paragraphElement1 = Ast.generateElement<ParagraphElement>(
  'paragraph',
  {
    children: [{ text: paragraphElement1PlainText }],
  },
);
export const paragraphElement2 = Ast.generateElement<ParagraphElement>(
  'paragraph',
  {
    children: [{ text: paragraphElement2PlainText }],
  },
);
export const paragraphElement3 = Ast.generateElement<ParagraphElement>(
  'paragraph',
  {
    children: [{ text: paragraphElement3PlainText }],
  },
);
export const paragraphElement4 = Ast.generateElement<ParagraphElement>(
  'paragraph',
  {
    children: [{ text: paragraphElement4PlainText }],
  },
);
export const emptyParagraphElement =
  Ast.generateElement<ParagraphElement>('paragraph');

// Math block
export const blockMathElement1 = Ast.generateElement<MathBlockElement>(
  'math-block',
  {
    expression: blockMathElement1PlainText,
  },
);

// To-do
export const toDoElementCompleted1 = Ast.generateElement<ToDoElement>('to-do', {
  checked: true,
});

export const toDoElementIncomplete1 = Ast.generateElement<ToDoElement>(
  'to-do',
  {
    checked: false,
  },
);

/* *************** */
/* Inline elements */
/* *************** */

export const inlineMathElement1PlainText = 'E=mc^2';

// Link
export const linkElement1 = Ast.generateElement<LinkElement>('link', {
  url: 'https://minddrop.app',
  children: [{ text: 'MindDrop website' }],
});

export const inlineMathElement1 = Ast.generateElement<MathInlineElement>(
  'math-inline',
  {
    expression: inlineMathElement1PlainText,
  },
);

/* **************** */
/* Combined exports */
/* **************** */

// Block element configs
export const blockElementConfigs = [
  headingElementConfig,
  paragraphElementConfig,
  blockMathElementConfig,
  toDoElementConfig,
];

// Inline element configs
export const inlineElementConfigs = [
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
