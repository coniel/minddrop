import { watchImmediate, RawEvent } from 'tauri-plugin-fs-watch-api';
import { path } from '@tauri-apps/api';
import { Workspaces, WorkspacesConfigFile } from '@minddrop/workspaces';
import { throttle } from '@minddrop/utils';
import { AppUiState } from '../AppUiState';

export async function watchAppConfigFiles() {
  // Get the app configs dir
  const dir = await path.appDir();

  // Watch the app configs directory
  return watchImmediate(`${dir}`, handleWatcherEvent);
}

const handleWorkspacesConfigEventThrottled = throttle(
  handleWorkspacesConfigEvent,
  1000,
);

function handleWatcherEvent(event: RawEvent) {
  if (
    event.paths.some((eventPath) => eventPath.includes(WorkspacesConfigFile))
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
