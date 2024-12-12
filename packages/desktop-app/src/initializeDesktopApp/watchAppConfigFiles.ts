import { watchImmediate, WatchEvent } from '@tauri-apps/plugin-fs';
import { appConfigDir } from '@tauri-apps/api/path';
import { Workspaces, WorkspacesConfigFileName } from '@minddrop/workspaces';
import { throttle } from '@minddrop/utils';
import { AppUiState } from '../AppUiState';

export async function watchAppConfigFiles() {
  // Get the app configs dir
  const dir = await appConfigDir();

  // Watch the app configs directory
  return watchImmediate(`${dir}`, (event) => handleWatcherEvent(event));
}

const handleWorkspacesConfigEventThrottled = throttle(
  handleWorkspacesConfigEvent,
  100,
);

function handleWatcherEvent(event: WatchEvent) {
  if (
    event.paths.some((eventPath) =>
      eventPath.includes(WorkspacesConfigFileName),
    )
  ) {
    handleWorkspacesConfigEventThrottled();
  }
}

async function handleWorkspacesConfigEvent() {
  await Workspaces.load();

  if (Workspaces.hasValidWorkspace() && !AppUiState.get('view')) {
    AppUiState.set('view', 'home');
  }
}
