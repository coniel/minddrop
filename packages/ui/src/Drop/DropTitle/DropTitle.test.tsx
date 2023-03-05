import { describe, afterEach, it } from 'vitest';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { DropTitle } from './DropTitle';

describe('<DropTitle />', () => {
  afterEach(cleanup);

  it('renders children', () => {
    render(<DropTitle>Title</DropTitle>);

    screen.getByText('Title');
  });
});
