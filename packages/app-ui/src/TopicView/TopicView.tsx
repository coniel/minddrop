import React, { FC, useEffect, useRef } from 'react';
import { Topics, useTopic } from '@minddrop/topics';
import { InstanceViewProps } from '@minddrop/views';
import { IconButton, Toolbar } from '@minddrop/ui';
import { App, useAppCore } from '@minddrop/app';
import { TopicTitle } from '../TopicTitle';
import { useLocalPersistentStoreValue } from '@minddrop/persistent-store';
import { TopicBreadcrumbs } from '../TopicBreadcrumbs';
import './TopicView.css';
import { TopicViewOptionsMenu } from '../TopicViewOptionsMenu';
import { Drops } from '@minddrop/drops';
import {
  createDataInsertFromDataTransfer,
  setDataTransferData,
} from '@minddrop/utils';

export interface TopicViewBaseProps {
  topic: string;
}

export type TopicViewProps = InstanceViewProps<TopicViewBaseProps>;

export const TopicView: FC<TopicViewProps> = ({ topic: topicId, children }) => {
  const titleInput = useRef<HTMLInputElement | null>(null);
  const core = useAppCore();
  const topic = useTopic(topicId);
  const trail = useLocalPersistentStoreValue(core, 'topicTrail', [topicId]);

  useEffect(() => {
    const keydownCallback = (event: KeyboardEvent) => {
      // Get selected drops
      const selectedDrops = App.getSelectedDrops();

      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (event.shiftKey) {
          // Archive selected drops is Shift key was pressed
          Object.keys(selectedDrops).forEach((dropId) => {
            Drops.archive(core, dropId);
          });
        } else {
          // Delete selected drops
          Object.keys(selectedDrops).forEach((dropId) => {
            Drops.delete(core, dropId);
          });
        }
      } else if (['D', 'd'].includes(event.key) && event.metaKey) {
        event.preventDefault();

        // Duplicate the drops
        const drops = Drops.duplicate(core, Object.keys(selectedDrops));

        // Add duplicate drops to the topic
        Topics.addDrops(core, topicId, Object.keys(drops));
      }
    };

    const copyCallback = (event: ClipboardEvent) => {
      // Get selected drops
      const selectedDrops = App.getSelectedDrops();

      if (Object.keys(selectedDrops).length) {
        // Clear default clipboard data
        event.clipboardData.clearData();

        // Set custom data
        setDataTransferData(event, {
          drops: selectedDrops,
          action: 'copy',
        });

        // Needed when setting custom data
        event.preventDefault();
      }
    };

    const cutCallback = (event: ClipboardEvent) => {
      // Get selected drops
      const selectedDrops = App.getSelectedDrops();

      if (Object.keys(selectedDrops).length) {
        // Clear default clipboard data
        event.clipboardData.clearData();

        // Set custom data
        setDataTransferData(event, {
          drops: selectedDrops,
          action: 'cut',
        });

        // Needed when setting custom data
        event.preventDefault();

        // Remove selected drops from the topic
        Topics.removeDrops(core, topicId, Object.keys(selectedDrops));
      }
    };

    const pasteCallback = (event: ClipboardEvent) => {
      const target = event.target as HTMLElement;
      // Ignore paste event on inputs and spans (spans used as inputs in rich text editor)
      if (target.tagName === 'INPUT' || target.tagName === 'SPAN') {
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
      <div className="header">
        <TopicTitle ref={titleInput} topic={topic} />
        <Toolbar className="actions">
          <IconButton icon="add" label="Add content" />
          <TopicViewOptionsMenu topic={topic} trail={trail} />
        </Toolbar>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};
