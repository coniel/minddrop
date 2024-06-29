import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { BoardColumnNode } from './BoardColumnNode';

describe('<BoardColumnNode />', () => {
  afterEach(cleanup);

  it('renders', () => {
    render(<BoardColumnNode />);
  });
});
