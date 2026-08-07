import React, { useSyncExternalStore } from 'react';
import { groupStories } from '../utils';

export interface Story {
  /**
   * Name of the group the story is listed under.
   */
  group: string;

  /**
   * Name the story is listed under within its group.
   */
  label: string;

  /**
   * The component rendering the story.
   */
  component: React.FC;
}

export interface StoryItem {
  /**
   * Name the story is listed under within its group.
   */
  label: string;

  /**
   * The component rendering the story.
   */
  component: React.FC;
}

export interface StoryGroup {
  /**
   * Name the group is listed under.
   */
  group: string;

  /**
   * The stories in the group.
   */
  items: StoryItem[];
}

const registry: Story[] = [];
const registryListeners = new Set<VoidFunction>();

// Stories are handed out grouped, which is recomputed only when
// a story is registered
let snapshot: StoryGroup[] = [];

/**
 * Registers a component story, listing it in the dev tools stories
 * panel under its group.
 *
 * Stories register themselves, so a story is listed as soon as its
 * file is loaded.
 *
 * @param story - The story to register.
 */
export function registerStory(story: Story): void {
  const index = registry.findIndex(
    (item) => item.group === story.group && item.label === story.label,
  );

  if (index === -1) {
    registry.push(story);
  } else {
    registry[index] = story;
  }

  notifyListeners();
}

/**
 * Unregisters a component story.
 *
 * @param group - Name of the group the story is listed under.
 * @param label - Name of the story within its group.
 */
export function unregisterStory(group: string, label: string): void {
  const index = registry.findIndex(
    (item) => item.group === group && item.label === label,
  );

  // Nothing to remove for an unregistered story
  if (index === -1) {
    return;
  }

  registry.splice(index, 1);
  notifyListeners();
}

/**
 * Returns the registered stories, grouped and sorted by name.
 */
export function getRegisteredStories(): StoryGroup[] {
  return snapshot;
}

/**
 * Calls the callback whenever a story is registered.
 *
 * @param callback - Called after the registry changes.
 * @returns A callback which stops listening.
 */
export function subscribeToStories(callback: VoidFunction): VoidFunction {
  registryListeners.add(callback);

  return () => {
    registryListeners.delete(callback);
  };
}

/**
 * Retrieves the registered stories, including those registered
 * after the first render.
 *
 * @returns The registered stories, grouped and sorted by name.
 */
export function useStories(): StoryGroup[] {
  return useSyncExternalStore(subscribeToStories, getRegisteredStories);
}

/**
 * Regroups the registered stories and notifies the registry's
 * listeners of the change.
 */
function notifyListeners(): void {
  snapshot = groupStories(registry);

  registryListeners.forEach((listener) => listener());
}
