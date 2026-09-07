import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { DatabaseEmptyMode } from './DatabaseEmptyMode';

describe('<DatabaseEmptyMode />', () => {
  afterEach(cleanup);

  it('renders the empty placeholder', () => {
    const { container } = render(<DatabaseEmptyMode />);

    expect(container.querySelector('.database-empty-mode')).not.toBeNull();
    screen.getByText('databases.empty.title');
  });
});
