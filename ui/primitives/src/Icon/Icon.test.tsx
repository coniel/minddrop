import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { Icon } from './Icon';

describe('<Icon />', () => {
  afterEach(cleanup);

  it('turns the icon by its rotation', async () => {
    render(<Icon name="ruler-dimension-line" rotation={-90} />);

    // The icon loads asynchronously, so wait for it to render
    const icon = await screen.findByTestId('icon');

    expect(icon.style.transform).toBe('rotate(-90deg)');
  });

  it('leaves the icon unturned without a rotation', async () => {
    render(<Icon name="ruler-dimension-line" />);

    const icon = await screen.findByTestId('icon');

    expect(icon.style.transform).toBe('');
  });
});
