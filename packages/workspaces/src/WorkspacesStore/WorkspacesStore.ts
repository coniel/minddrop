import { create } from 'zustand';
import { Workspace } from '../types';

export interface WorkspacesStore {
  /**
   * The user's workspaces.
   */
  workspaces: Workspace[];

  /**
   * Load workspaces into the store.
   */
  load(workspace: Workspace[]): void;

  /**
   * Add a workspace to the store at the specified index,
   * or to the end of the list if index is not specified.
   */
  add(workspace: Workspace, index?: number): void;

  /**
   * Remove a workspace from the store by path.
   */
  remove(path: string): void;

  /**
   * Clear workspaces.
   */
  clear(): void;
}

export const WorkspacesStore = create<WorkspacesStore>()((set) => ({
  workspaces: [],

  load: (workspaces) =>
    set((state) => ({ workspaces: [...state.workspaces, ...workspaces] })),

  add: (workspace, index) =>
    set((state) => {
      return {
        workspaces:
          typeof index === 'number'
            ? [
                ...state.workspaces.slice(0, index),
                workspace,
                ...state.workspaces.slice(index),
              ]
            : [...state.workspaces, workspace],
      };
    }),

  remove: (path) =>
    set((state) => {
      return {
        workspaces: state.workspaces.filter(
          (workspace) => path !== workspace.path,
        ),
      };
    }),

  clear: () => set({ workspaces: [] }),
}));
