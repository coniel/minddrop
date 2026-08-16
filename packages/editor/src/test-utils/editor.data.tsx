import {
  Ast,
  HeadingElement,
  InlineMathElement,
  LinkElement,
  ListItemFrame,
  MathElement,
  ParagraphElement,
  ThematicBreakElement,
} from '@minddrop/ast';
import { MarkConfigs } from '../MarkConfigs';
import { EditorBlockElementConfig } from '../types';
import { TITLE_ELEMENT_TYPE, TitleElement } from '../withTitle';

export {
  boldMarkConfig,
  italicMarkConfig,
  strikethroughMarkConfig,
  codeMarkConfig,
} from '../MarkConfigs';

export const EDITOR_TEST_DATA = {
  markConfigs: MarkConfigs,
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
  menuItems: [
    {
      label: 'editor.elements.heading-1.name',
      icon: 'heading-1',
      data: { level: 1 },
    },
    {
      label: 'editor.elements.heading-2.name',
      icon: 'heading-2',
      data: { level: 2 },
    },
  ],
};

// Paragraph element
export const paragraphElementConfig: EditorBlockElementConfig<ParagraphElement> =
  {
    type: 'paragraph',
    component: ({ children, attributes }) => (
      <div {...attributes}>{children}</div>
    ),
    menuItems: [
      {
        label: 'editor.elements.paragraph.name',
        icon: 'pilcrow',
      },
    ],
  };

export const mathElementConfig: EditorBlockElementConfig<MathElement> = {
  type: 'math',
  convert: (element) =>
    Ast.generateElement<MathElement>('math', {
      children: [{ text: Ast.toPlainText(element) }],
    }),
  component: ({ attributes, children }) => (
    <div {...attributes}>{children}</div>
  ),
};

/* ********************** */
/* Inline element configs */
/* ********************** */

export const linkElementConfig: EditorBlockElementConfig<LinkElement> = {
  type: 'link',
  component: ({ attributes, children, element }) => (
    <a {...attributes} href={element.url}>
      {children}
    </a>
  ),
};

export const inlineMathElementConfig: EditorBlockElementConfig<InlineMathElement> =
  {
    type: 'inline-math',
    component: ({ attributes, children }) => (
      <span {...attributes}>{children}</span>
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
export const mathElement1PlainText = 'e=mc^2';
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

// Title
export const titleElement1PlainText = 'Newtonian mechanics';
export const titleElement1 = Ast.generateElement<TitleElement>(
  TITLE_ELEMENT_TYPE,
  {
    children: [{ text: titleElement1PlainText }],
  },
);
export const emptyTitleElement =
  Ast.generateElement<TitleElement>(TITLE_ELEMENT_TYPE);

// Math block
export const mathElement1 = Ast.generateElement<MathElement>('math', {
  children: [{ text: mathElement1PlainText }],
});

// Thematic break, the simplest void block
export const thematicBreakElement1 = Ast.generateElement<ThematicBreakElement>(
  'thematic-break',
  {
    syntax: '---',
  },
);

/* ****** */
/* Frames */
/* ****** */

export const listItemFrame1: ListItemFrame = {
  id: 'list-item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

export const listItemFrame2: ListItemFrame = {
  id: 'list-item-2',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

// Task items, which are list items carrying a checked state
export const taskItemFrameCompleted: ListItemFrame = {
  ...listItemFrame1,
  checked: true,
};

export const taskItemFrameIncomplete: ListItemFrame = {
  ...listItemFrame2,
  checked: false,
};

// List item blocks
export const listItemElement1 = Ast.generateElement<ParagraphElement>(
  'paragraph',
  {
    ancestry: [listItemFrame1],
    children: [{ text: 'First item' }],
  },
);

export const listItemElement2 = Ast.generateElement<ParagraphElement>(
  'paragraph',
  {
    ancestry: [listItemFrame2],
    children: [{ text: 'Second item' }],
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

export const inlineMathElement1 = Ast.generateElement<InlineMathElement>(
  'inline-math',
  {
    children: [{ text: inlineMathElement1PlainText }],
  },
);

/* **************** */
/* Combined exports */
/* **************** */

// Block element configs
export const blockElementConfigs = [
  headingElementConfig,
  paragraphElementConfig,
  mathElementConfig,
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
  mathElement1,
  thematicBreakElement1,
  listItemElement1,
  listItemElement2,
];

// Inline level elements
export const inlineElements = [linkElement1, inlineMathElement1];

// All elements
export const elements = [...blockElements, ...inlineElements];
