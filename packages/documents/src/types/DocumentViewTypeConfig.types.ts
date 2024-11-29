import { Block } from '@minddrop/blocks';
import { ContentIconName } from '@minddrop/icons';
import { Document } from './Document.types';
import { DocumentView } from './DocumentView.types';
import { DocumentViewProps } from './DocumentViewProps.types';

export interface DocumentViewTypeConfig<
  TView extends DocumentView = DocumentView,
> {
  /**
   * The view type identifier.
   */
  id: string;

  /**
   * User friendly description of the view type arranged as a
   * [language code]: { name: string, details: string } map.
   */
  description: Record<string, ViewDescription>;

  /**
   * Icon representing this view type.
   *
   * Used as the default document icon when creating a new document
   * with this view type.
   */
  icon: ContentIconName;

  /**
   * The React component that renders the view.
   */
  component: React.ComponentType<DocumentViewProps<TView>>;

  /**
   * Callback fired when blocks are removed from the document.
   *
   * Must remove the blocks from the view.
   *
   * @param view - The view from which the blocks are being removed.
   * @param blocks - The blocks that were removed from the document.
   * @param updateView - Callback to update the view.
   */
  onRemoveBlocks: (
    view: TView,
    blocks: Block[],
    updateView: (data: Partial<TView>) => Promise<void>,
  ) => void;

  /**
   * Callback fired when blocks are added to the document
   * within another view.
   *
   * @param view - The view into which the blocks are being added.
   * @param blocks - The blocks that were added to the document.
   * @param updateView - Callback to update the view.
   */
  onAddBlocks?: (blocks: Block[]) => void;

  /**
   * Callback fired when creating a new instance of the view.
   *
   * Can be used to generate the initial content of the view.
   *
   * @param document - The document the view is being created for.
   */
  initialize?: (document: Document) => Partial<Omit<TView, 'id' | 'type'>>;
}

interface ViewDescription {
  /**
   * Name displayed in the UI.
   */
  name: string;

  /**
   * Short description displayed in the UI.
   */
  details: string;
}
