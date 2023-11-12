import { describe, afterEach, it, expect, vi } from 'vitest';
import { cleanup } from '../../test-utils';
import { render, userEvent } from '@minddrop/test-utils';
import {
  WorkspaceOptionsMenu,
  WorkspaceOptionsMenuProps,
} from './WorkspaceOpionsMenu';

const WORKSPACE_PATH = 'path/to/Workspace';

const renderMenu = (props?: Partial<WorkspaceOptionsMenuProps>) => {
  return render(
    <WorkspaceOptionsMenu open path={WORKSPACE_PATH} {...props}>
      <div />
    </WorkspaceOptionsMenu>,
    { translationKeyPrefix: 'workspaces.actions' },
  );
};

describe('<WorkspaceOptionsMenu />', () => {
  afterEach(cleanup);

  it('calls onSelectRename', async () => {
    const onSelectRename = vi.fn();

    const { getByTranslatedText } = renderMenu({ onSelectRename });

    // Click the rename menu item
    await userEvent.click(getByTranslatedText('rename.action'));

    // Should call the onSelectRename callback
    expect(onSelectRename).toHaveBeenCalled();
  });

  it('calls onSelectChangeIcon', async () => {
    const onSelectChangeIcon = vi.fn();

    const { getByTranslatedText } = renderMenu({ onSelectChangeIcon });

    // Click the change menu item
    await userEvent.click(getByTranslatedText('changeIcon'));

    // Should call the onSelectChangeIcon callback
    expect(onSelectChangeIcon).toHaveBeenCalled();
  });

  it('calls onSelectMove', async () => {
    const onSelectMove = vi.fn();

    const { getByTranslatedText } = renderMenu({ onSelectMove });

    // Click the move menu item
    await userEvent.click(getByTranslatedText('move.action'));

    // Should call the onSelectMove callback
    expect(onSelectMove).toHaveBeenCalled();
  });

  it('calls onSelectRemove', async () => {
    const onSelectRemove = vi.fn();

    const { getByTranslatedText } = renderMenu({ onSelectRemove });

    // Click the remove menu item
    await userEvent.click(getByTranslatedText('remove.action'));

    // Should call the onSelectRemove callback
    expect(onSelectRemove).toHaveBeenCalled();
  });

  it('calls onSelectDelete', async () => {
    const onSelectDelete = vi.fn();

    const { getByTranslatedText } = renderMenu({ onSelectDelete });

    // Click the delete menu item
    await userEvent.click(getByTranslatedText('delete.action'));

    // Should call the onSelectDelete callback
    expect(onSelectDelete).toHaveBeenCalled();
  });

  it('calls onSelectRevealInFileExplorer', async () => {
    const onSelectRevealInFileExplorer = vi.fn();

    const { getByTranslatedText } = renderMenu({
      onSelectRevealInFileExplorer,
    });

    // Click the reveal in file explorer menu item
    await userEvent.click(getByTranslatedText('revealInFileExplorer.macos'));

    // Should call the onSelectRevealInFileExplorer callback
    expect(onSelectRevealInFileExplorer).toHaveBeenCalled();
  });
});
