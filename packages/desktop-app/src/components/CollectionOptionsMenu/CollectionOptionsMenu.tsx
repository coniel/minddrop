import { useTranslation } from '@minddrop/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuProps,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@minddrop/ui-elements';
import './CollectionOptionsMenu.css';

export interface CollectionOptionsMenuProps extends DropdownMenuProps {
  /**
   * The collection path.
   */
  path: string;

  /**
   * The menu trigger button.
   */
  children: React.ReactNode;

  /**
   * Callback fired when the rename option is selected.
   */
  onSelectRename?(event: Event): void;

  /**
   * Callback fired when the change icon option is selected.
   */
  onSelectChangeIcon?(event: Event): void;

  /**
   * Callback fired when the move option is selected.
   */
  onSelectMove?(event: Event): void;

  /**
   * Callback fired when the remove option is selected.
   */
  onSelectRemove?(event: Event): void;

  /**
   * Callback fired when the delete option is selected.
   */
  onSelectDelete?(event: Event): void;

  /**
   * Callback fired when the reveal in file explorer
   * option is selected.
   */
  onSelectRevealInFileExplorer?(event: Event): void;
}

export const CollectionOptionsMenu: React.FC<CollectionOptionsMenuProps> = ({
  path,
  children,
  onSelectRename,
  onSelectChangeIcon,
  onSelectMove,
  onSelectRemove,
  onSelectDelete,
  onSelectRevealInFileExplorer,
  ...other
}) => {
  const { t } = useTranslation({ keyPrefix: 'collections.actions' });

  return (
    <DropdownMenu {...other}>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent align="start" className="collection-options-menu">
          <DropdownMenuItem
            icon="edit"
            label={t('rename.action')}
            onSelect={onSelectRename}
          />
          <DropdownMenuItem
            icon="star"
            label={t('changeIcon')}
            onSelect={onSelectChangeIcon}
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            icon="corner-up-right"
            label={t('move.action')}
            tooltipTitle={t('move.tooltip.title')}
            tooltipDescription={t('move.tooltip.description')}
            onSelect={onSelectMove}
          />
          <DropdownMenuItem
            icon="circle-x"
            label={t('remove.action')}
            tooltipTitle={t('remove.tooltip.title')}
            tooltipDescription={t('remove.tooltip.description')}
            onSelect={onSelectRemove}
          />
          <DropdownMenuItem
            icon="trash"
            label={t('delete.action')}
            tooltipTitle={t('delete.tooltip.title')}
            tooltipDescription={t('delete.tooltip.description')}
            onSelect={onSelectDelete}
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            icon="folder"
            label={t('revealInFileExplorer.macos')}
            onSelect={onSelectRevealInFileExplorer}
          />
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
