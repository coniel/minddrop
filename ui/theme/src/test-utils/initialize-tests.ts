import { act } from '@testing-library/react';
import { Events } from '@minddrop/events';
import {
  FILE_SYSTEM_TEST_DATA,
  MockFileSystem,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import {
  StoreHydrateEvent,
  StoreHydrateEventData,
  StoreHydrateRequestEvent,
  StoreHydrateRequestEventData,
} from '@minddrop/stores';
import { ThemeStore } from '../ThemeStore';
import { VariantChangedEvent } from '../events';

initializeI18n();

const { configsFileDescriptor } = FILE_SYSTEM_TEST_DATA;

// Listeners registered per test, removed again on cleanup so that each
// test registers its own. Listener IDs are unique per event, so a stale
// listener would shadow the next test's registration.
const TEST_LISTENER_IDS = [
  'test',
  'test-os-change',
  'theme:initialize:manage-os-listener',
];

const HYDRATE_LISTENER_ID = 'test:hydrate';

let MockFsAdapter: MockFileSystem;

export function setup() {
  // Initialize mock file system
  MockFsAdapter = initializeMockFileSystem([configsFileDescriptor]);

  // Stand in for the platform layer, which answers a store's hydrate
  // request with its persisted data. Without a responder, hydrate()
  // never resolves and initializeTheme() never completes.
  Events.addListener<StoreHydrateRequestEventData>(
    StoreHydrateRequestEvent,
    HYDRATE_LISTENER_ID,
    ({ data }) => {
      Events.dispatch<StoreHydrateEventData>(StoreHydrateEvent, {
        namespace: data.namespace,
        data: {},
      });
    },
  );
}

export function cleanup() {
  // Remove the listeners registered during the test. Events._clearAll()
  // is deliberately not used: it would also remove the hydrate listener
  // the theme store registers when its module is first loaded, which
  // cannot be registered again, leaving hydrate() unable to resolve for
  // the rest of the run.
  TEST_LISTENER_IDS.forEach((id) => {
    Events.removeListener(VariantChangedEvent, id);
  });

  // Clear the mock file system
  MockFsAdapter.reset();

  act(() => {
    // Reset the config to default values
    ThemeStore.reset();
  });
}
