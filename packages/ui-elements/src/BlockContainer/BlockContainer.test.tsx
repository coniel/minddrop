import { describe, afterEach, expect, it } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { BlockContainer } from './BlockContainer';

describe('<BlockContainer />', () => {
  afterEach(cleanup);

  it('renders children', () => {
    const { getByText } = render(
      <BlockContainer className="my-class">content</BlockContainer>,
    );

    getByText('content');
  });

  it('supports colors', () => {
    const { getByText } = render(
      <BlockContainer color="red">content</BlockContainer>,
    );

    expect(getByText('content').className).toContain('color-red');
  });
});
