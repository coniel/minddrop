import * as ExtensionsExtension from '@minddrop/extensions';
import * as PersistentStoreExtension from '@minddrop/persistent-store';
import * as ViewsExtension from '@minddrop/views';
import * as FilesExtension from '@minddrop/files';
import * as TagsExtension from '@minddrop/tags';
import * as DropsExtension from '@minddrop/drops';
import * as TopicsExtension from '@minddrop/topics';
import * as AppExtension from '@minddrop/app';
import * as RichTextExtension from '@minddrop/rich-text';
import TopicViewColumnsExtension from '@minddrop/topic-view-columns';
import TextDropExtension from '@minddrop/text-drop';
import { ExtensionConfig, Extensions } from '@minddrop/extensions';
import { initializeCore } from '@minddrop/core';
import { DBApi, initializeResourceConfigs } from '@minddrop/pouchdb';
import { PersistentStore } from '@minddrop/persistent-store';
import { registerDefaultRichTextElementTypes } from '@minddrop/rich-text-editor';
import { Topics } from '@minddrop/topics';
import { Views } from '@minddrop/views';
import { HomeView } from '../HomeView';

// Default extensions
const defaultExtensions = [TopicViewColumnsExtension, TextDropExtension];

// Create the 'app' MindDrop core instance
const core = initializeCore({ appId: 'app', extensionId: 'app' });

/**
 * Initializes the app by running all core extensions,
 * initializing all non-core extensions, initializing
 * registered resource connectors, initializing the
 * persistent stores, and registering the app:home view.
 *
 * Adds a event listener for topic creations which enables
 * all non-core extensions on newly created topics.
 */
export async function initializeApp(
  database: DBApi,
  installedExtensions: ExtensionConfig[],
) {
  // Combine default and installed extensions
  const extensions = [...defaultExtensions, ...installedExtensions];

  // Run core extensions
  ExtensionsExtension.onRun(core);
  PersistentStoreExtension.onRun(core);
  ViewsExtension.onRun(core);
  FilesExtension.onRun(core);
  TagsExtension.onRun(core);
  RichTextExtension.onRun(core);
  DropsExtension.onRun(core);
  TopicsExtension.onRun(core);

  // Inistialize registered resource connectors
  await initializeResourceConfigs(core, database);

  // Register default rich text element types
  registerDefaultRichTextElementTypes(core);

  // Initialize non-core extensions
  Extensions.initialize(core, extensions);

  // Initialize persistent stores
  PersistentStore.initialize(core);

  // Run the app extensions
  AppExtension.onRun(core);

  // Enable all non-core extensions on a topic when it is created
  Topics.addEventListener(core, 'topics:create', ({ data }) => {
    extensions.forEach((extension) => {
      Extensions.enableOnTopics(core, extension.id, [data.id]);
    });
  });
}

export function registerViews() {
  // Register the 'app:home' view
  Views.register(core, {
    id: 'app:home',
    type: 'static',
    component: HomeView,
  });
}
