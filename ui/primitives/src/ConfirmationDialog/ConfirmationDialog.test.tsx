import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { ConfirmationDialog } from './ConfirmationDialog';

// A message whose translation interpolates a count, and whose key
// has a plural form for each count.
const message = 'design-studio.dashboard.layoutCount';

describe('<ConfirmationDialog />', () => {
  afterEach(cleanup);

  it('interpolates the given values into the message', () => {
    render(
      <ConfirmationDialog
        open
        message={message}
        values={{ count: 4 }}
        onConfirm={() => {}}
      />,
    );

    expect(screen.getByText('4 layouts')).toBeInTheDocument();
  });

  it('picks the plural form matching the count', () => {
    render(
      <ConfirmationDialog
        open
        message={message}
        values={{ count: 1 }}
        onConfirm={() => {}}
      />,
    );

    expect(screen.getByText('1 layout')).toBeInTheDocument();
  });
});
