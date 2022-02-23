/* eslint-disable react/no-array-index-key */
import React, { FC, useCallback, useState } from 'react';
import './TopicViewColumns.css';
import { App } from '@minddrop/app';
import { TopicViewInstance, useTopic } from '@minddrop/topics';
import { Drops, useDrops } from '@minddrop/drops';
import {
  createDataInsertFromDataTransfer,
  mapPropsToClasses,
} from '@minddrop/utils';
import { DropContextMenu, TopicView } from '@minddrop/app-ui';
import { Views } from '@minddrop/views';
import { useCore } from '@minddrop/core';
import {
  Columns,
  ColumnsAddDropsMetadata,
  CreateColumnMetadata,
  TopicViewColumnsInstance,
  UpdateTopicViewColumnsInstanceData,
} from '../types';
import { moveColumnItems } from '../moveColumnItems';
import { moveItemsToNewColumn } from '../moveItemsToNewColumn';

export interface TopicViewColumnsProps extends TopicViewInstance {
  /**
   * The column contents.
   */
  columns: Columns;
}

export const TopicViewColumns: FC<TopicViewColumnsProps> = (props) => {
  const { topic: topicId, id: viewInstanceId, columns } = props;
  const core = useCore('@minddrop/topic-view-columns');
  const topic = useTopic(topicId);
  const drops = useDrops(topic.drops);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const clearSelectedDrops = useCallback(
    () => App.clearSelectedDrops(core),
    [core],
  );

  const handleDragEnter = (
    event: React.DragEvent<HTMLDivElement>,
    column: number,
    index?: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (dragOver !== `${column}:${index}`) {
      setDragOver(`${column}:${index}`);
    }
  };

  const handleDragEnterVerticalZone = (
    event: React.DragEvent<HTMLDivElement>,
    location: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (dragOver !== location) {
      setDragOver(location);
    }
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

  const handleDropVerticalZone = async (
    event: React.DragEvent<HTMLDivElement>,
    column,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(null);
    App.clearSelectedDrops(core);
    const dataInsert = createDataInsertFromDataTransfer(event.dataTransfer);

    if (dataInsert.action === 'sort') {
      if (!dataInsert.drops) {
        return;
      }
      const instance =
        Views.getInstance<TopicViewColumnsInstance>(viewInstanceId);

      // Move the dropped items into a new column
      const updatedColumns = moveItemsToNewColumn(
        instance.columns,
        dataInsert.drops,
        column,
      );

      Views.updateInstance<UpdateTopicViewColumnsInstanceData>(
        core,
        viewInstanceId,
        {
          columns: updatedColumns,
        },
      );
    } else {
      const metadata: CreateColumnMetadata = {
        action: 'create-column',
        viewInstance: viewInstanceId,
        column,
      };

      App.insertDataIntoTopic(core, topicId, dataInsert, metadata);
    }
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    column: number,
    index: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(null);
    App.clearSelectedDrops(core);
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
        action: 'insert-into-column',
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
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="column">
            <div
              data-testid={`vertical-drop-zone-${columnIndex}`}
              className={mapPropsToClasses(
                { active: dragOver === `vertical-drop-zone-${columnIndex}` },
                'vertical-drop-zone',
              )}
              onClick={clearSelectedDrops}
              onDragEnter={(event) =>
                handleDragEnterVerticalZone(
                  event,
                  `vertical-drop-zone-${columnIndex}`,
                )
              }
              onDragLeave={(event) => handleDragLeave(event)}
              onDragOver={(event) =>
                handleDragEnterVerticalZone(
                  event,
                  `vertical-drop-zone-${columnIndex}`,
                )
              }
              onDrop={(event) => handleDropVerticalZone(event, columnIndex)}
            >
              <div className="indicator" />
            </div>
            <div className="column-content">
              {column.map((item, dropIndex) =>
                drops[item.id] ? (
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
                      onDragOver={(event) =>
                        handleDragEnter(event, columnIndex, dropIndex)
                      }
                      onDragLeave={(event) => handleDragLeave(event)}
                      onDrop={(event) =>
                        handleDrop(event, columnIndex, dropIndex)
                      }
                      onClick={clearSelectedDrops}
                    >
                      <div className="indicator" />
                    </div>
                    {Drops.render(drops[item.id])}
                  </div>
                ) : (
                  ''
                ),
              )}
              <div
                className="column-end"
                data-testid={`column-end-${columnIndex}`}
                onDragEnter={(event) => handleDragEnter(event, columnIndex)}
                onDragOver={(event) => handleDragEnter(event, columnIndex)}
                onDragLeave={(event) => handleDragLeave(event)}
                onDrop={(event) =>
                  handleDrop(event, columnIndex, column.length)
                }
                onClick={clearSelectedDrops}
              >
                <div
                  className={mapPropsToClasses(
                    { active: dragOver === `${columnIndex}:undefined` },
                    'bottom-drop-zone',
                  )}
                />
              </div>
            </div>
          </div>
        ))}
        <div
          data-testid="vertical-drop-zone-view-end"
          onClick={clearSelectedDrops}
          className={mapPropsToClasses(
            { active: dragOver === 'vertical-drop-zone-view-end' },
            'vertical-drop-zone',
          )}
          onDragEnter={(event) =>
            handleDragEnterVerticalZone(event, 'vertical-drop-zone-view-end')
          }
          onDragLeave={(event) => handleDragLeave(event)}
          onDragOver={(event) => handleDragOver(event)}
          onDrop={(event) => handleDropVerticalZone(event, columns.length)}
        >
          <div className="indicator" />
        </div>
      </div>
    </TopicView>
  );
};
