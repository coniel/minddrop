import { describe, afterEach, it, expect, vi } from 'vitest';
import { render, cleanup, userEvent } from '@minddrop/test-utils';
import { ContentListItem, ContentListItemProps } from './ContentListItem';

function renderTest(props?: Partial<ContentListItemProps>) {
  return render(<ContentListItem label="Test" {...props} />);
}

describe('<ContentListItem />', () => {
  afterEach(cleanup);

  it('renders the label', () => {
    const { getByText } = renderTest({ label: 'Test' });

    // Should render the label
    getByText('Test');
  });

  it('renders the icon', () => {
    const { getByText } = renderTest({ icon: 'A' });

    // Should render the icon
    getByText('A');
  });

  it('renders children collapsed', async () => {
    const { getByText, getByTranslatedLabelText, queryByText } = renderTest({
      children: 'Children',
    });

    // Should not render children initially
    expect(queryByText('Children')).toBeNull();

    // Click toggle icon to open chidlren
    await userEvent.click(getByTranslatedLabelText('expand'));

    // Should render the children
    getByText('Children');
  });

  it('calls onClick when clicking the label', async () => {
    const onClick = vi.fn();

    const { getByText } = renderTest({ onClick });

    // Click the label
    await userEvent.click(getByText('Test'));

    // Should call onClick
    expect(onClick).toHaveBeenCalled();
  });
});
