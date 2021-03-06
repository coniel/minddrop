import { Node } from 'slate';
import { ResourceReferences } from '@minddrop/resources';
import { RTElement, RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { setup, cleanup, createTestEditor } from '../test-utils';
import { Transforms } from '../Transforms';
import { withParentReferences } from './withParentReferences';
import { arrayContainsObject } from '@minddrop/utils';

const {
  richTextDocument1,
  paragraphElement1,
  paragraphElement2,
  linkElement1,
} = RICH_TEXT_TEST_DATA;

describe('withParentReferences', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the document as a parent on inserted elements', () => {
    // Create an editor with the plugin applied,
    // containg a paragraph element.
    const editor = withParentReferences(
      createTestEditor([paragraphElement1]),
      richTextDocument1.id,
    );

    // Insert a new inline element into the paragraph
    Transforms.insertNodes(editor, linkElement1, { at: [0, 0] });

    // The document reference
    const parentReference = ResourceReferences.generate(
      'rich-text:document',
      richTextDocument1.id,
    );

    // Get the inserted element, it has index 1 because a text
    // node will be inserted before it during normalization.
    const element = Node.get(editor, [0, 1]) as RTElement;

    // The inserted element should have the document parent reference
    expect(arrayContainsObject(element.parents, parentReference)).toBeTruthy();
  });

  it('does not add the document as a parent if already present', () => {
    // Create an editor with the plugin applied, containg a
    // paragraph element.
    const editor = withParentReferences(
      createTestEditor([paragraphElement1]),
      richTextDocument1.id,
    );

    // Insert a new inline element which already has the document as
    // a parent into the paragraph.
    Transforms.insertNodes(
      editor,
      {
        ...linkElement1,

        parents: [
          ResourceReferences.generate(
            'rich-text:document',
            richTextDocument1.id,
          ),
        ],
      },
      { at: [0, 0] },
    );

    // Get the inserted element, it has index 1 because a text
    // node will be inserted before it during normalization.
    const element = Node.get(editor, [0, 1]) as RTElement;

    // The inserted element should only contain a signel reference
    // to the document.
    expect(
      ResourceReferences.get('rich-text:document', element.parents).length,
    ).toBe(1);
  });

  it('adds the parent element as a parent on inline elements', () => {
    // Create an editor with the plugin applied,
    // containg a paragraph element.
    const editor = withParentReferences(
      createTestEditor([paragraphElement1]),
      richTextDocument1.id,
    );

    // Insert a new inline element into the paragraph
    Transforms.insertNodes(editor, linkElement1, { at: [0, 0] });

    // The parent element's reference
    const parentReference = ResourceReferences.generate(
      'rich-text:element',
      paragraphElement1.id,
    );

    // Get the inserted element, it has index 1 because a text
    // node will be inserted before it during normalization.
    const element = Node.get(editor, [0, 1]) as RTElement;

    // The inserted element should have the parent reference
    expect(arrayContainsObject(element.parents, parentReference)).toBeTruthy();
  });

  it('does not add the parent element as a parent if already preset', () => {
    // Create an editor with the plugin applied, containg a paragraph
    // paragraph element.
    const editor = withParentReferences(
      createTestEditor([paragraphElement1]),
      richTextDocument1.id,
    );

    // Insert a new inline element which already has the paragraph as
    // a parent into the paragraph.
    Transforms.insertNodes(
      editor,
      {
        ...linkElement1,
        parents: [
          ResourceReferences.generate(
            'rich-text:element',
            paragraphElement1.id,
          ),
        ],
      },
      { at: [0, 0] },
    );

    // Get the inserted element, it has index 1 because a text
    // node will be inserted before it during normalization.
    const element = Node.get(editor, [0, 1]) as RTElement;

    // The inserted element should contain only a single refernece to
    // the parent element.
    expect(
      ResourceReferences.getIds('rich-text:element', element.parents).length,
    ).toBe(1);
  });

  it('updates the parent element reference on children of a split off element', () => {
    // Create an editor with the plugin applied, containg a paragraph
    // element with a link element as its child.
    const editor = withParentReferences(
      createTestEditor([
        {
          ...paragraphElement1,
          children: [
            { text: '' },
            {
              ...linkElement1,
              parents: [
                ResourceReferences.generate(
                  'rich-text:element',
                  paragraphElement1.id,
                ),
              ],
            },
            { text: '' },
          ],
        },
      ]),
      richTextDocument1.id,
    );

    // Split the paragraph element so the the link child element
    // ends up in the newly created paragraph element.
    Transforms.splitNodes(editor, {
      at: [0, 1],
    });

    // Get the new paragraph element
    const paragraph = Node.get(editor, [1]) as RTElement;
    // Get the link element from the new paragraph
    const element = Node.get(editor, [1, 1]) as RTElement;

    // The old parent reference
    const oldParentRef = ResourceReferences.generate(
      'rich-text:element',
      paragraphElement1.id,
    );
    // The new parent reference
    const newParentRef = ResourceReferences.generate(
      'rich-text:element',
      paragraph.id,
    );

    // Link element should no longer contain the old parent's reference
    expect(arrayContainsObject(element.parents, oldParentRef)).toBeFalsy();
    // Link element should contain the new parent's reference
    expect(arrayContainsObject(element.parents, newParentRef)).toBeTruthy();
  });

  it('updates the parent element reference on children of a merged in element', () => {
    // Create an editor with the plugin applied, containg two paragraph
    // elements, the second with a link element as its child.
    const editor = withParentReferences(
      createTestEditor([
        paragraphElement1,
        {
          ...paragraphElement2,
          children: [
            { text: '' },
            {
              ...linkElement1,
              parents: [
                ResourceReferences.generate(
                  'rich-text:element',
                  paragraphElement2.id,
                ),
              ],
            },
            { text: '' },
          ],
        },
      ]),
      richTextDocument1.id,
    );

    // Merge the paragraph elements
    Transforms.mergeNodes(editor, {
      at: [1],
    });

    // Get the link element
    const element = Node.get(editor, [0, 1]) as RTElement;

    // The old parent reference
    const oldParentRef = ResourceReferences.generate(
      'rich-text:element',
      paragraphElement2.id,
    );
    // The new parent reference
    const newParentRef = ResourceReferences.generate(
      'rich-text:element',
      paragraphElement1.id,
    );

    // Link element should no longer contain the old parent's reference
    expect(arrayContainsObject(element.parents, oldParentRef)).toBeFalsy();
    // Link element should contain the new parent's reference
    expect(arrayContainsObject(element.parents, newParentRef)).toBeTruthy();
  });
});
