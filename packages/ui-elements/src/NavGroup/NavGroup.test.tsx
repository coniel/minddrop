import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { NavGroup } from './NavGroup';

describe('<NavGroup />', () => {
  afterEach(cleanup);

  it('renders children', () => {
    render(<NavGroup>content</NavGroup>);

    screen.getByText('content');
  });

  it('renders title and adds aria-labelledby', () => {
    render(<NavGroup title="Topics" />);

    screen.getByText('Topics');
    screen.getByLabelText('Topics');
  });

  it('adds aria-label', () => {
    render(<NavGroup label="Topics" />);

    screen.getByLabelText('Topics');
  });

  it('does not add aria-labelledby without a title', () => {
    render(<NavGroup label="Topics" />);

    expect(
      screen.getByLabelText('Topics').attributes.getNamedItem('aria-labelledby')
        ?.textContent,
    ).toBeUndefined();
  });

  it('does not add aria-label if title is present', () => {
    render(<NavGroup label="label" title="title" />);

    expect(screen.queryByLabelText('label')).toBe(null);
  });
});
