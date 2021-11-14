import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { DropNote } from './DropNote';

describe('<DropNote />', () => {
  afterEach(cleanup);

  it('renders children', () => {
    render(<DropNote>Note</DropNote>);

    screen.getByText('Note');
  });
});
