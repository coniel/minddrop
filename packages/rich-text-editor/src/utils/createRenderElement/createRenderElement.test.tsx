import React from 'react';
import {
  RTBlockElementConfig,
  RTBlockElementProps,
  RICH_TEXT_TEST_DATA,
} from '@minddrop/rich-text';
import { createRenderElement } from './createRenderElement';
import { render } from '@minddrop/test-utils';

const { headingElementConfig, paragraphElementConfig, paragraphElement1 } =
  RICH_TEXT_TEST_DATA;

const headingConfig: RTBlockElementConfig = {
  ...headingElementConfig,
  component: () => <div>heading</div>,
};

const paragraphConfig: RTBlockElementConfig = {
  ...paragraphElementConfig,
  component: () => <div>paragraph</div>,
};

const attributes: RTBlockElementProps['attributes'] = {
  id: paragraphElement1.id,
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
