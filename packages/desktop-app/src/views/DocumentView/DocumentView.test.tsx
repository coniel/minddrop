import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { DocumentView } from './DocumentView';

describe('<DocumentView />', () => {
  afterEach(cleanup);

  it('renders', () => {
    render(<DocumentView path="" />);
  });
});
