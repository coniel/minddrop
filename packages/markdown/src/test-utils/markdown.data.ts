import { TokenList } from '../types';

export const mdContentTopic = `# Topic title

## Column header

### Drop 1 header

**Drop 1** text
ffoo

More **_drop 1_** text

### Drop 2 header

- [ ] Drop 2 list item 1
- [ ] Drop 2 list item 2
- [x] Drop 2 list item 3

## Header 2

---

[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos

[StudyRabbit](https://studyrabbit.net) - IB maths done right

[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos

[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos

[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos

[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos

![1e33c74e50d23bea-large.pdf](foo.pdf "A beautiful specimen of foo")`;

export const tokenContentTopic: TokenList = [
  {
    type: 'heading',
    raw: '# Topic title\n\n',
    depth: 1,
    text: 'Topic title',
    tokens: [{ type: 'text', raw: 'Topic title', text: 'Topic title' }],
  },
  {
    type: 'heading',
    raw: '## Column header\n\n',
    depth: 2,
    text: 'Column header',
    tokens: [{ type: 'text', raw: 'Column header', text: 'Column header' }],
  },
  {
    type: 'heading',
    raw: '### Drop 1 header\n\n',
    depth: 3,
    text: 'Drop 1 header',
    tokens: [{ type: 'text', raw: 'Drop 1 header', text: 'Drop 1 header' }],
  },
  {
    type: 'paragraph',
    raw: '**Drop 1** text\nffoo',
    text: '**Drop 1** text\nffoo',
    tokens: [
      {
        type: 'strong',
        raw: '**Drop 1**',
        text: 'Drop 1',
        tokens: [{ type: 'text', raw: 'Drop 1', text: 'Drop 1' }],
      },
      { type: 'text', raw: ' text\nffoo', text: ' text\nffoo' },
    ],
  },
  { type: 'space', raw: '\n\n' },
  {
    type: 'paragraph',
    raw: 'More **_drop 1_** text',
    text: 'More **_drop 1_** text',
    tokens: [
      { type: 'text', raw: 'More ', text: 'More ' },
      {
        type: 'strong',
        raw: '**_drop 1_**',
        text: '_drop 1_',
        tokens: [
          {
            type: 'em',
            raw: '_drop 1_',
            text: 'drop 1',
            tokens: [{ type: 'text', raw: 'drop 1', text: 'drop 1' }],
          },
        ],
      },
      { type: 'text', raw: ' text', text: ' text' },
    ],
  },
  { type: 'space', raw: '\n\n' },
  {
    type: 'heading',
    raw: '### Drop 2 header\n\n',
    depth: 3,
    text: 'Drop 2 header',
    tokens: [{ type: 'text', raw: 'Drop 2 header', text: 'Drop 2 header' }],
  },
  {
    type: 'list',
    raw: '- [ ] Drop 2 list item 1\n- [ ] Drop 2 list item 2\n- [x] Drop 2 list item 3',
    ordered: false,
    start: '',
    loose: false,
    items: [
      {
        type: 'list_item',
        raw: '- [ ] Drop 2 list item 1\n',
        task: true,
        checked: false,
        loose: false,
        text: 'Drop 2 list item 1',
        tokens: [
          {
            type: 'text',
            raw: 'Drop 2 list item 1',
            text: 'Drop 2 list item 1',
            tokens: [
              {
                type: 'text',
                raw: 'Drop 2 list item 1',
                text: 'Drop 2 list item 1',
              },
            ],
          },
        ],
      },
      {
        type: 'list_item',
        raw: '- [ ] Drop 2 list item 2\n',
        task: true,
        checked: false,
        loose: false,
        text: 'Drop 2 list item 2',
        tokens: [
          {
            type: 'text',
            raw: 'Drop 2 list item 2',
            text: 'Drop 2 list item 2',
            tokens: [
              {
                type: 'text',
                raw: 'Drop 2 list item 2',
                text: 'Drop 2 list item 2',
              },
            ],
          },
        ],
      },
      {
        type: 'list_item',
        raw: '- [x] Drop 2 list item 3',
        task: true,
        checked: true,
        loose: false,
        text: 'Drop 2 list item 3',
        tokens: [
          {
            type: 'text',
            raw: 'Drop 2 list item 3',
            text: 'Drop 2 list item 3',
            tokens: [
              {
                type: 'text',
                raw: 'Drop 2 list item 3',
                text: 'Drop 2 list item 3',
              },
            ],
          },
        ],
      },
    ],
  },
  { type: 'space', raw: '\n\n' },
  {
    type: 'heading',
    raw: '## Header 2\n\n',
    depth: 2,
    text: 'Header 2',
    tokens: [{ type: 'text', raw: 'Header 2', text: 'Header 2' }],
  },
  { type: 'hr', raw: '---\n\n' },
  {
    type: 'paragraph',
    raw: '[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos',
    text: '[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos',
    tokens: [
      {
        type: 'link',
        raw: '[IB Guides](https://ibguides.com)',
        href: 'https://ibguides.com',
        title: null,
        text: 'IB Guides',
        tokens: [{ type: 'text', raw: 'IB Guides', text: 'IB Guides' }],
      },
      {
        type: 'text',
        raw: ' - International Baccalaureate study guides, notes, and videos',
        text: ' - International Baccalaureate study guides, notes, and videos',
      },
    ],
  },
  { type: 'space', raw: '\n\n' },
  {
    type: 'paragraph',
    raw: '[StudyRabbit](https://studyrabbit.net) - IB maths done right',
    text: '[StudyRabbit](https://studyrabbit.net) - IB maths done right',
    tokens: [
      {
        type: 'link',
        raw: '[StudyRabbit](https://studyrabbit.net)',
        href: 'https://studyrabbit.net',
        title: null,
        text: 'StudyRabbit',
        tokens: [{ type: 'text', raw: 'StudyRabbit', text: 'StudyRabbit' }],
      },
      {
        type: 'text',
        raw: ' - IB maths done right',
        text: ' - IB maths done right',
      },
    ],
  },
  { type: 'space', raw: '\n\n' },
  {
    type: 'paragraph',
    raw: '[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos',
    text: '[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos',
    tokens: [
      {
        type: 'link',
        raw: '[IB Guides](https://ibguides.com)',
        href: 'https://ibguides.com',
        title: null,
        text: 'IB Guides',
        tokens: [{ type: 'text', raw: 'IB Guides', text: 'IB Guides' }],
      },
      {
        type: 'text',
        raw: ' - International Baccalaureate study guides, notes, and videos',
        text: ' - International Baccalaureate study guides, notes, and videos',
      },
    ],
  },
  { type: 'space', raw: '\n\n' },
  {
    type: 'paragraph',
    raw: '[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos',
    text: '[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos',
    tokens: [
      {
        type: 'link',
        raw: '[IB Guides](https://ibguides.com)',
        href: 'https://ibguides.com',
        title: null,
        text: 'IB Guides',
        tokens: [{ type: 'text', raw: 'IB Guides', text: 'IB Guides' }],
      },
      {
        type: 'text',
        raw: ' - International Baccalaureate study guides, notes, and videos',
        text: ' - International Baccalaureate study guides, notes, and videos',
      },
    ],
  },
  { type: 'space', raw: '\n\n' },
  {
    type: 'paragraph',
    raw: '[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos',
    text: '[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos',
    tokens: [
      {
        type: 'link',
        raw: '[IB Guides](https://ibguides.com)',
        href: 'https://ibguides.com',
        title: null,
        text: 'IB Guides',
        tokens: [{ type: 'text', raw: 'IB Guides', text: 'IB Guides' }],
      },
      {
        type: 'text',
        raw: ' - International Baccalaureate study guides, notes, and videos',
        text: ' - International Baccalaureate study guides, notes, and videos',
      },
    ],
  },
  { type: 'space', raw: '\n\n' },
  {
    type: 'paragraph',
    raw: '[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos',
    text: '[IB Guides](https://ibguides.com) - International Baccalaureate study guides, notes, and videos',
    tokens: [
      {
        type: 'link',
        raw: '[IB Guides](https://ibguides.com)',
        href: 'https://ibguides.com',
        title: null,
        text: 'IB Guides',
        tokens: [{ type: 'text', raw: 'IB Guides', text: 'IB Guides' }],
      },
      {
        type: 'text',
        raw: ' - International Baccalaureate study guides, notes, and videos',
        text: ' - International Baccalaureate study guides, notes, and videos',
      },
    ],
  },
  { type: 'space', raw: '\n\n' },
  {
    type: 'paragraph',
    raw: '![1e33c74e50d23bea-large.pdf](foo.pdf "A beautiful specimen of foo")',
    text: '![1e33c74e50d23bea-large.pdf](foo.pdf "A beautiful specimen of foo")',
    tokens: [
      {
        type: 'image',
        raw: '![1e33c74e50d23bea-large.pdf](foo.pdf "A beautiful specimen of foo")',
        href: 'foo.pdf',
        title: 'A beautiful specimen of foo',
        text: '1e33c74e50d23bea-large.pdf',
      },
    ],
  },
] as TokenList;
