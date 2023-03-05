import { describe, afterEach, expect, it } from 'vitest';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { Drop } from './Drop';

describe('<Drop />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<Drop className="my-class">content</Drop>);

    expect(screen.getByText('content').className).toContain('my-class');
  });

  it('supports colors', () => {
    render(<Drop color="red">content</Drop>);

    expect(screen.getByText('content').className).toContain('color-red');
  });
});
