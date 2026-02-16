import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, userEvent } from '@minddrop/test-utils';
import { Toggle } from './Toggle';

describe('<Toggle />', () => {
  afterEach(cleanup);

  it('calls onCheckedChange when clicked', async () => {
    const onCheckedChange = vi.fn();
    const { getByRole } = render(
      <Toggle label="" checked={false} onCheckedChange={onCheckedChange} />,
    );
    const toggle = getByRole('button');

    await userEvent.click(toggle);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
