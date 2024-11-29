import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup, fireEvent } from '@minddrop/test-utils';
import { DOCUMENTS_TEST_DATA } from '@minddrop/documents';
import { DocumentNavItem } from './DocumentNavItem';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { AppUiState } from '../../AppUiState';

const { document1 } = DOCUMENTS_TEST_DATA;

initializeMockFileSystem();

describe('<DocumentNavItem />', () => {
  afterEach(cleanup);

  it('renders', () => {
    render(<DocumentNavItem document={document1} />);
  });

  it('sets the document as active when clicked', () => {
    const { getByText } = render(<DocumentNavItem document={document1} />);

    // Click the document nav item
    fireEvent.click(getByText(document1.title));

    // Should make the document active
    expect(AppUiState.get('activeDocumentId')).toBe(document1.id);
  });
});
