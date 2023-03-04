import React from 'react';
import { DataInsert } from '@minddrop/core';

type Map = Record<string, unknown>;

export interface DataTransferData {
  /**
   * The action.
   */
  action?: DataInsert['action'];

  /**
   * The IDs of the drops or a DropMap.
   */
  drops?: string[] | Map;

  /**
   * The IDs of the topics or a TopicMap.
   */
  topics?: string[] | Map;
}

/**
 * Sets MindDrop data such as action, drops, and topics
 * on a data transfer event.
 *
 * @param event The event whichi is the source of the data transfer.
 * @param data The data to set.
 */
export function setDataTransferData(
  event: DragEvent | ClipboardEvent | React.DragEvent | React.ClipboardEvent,
  data: DataTransferData,
): void {
  const actionKey = 'minddrop/action';
  const dropsKey = 'minddrop/drops';
  const topicsKey = 'minddrop/topics';
  const dropIds =
    data.drops && !Array.isArray(data.drops)
      ? Object.keys(data.drops)
      : data.drops;
  const topicIds =
    data.topics && !Array.isArray(data.topics)
      ? Object.keys(data.topics)
      : data.topics;

  if ('dataTransfer' in event && event.dataTransfer) {
    if (data.action) {
      // Set the action
      event.dataTransfer.setData(actionKey, data.action);
    }

    if (data.drops) {
      // Set drops
      event.dataTransfer.setData(dropsKey, JSON.stringify(dropIds));
    }

    if (data.topics) {
      // Set topics
      event.dataTransfer.setData(topicsKey, JSON.stringify(topicIds));
    }
  }

  if ('clipboardData' in event && event.clipboardData) {
    if (data.action) {
      // Set the action
      event.clipboardData.setData(actionKey, data.action);
    }

    if (data.drops) {
      // Set drops
      event.clipboardData.setData(dropsKey, JSON.stringify(dropIds));
    }

    if (data.topics) {
      // Set topics
      event.clipboardData.setData(topicsKey, JSON.stringify(topicIds));
    }
  }
}
