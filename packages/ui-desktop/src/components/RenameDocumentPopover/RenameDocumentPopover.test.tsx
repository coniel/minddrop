import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DOCUMENTS_TEST_DATA, Documents } from '@minddrop/documents';
import { PathConflictError } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { render, userEvent, waitFor } from '@minddrop/test-utils';
import { Popover, TooltipProvider } from '@minddrop/ui-elements';
import { cleanup } from '../../test-utils';
import { RenameDocumentPopover } from './RenameDocumentPopover';

const { document1 } = DOCUMENTS_TEST_DATA;

const NEW_DOCUMENT_NAME = 'New name';

const inputPlaceholder = i18n.t(
  'documents.actions.rename.form.name.placeholder',
);
const conflictError = i18n.t(
  'documents.actions.rename.form.name.error.conflict',
);

const onClose = vi.fn();

function renderPopover() {
  const renderResult = render(
    <TooltipProvider>
      <div data-testid="click-away">
        <Popover open>
          <RenameDocumentPopover document={document1} onClose={onClose} />
        </Popover>
      </div>
    </TooltipProvider>,
  );

  const { getByPlaceholderText } = renderResult;

  const nameInput = getByPlaceholderText(inputPlaceholder);

  return { ...renderResult, nameInput };
}

describe('<RenameDocumentPopover>', () => {
  beforeEach(() => {
    vi.spyOn(Documents, 'rename').mockResolvedValue(document1);
  });

  afterEach(cleanup);

  it('renames the document on submit', async () => {
    const { nameInput } = renderPopover();

    // Clear the input
    await userEvent.clear(nameInput);

    // Type new name
    await userEvent.type(nameInput, NEW_DOCUMENT_NAME);

    // Press Enter key to sumbit form
    await userEvent.type(nameInput, '{enter}');

    // Should rename the document
    expect(Documents.rename).toHaveBeenCalledWith(
      document1.id,
      NEW_DOCUMENT_NAME,
    );

    // Should close the popover
    expect(onClose).toHaveBeenCalled();
  });

  it('submits on click away', async () => {
    const { nameInput, getByTestId } = renderPopover();

    // Clear the input
    await userEvent.clear(nameInput);

    // Append some text to the end of the document name
    await userEvent.type(nameInput, NEW_DOCUMENT_NAME);

    // Press Enter key to sumbit form
    await userEvent.click(getByTestId('click-away'));

    // Should rename the document
    expect(Documents.rename).toHaveBeenCalledWith(
      document1.id,
      NEW_DOCUMENT_NAME,
    );

    // Should close the popover
    expect(onClose).toHaveBeenCalled();
  });

  it('cancels on Escape key', async () => {
    const { nameInput } = renderPopover();

    // Clear the input
    await userEvent.clear(nameInput);

    // Type new name
    await userEvent.type(nameInput, NEW_DOCUMENT_NAME);

    // Press Escape key to cancel
    await userEvent.type(nameInput, '{escape}');

    // Should not rename document
    expect(Documents.rename).not.toHaveBeenCalled();

    // Should close the popover
    expect(onClose).toHaveBeenCalled();
  });

  it('does nothing if name is unchanged', async () => {
    const { nameInput } = renderPopover();

    // Press Enter key to sumbit form
    await userEvent.type(nameInput, '{enter}');

    // Should not rename the document
    expect(Documents.rename).not.toHaveBeenCalled();

    // Should close the popover
    expect(onClose).toHaveBeenCalled();
  });

  it('does nothing if name is empty', async () => {
    const { nameInput } = renderPopover();

    // Clear the input
    await userEvent.clear(nameInput);

    // Press Enter key to sumbit form
    await userEvent.type(nameInput, '{enter}');

    // Should not rename the document
    expect(Documents.rename).not.toHaveBeenCalled();

    // Should close the popover
    expect(onClose).toHaveBeenCalled();
  });

  it('shows error on conflict', async () => {
    // Pretend there is a name conflict
    vi.spyOn(Documents, 'rename').mockImplementation(() => {
      throw new PathConflictError('');
    });

    const { nameInput, getByText } = renderPopover();

    // Clear the input
    await userEvent.clear(nameInput);

    // Type new name
    await userEvent.type(nameInput, NEW_DOCUMENT_NAME);

    // Press Enter key to sumbit form
    await userEvent.type(nameInput, '{enter}');

    // Should display error
    waitFor(() => getByText(conflictError));

    // Should not close the popover
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when submitting same invalid value twice', async () => {
    // Pretend there is a name conflict
    vi.spyOn(Documents, 'rename').mockImplementation(() => {
      throw new PathConflictError('');
    });

    const { nameInput } = renderPopover();

    // Clear the input
    await userEvent.clear(nameInput);

    // Type new name
    await userEvent.type(nameInput, NEW_DOCUMENT_NAME);

    // Press Enter key to sumbit form
    await userEvent.type(nameInput, '{enter}');
    // Press Enter key to sumbit form again
    await userEvent.type(nameInput, '{enter}');

    // Should not call rename again
    expect(Documents.rename).toHaveBeenCalledTimes(1);

    // Should close the popover
    expect(onClose).toHaveBeenCalled();
  });
});
