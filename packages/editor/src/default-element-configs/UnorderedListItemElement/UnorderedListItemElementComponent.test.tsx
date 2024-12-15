import { afterEach, beforeEach, describe, it } from 'vitest';
import { Ast, UnorderedListItemElement } from '@minddrop/ast';
import { render } from '@minddrop/test-utils';
import { EditorBlockElementConfigsStore } from '../../BlockElementTypeConfigsStore';
import { RichTextEditor } from '../../RichTextEditor';
import { cleanup } from '../../test-utils';
import { UnorderedListItemElementConfig } from './UnorderedListItemElementConfig';

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
