import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { BoardNode } from './BoardNode';

describe('<BoardNode />', () => {
  afterEach(cleanup);

  it('renders', () => {
    render(<BoardNode />);
  });
});
