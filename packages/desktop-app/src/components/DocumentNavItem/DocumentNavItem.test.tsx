import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup, fireEvent } from '@minddrop/test-utils';
import { DOCUMENTS_TEST_DATA } from '@minddrop/documents';
import { DocumentNavItem } from './DocumentNavItem';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { AppUiState } from '../../AppUiState';
import { TooltipProvider } from '@minddrop/ui-elements';

const { document1 } = DOCUMENTS_TEST_DATA;

initializeMockFileSystem();

describe('<DocumentNavItem />', () => {
  afterEach(cleanup);

  it('renders', () => {
    render(
      <TooltipProvider>
        <DocumentNavItem document={document1} />
      </TooltipProvider>,
    );
  });

  it('sets the document as active when clicked', () => {
    const { getByText } = render(
      <TooltipProvider>
        <DocumentNavItem document={document1} />
      </TooltipProvider>,
    );

    // Click the document nav item
    fireEvent.mouseDown(getByText(document1.title));

    // Should make the document active
    expect(AppUiState.get('activeDocumentId')).toBe(document1.id);
  });
});
