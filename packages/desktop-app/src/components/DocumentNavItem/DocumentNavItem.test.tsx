import { afterEach, describe, expect, it } from 'vitest';
import { DOCUMENTS_TEST_DATA } from '@minddrop/documents';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { cleanup, fireEvent, render } from '@minddrop/test-utils';
import { TooltipProvider } from '@minddrop/ui-elements';
import { AppUiState } from '../../AppUiState';
import { DocumentNavItem } from './DocumentNavItem';

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
