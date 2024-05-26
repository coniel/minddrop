import { describe, it } from 'vitest';
import { BlockElementConfig, BlockElementProps } from '../../types';
import { createRenderElement } from './createRenderElement';
import { render } from '@minddrop/test-utils';
import {
  headingElementConfig,
  paragraphElement1,
  paragraphElementConfig,
} from '../../test-utils/editor.data';

const headingConfig: BlockElementConfig = {
  ...headingElementConfig,
  component: () => <div>heading</div>,
};

const paragraphConfig: BlockElementConfig = {
  ...paragraphElementConfig,
  component: () => <div>paragraph</div>,
};

const attributes: BlockElementProps['attributes'] = {
  'data-slate-node': 'element',
  ref: null,
};

describe('createRenderElement', () => {
  it('renders the appropriate element component', () => {
    // Create a renderElement function using a heading element
    // config and a paragraph element config.
    const renderElement = createRenderElement([headingConfig, paragraphConfig]);

    // Render a paragraph element
    const { getByText } = render(
      renderElement({
        attributes,
        element: paragraphElement1,
        children: [],
      }),
    );

    // Should render the `parapgraphConfig`'s elements
    getByText('paragraph');
  });

  it('renders children if the element type config is missing', () => {
    // Create a renderElement function using a heading element config
    const renderElement = createRenderElement([headingConfig]);

    // Render a paragraph element
    const { getByText } = render(
      renderElement({
        attributes,
        element: paragraphElement1,
        children: [<span key="1">children</span>],
      }),
    );

    // Should render the children
    getByText('children');
  });
});
