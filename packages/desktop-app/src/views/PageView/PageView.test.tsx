import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { PageView } from './PageView';

describe('<PageView />', () => {
  afterEach(cleanup);

  it('renders', () => {
    render(<PageView path="" />);
  });
});
