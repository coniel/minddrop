import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { BoardColumnsNode } from './BoardColumnsNode';

describe('<BoardColumnsNode />', () => {
  afterEach(cleanup);

  it('renders', () => {
    render(<BoardColumnsNode />);
  });
});
