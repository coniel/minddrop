import { FC, useCallback, useState } from 'react';
import { useDocument } from '@minddrop/documents';
import { useTranslation } from '@minddrop/i18n';
import { UserIconType, useIcon } from '@minddrop/icons';
import {
  Breadcrumb,
  ContentIcon,
  Popover,
  PopoverAnchor,
} from '@minddrop/ui-elements';
import { RenameDocumentPopover } from '../RenameDocumentPopover';
import './DocumentBreadcrumb.css';

export interface TopicBreadcrumbProps {
  /**
   * The ID of the document to display.
   */
  documentId: string;

  /**
   * Action fired when the breadcrumb is clicked. Either a callback
   * or 'rename' to open a rename popover.
   */
  onClick?: 'open' | 'rename';

  /**
   * Callback fired when the breadcrumb is clicked and the `onClick`
   * prop is set to 'open'.
   */
  onOpen?: (id: string) => void;
}

export const DocumentBreadcrumb: FC<TopicBreadcrumbProps> = ({
  documentId,
  onClick,
  onOpen,
}) => {
  const document = useDocument(documentId);
  const { t } = useTranslation();
  const [renamePopoverOpen, setRenamePopoverOpen] = useState(false);
  const label = document?.title || t('untitled');
  const { icon } = useIcon(document?.icon || '');

  function openRenamePopover() {
    setRenamePopoverOpen(true);
  }

  function closeRenamePopover() {
    setRenamePopoverOpen(false);
  }

  const handleClick = useCallback(() => {
    if (onClick === 'open' && document) {
      if (onOpen) {
        onOpen(document.id);
      }
    }
  }, [onClick, onOpen, document]);

  const iconComponent = document?.icon ? (
    <>
      {icon.type === UserIconType.Emoji && (
        <span className="emoji-icon">{icon.icon}</span>
      )}
      {icon.type === UserIconType.ContentIcon && (
        <ContentIcon name={icon.icon} color={icon.color} />
      )}
    </>
  ) : undefined;

  if (document && typeof onClick === 'string' && onClick === 'rename') {
    return (
      <Popover open={renamePopoverOpen}>
        <PopoverAnchor asChild>
          <Breadcrumb
            className="document-breadcrumb"
            label={label}
            onClick={openRenamePopover}
            icon={iconComponent}
          />
        </PopoverAnchor>
        <RenameDocumentPopover
          document={document}
          onClose={closeRenamePopover}
        />
      </Popover>
    );
  }

  return (
    <Breadcrumb
      className="document-breadcrumb"
      label={label}
      onClick={handleClick}
      icon={iconComponent}
    />
  );
};
