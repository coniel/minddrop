import { RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { addChildrenToVoidElements } from './addChildrenToVoidElements';

const { paragraphElement1, inlineEquationElement1, blockEquationElement1 } =
  RICH_TEXT_TEST_DATA;

const children = [
  {
    ...paragraphElement1,
    children: [{ text: 'Hello' }, inlineEquationElement1, { text: 'world' }],
  },
  blockEquationElement1,
];

describe('addChildrenToVoidElements', () => {
  it('adds children to void elements', () => {
    // Add children to void elements
    const result = addChildrenToVoidElements(children);

    // Should add children to root level elements
    expect(result[1].children).toEqual([{ text: '' }]);
    // Should add children to nested elements
    expect(result[0].children[1].children).toEqual([{ text: '' }]);
  });

  it('ignores text nodes', () => {
    // Add children to void elements
    const result = addChildrenToVoidElements(children);

    // Should not modify text nodes
    expect(result[0].children[0]).toEqual({ text: 'Hello' });
  });
});
