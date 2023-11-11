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
   * Updates a workspace in the store by path.
   */
  update(path: string, data: Partial<Workspace>): void;

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

  update: (path, data) =>
    set((state) => {
      const index = state.workspaces.findIndex(
        (workspace) => workspace.path === path,
      );
      const workspaces = [...state.workspaces];

      if (index === -1) {
        return {};
      }

      workspaces[index] = { ...workspaces[index], ...data };

      return { workspaces };
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
