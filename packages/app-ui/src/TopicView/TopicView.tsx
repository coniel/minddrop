import React, { FC, useEffect, useRef } from 'react';
import { Topics, useTopic } from '@minddrop/topics';
import {
  IconButton,
  Toolbar,
  DropdownMenu,
  DropdownMenuTrigger,
} from '@minddrop/ui';
import { App, useAppCore } from '@minddrop/app';
import { useTranslation } from '@minddrop/i18n';
import { useLocalPersistentStoreValue } from '@minddrop/persistent-store';
import { Drops } from '@minddrop/drops';
import { Selection } from '@minddrop/selection';
import { createDataInsertFromDataTransfer } from '@minddrop/utils';
import { TopicTitle } from '../TopicTitle';
import { TopicBreadcrumbs } from '../TopicBreadcrumbs';
import { TopicViewOptionsMenu } from '../TopicViewOptionsMenu';
import { AddDropMenu } from '../AddDropMenu';
import './TopicView.css';

export interface TopicViewProps {
  /**
   * The ID of the topic.
   */
  topicId: string;
}

/**
 * Returns `true` if the target of a clipboard event is an
 * input or rich text editor node.
 */
function isTextFieldEvent(event: ClipboardEvent) {
  const target = event.target as HTMLElement;

  return target.tagName === 'INPUT' || target.tagName === 'SPAN';
}

export const TopicView: FC<TopicViewProps> = ({ topicId, children }) => {
  const { t } = useTranslation();
  const titleInput = useRef<HTMLInputElement | null>(null);
  const core = useAppCore();
  const topic = useTopic(topicId);
  const trail = useLocalPersistentStoreValue(core, 'topicTrail', [topicId]);

  useEffect(() => {
    const keydownCallback = (event: KeyboardEvent) => {
      // Get selected drops
      const selectedDrops = Selection.get('drops:drop').map((item) => item.id);

      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (event.shiftKey) {
          // Archive selected drops is Shift key was pressed
          Topics.archiveDrops(core, topicId, selectedDrops);
        } else {
          // Delete selected drops
          selectedDrops.forEach((dropId) => {
            Drops.delete(core, dropId);
          });
        }

        // Clear selection
        Selection.clear(core);
      } else if (['D', 'd'].includes(event.key) && event.metaKey) {
        event.preventDefault();

        // Duplicate the drops
        const drops = Drops.duplicate(core, selectedDrops);

        // Add duplicate drops to the topic
        Topics.addDrops(core, topicId, Object.keys(drops));
      } else if (['A', 'a'].includes(event.key) && event.metaKey) {
        event.preventDefault();

        // Select all of the topic's drops
        Selection.select(
          core,
          Topics.get(topicId).drops.map((dropId) => ({
            id: dropId,
            resource: 'drops:drop',
            parent: { id: topicId, resource: 'topics:topic' },
          })),
        );
      }
    };

    const copyCallback = (event: ClipboardEvent) => {
      // Ignore copy events eminating from a text field
      if (isTextFieldEvent(event)) {
        return;
      }

      Selection.copy(core, event);
    };

    const cutCallback = (event: ClipboardEvent) => {
      // Ignore cut events eminating from a text field
      if (isTextFieldEvent(event)) {
        return;
      }

      // Cut the selection
      Selection.cut(core, event);

      // Get selected drops
      const selectedDrops = Selection.get('drops:drop');

      if (selectedDrops.length) {
        // Remove selected drops from the topic
        Topics.removeDrops(
          core,
          topicId,
          selectedDrops.map((item) => item.id),
        );
      }
    };

    const pasteCallback = (event: ClipboardEvent) => {
      // Ignore paste events eminating from a text field
      if (isTextFieldEvent(event)) {
        return;
      }

      // Create data insert
      const dataInsert = createDataInsertFromDataTransfer(event.clipboardData);

      // Insert data into the topic
      App.insertDataIntoTopic(core, topicId, dataInsert);
    };

    document.addEventListener('keydown', keydownCallback);
    document.addEventListener('copy', copyCallback);
    document.addEventListener('cut', cutCallback);
    document.addEventListener('paste', pasteCallback);

    return () => {
      document.removeEventListener('keydown', keydownCallback);
      document.removeEventListener('copy', copyCallback);
      document.removeEventListener('cut', cutCallback);
      document.removeEventListener('paste', pasteCallback);
    };
  }, [core, topicId]);

  return (
    <div className="topic-view">
      <Toolbar className="top-toolbar">
        <TopicBreadcrumbs trail={trail} />
      </Toolbar>
      <div className="main">
        <div className="header">
          <TopicTitle ref={titleInput} topic={topic} />
          <Toolbar className="actions">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <IconButton icon="add" label={t('addDrop')} />
              </DropdownMenuTrigger>
              <AddDropMenu menuType="dropdown" topicId={topicId} />
            </DropdownMenu>
            <TopicViewOptionsMenu trail={trail} />
          </Toolbar>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};
