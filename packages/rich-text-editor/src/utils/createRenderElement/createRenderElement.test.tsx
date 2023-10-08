import { describe, it } from 'vitest';
import {
  RichTextBlockElementConfig,
  RichTextBlockElementProps,
} from '../../types';
import { createRenderElement } from './createRenderElement';
import { render } from '@minddrop/test-utils';
import {
  headingElementConfig,
  paragraphElement1,
  paragraphElementConfig,
} from '../../test-utils/rich-text-editor.data';

const headingConfig: RichTextBlockElementConfig = {
  ...headingElementConfig,
  component: () => <div>heading</div>,
};

const paragraphConfig: RichTextBlockElementConfig = {
  ...paragraphElementConfig,
  component: () => <div>paragraph</div>,
};

const attributes: RichTextBlockElementProps['attributes'] = {
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
