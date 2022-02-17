/* eslint-disable react/no-array-index-key */
import React, { FC, useState } from 'react';
import './TopicViewColumns.css';
import { App } from '@minddrop/app';
import { TopicViewInstance, useTopic } from '@minddrop/topics';
import { Drops, useDrops } from '@minddrop/drops';
import {
  createDataInsertFromDataTransfer,
  mapPropsToClasses,
} from '@minddrop/utils';
import { TopicView } from '@minddrop/app-ui';
import { Views } from '@minddrop/views';
import { useCore } from '@minddrop/core';
import {
  ColumnItem,
  ColumnsAddDropsMetadata,
  TopicViewColumnsInstance,
  UpdateTopicViewColumnsInstanceData,
} from '../types';
import { moveColumnItems } from '../moveColumnItems';

export interface TopicViewColumnsProps extends TopicViewInstance {
  /**
   * A `{ [columnIndex]: dropId[] }` map each one representing a column
   * containing the IDs of the drops in that column.
   */
  columns: Record<number, ColumnItem[]>;
}

export const TopicViewColumns: FC<TopicViewColumnsProps> = (props) => {
  const { topic: topicId, id: viewInstanceId, columns } = props;
  const core = useCore('@minddrop/topic-view-columns');
  const topic = useTopic(topicId);
  const drops = useDrops(topic.drops);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDragEnter = (
    event: React.DragEvent<HTMLDivElement>,
    column: number,
    index?: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(`${column}:${index}`);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    column: number,
    index: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(null);
    const dataInsert = createDataInsertFromDataTransfer(event.dataTransfer);

    if (dataInsert.action === 'sort') {
      const instance =
        Views.getInstance<TopicViewColumnsInstance>(viewInstanceId);

      Views.updateInstance<UpdateTopicViewColumnsInstanceData>(
        core,
        viewInstanceId,
        {
          columns: moveColumnItems(
            instance.columns,
            dataInsert.drops.map((dropId) => ({ type: 'drop', id: dropId })),
            column,
            index,
          ),
        },
      );
    } else {
      const metadata: ColumnsAddDropsMetadata = {
        viewInstance: viewInstanceId,
        column,
        index,
      };

      App.insertDataIntoTopic(core, topicId, dataInsert, metadata);
    }
  };

  return (
    <TopicView {...props}>
      <div className="topic-view-columns">
        {Object.values(columns).map((column, columnIndex) => (
          <div key={columnIndex} className="column">
            {column.map((item, dropIndex) => (
              <div key={`spacer-${item.id}`}>
                <div
                  data-testid={`spacer-${columnIndex}:${dropIndex}`}
                  className={mapPropsToClasses(
                    { active: dragOver === `${columnIndex}:${dropIndex}` },
                    'spacer-drop-zone',
                  )}
                  onDragEnter={(event) =>
                    handleDragEnter(event, columnIndex, dropIndex)
                  }
                  onDragLeave={(event) => handleDragLeave(event)}
                  onDragOver={(event) => handleDragOver(event)}
                  onDrop={(event) => handleDrop(event, columnIndex, dropIndex)}
                >
                  <div className="indicator" />
                </div>
                {Drops.render(drops[item.id])}
              </div>
            ))}
            <div
              className="column-end"
              data-testid={`column-end-${columnIndex}`}
              onDragEnter={(event) => handleDragEnter(event, columnIndex)}
              onDragLeave={(event) => handleDragLeave(event)}
              onDragOver={(event) => handleDragOver(event)}
              onDrop={(event) => handleDrop(event, columnIndex, column.length)}
            >
              <div
                className={mapPropsToClasses(
                  { active: dragOver === `${columnIndex}:undefined` },
                  'bottom-drop-zone',
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </TopicView>
  );
};
