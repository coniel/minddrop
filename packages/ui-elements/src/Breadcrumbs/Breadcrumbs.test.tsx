import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { Breadcrumb } from './Breadcrumb';
import { Breadcrumbs } from './Breadcrumbs';

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
