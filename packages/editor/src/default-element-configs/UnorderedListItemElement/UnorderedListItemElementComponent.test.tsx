import { describe, it, afterEach, beforeEach } from 'vitest';
import { render } from '@minddrop/test-utils';
import { Ast, UnorderedListItemElement } from '@minddrop/ast';
import { cleanup } from '../../test-utils';
import { RichTextEditor } from '../../RichTextEditor';
import { UnorderedListItemElementConfig } from './UnorderedListItemElementConfig';
import { EditorBlockElementConfigsStore } from '../../BlockElementTypeConfigsStore';

const ulItemElement = Ast.generateElement<UnorderedListItemElement>(
  'unordered-list-item',
  {
    children: [{ text: 'children' }],
  },
);

describe('UnorderedListItemElementComponent', () => {
  beforeEach(() => {
    // Register the test data 'unordered-list-item' element type
    EditorBlockElementConfigsStore.add(UnorderedListItemElementConfig);
  });

  afterEach(cleanup);

  it('renders it children', () => {
    // Render an editor containing a 'unordered-list-item' element
    const { getByText } = render(
      <RichTextEditor initialValue={[ulItemElement]} />,
    );

    // Should render children
    getByText('children');
  });
});
