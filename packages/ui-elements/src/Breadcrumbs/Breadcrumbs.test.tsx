import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { Breadcrumbs } from './Breadcrumbs';
import { Breadcrumb } from './Breadcrumb';

describe('<Breadcrumbs />', () => {
  afterEach(cleanup);

  it('renders children separated by /', () => {
    render(
      <Breadcrumbs>
        <Breadcrumb label="level 1" />
        <Breadcrumb label="level 2" />
        <Breadcrumb label="level 3" />
      </Breadcrumbs>,
    );

    expect(screen.queryAllByRole('button').length).toBe(3);
    expect(screen.queryAllByText('/').length).toBe(2);
  });
});
