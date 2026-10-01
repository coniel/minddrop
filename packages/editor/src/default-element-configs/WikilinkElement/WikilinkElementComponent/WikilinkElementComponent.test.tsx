import { afterEach, describe, expect, it } from 'vitest';
import { Ast, ParagraphElement, WikilinkElement } from '@minddrop/ast';
import { render, userEvent } from '@minddrop/test-utils';
import { RichTextEditor } from '../../../RichTextEditor';
import { cleanup } from '../../../test-utils';

// A paragraph holding a wikilink pointing into its target
const paragraph = Ast.generateElement<ParagraphElement>('paragraph', {
  children: [
    { text: '' },
    Ast.generateElement<WikilinkElement>('wikilink', {
      reference: 'Paper',
      fragment: '^abcd1234',
      children: [{ text: 'Paper' }],
    }),
    { text: '' },
  ],
});

describe('WikilinkElementComponent', () => {
  afterEach(cleanup);

  it('opens what the link points at when pressed', async () => {
    // What the followed links pointed at
    const followed: [string, string | undefined][] = [];
    const { getByRole } = render(
      <RichTextEditor
        initialValue={[paragraph]}
        onOpenWikilink={(reference, fragment) => {
          followed.push([reference, fragment]);
        }}
      />,
    );

    await userEvent.click(getByRole('link'));

    expect(followed).toEqual([['Paper', '^abcd1234']]);
  });
});
