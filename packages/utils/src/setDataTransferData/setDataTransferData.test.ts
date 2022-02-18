import React from 'react';
import { setDataTransferData } from './setDataTransferData';

const dragEvent = {
  data: {},
  dataTransfer: {
    setData: jest.fn(),
  },
} as unknown as React.DragEvent;

const clipboardEvent = {
  clipboardData: {
    setData: jest.fn(),
  },
} as unknown as React.ClipboardEvent;

describe('setDataTransferData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('drag event', () => {
    it('sets the action', () => {
      setDataTransferData(dragEvent, { action: 'move' });

      expect(dragEvent.dataTransfer.setData).toHaveBeenCalledWith(
        'minddrop/action',
        'move',
      );
    });

    it('sets drop IDs', () => {
      setDataTransferData(dragEvent, { drops: ['drop-1', 'drop-2'] });

      expect(dragEvent.dataTransfer.setData).toHaveBeenCalledWith(
        'minddrop/drops',
        JSON.stringify(['drop-1', 'drop-2']),
      );
    });

    it('converts DropMap into drop IDs and sets them', () => {
      setDataTransferData(dragEvent, { drops: { 'drop-1': {}, 'drop-2': {} } });

      expect(dragEvent.dataTransfer.setData).toHaveBeenCalledWith(
        'minddrop/drops',
        JSON.stringify(['drop-1', 'drop-2']),
      );
    });

    it('sets topic IDs', () => {
      setDataTransferData(dragEvent, { topics: ['topic-1', 'topic-2'] });

      expect(dragEvent.dataTransfer.setData).toHaveBeenCalledWith(
        'minddrop/topics',
        JSON.stringify(['topic-1', 'topic-2']),
      );
    });

    it('converts TopicMap into topic IDs and sets them', () => {
      setDataTransferData(dragEvent, {
        topics: { 'topic-1': {}, 'topic-2': {} },
      });

      expect(dragEvent.dataTransfer.setData).toHaveBeenCalledWith(
        'minddrop/topics',
        JSON.stringify(['topic-1', 'topic-2']),
      );
    });
  });

  describe('clipboard event', () => {
    it('sets the action', () => {
      setDataTransferData(clipboardEvent, { action: 'move' });

      expect(clipboardEvent.clipboardData.setData).toHaveBeenCalledWith(
        'minddrop/action',
        'move',
      );
    });

    it('sets drop IDs', () => {
      setDataTransferData(clipboardEvent, { drops: ['drop-1', 'drop-2'] });

      expect(clipboardEvent.clipboardData.setData).toHaveBeenCalledWith(
        'minddrop/drops',
        JSON.stringify(['drop-1', 'drop-2']),
      );
    });

    it('converts DropMap into drop IDs and sets them', () => {
      setDataTransferData(clipboardEvent, {
        drops: { 'drop-1': {}, 'drop-2': {} },
      });

      expect(clipboardEvent.clipboardData.setData).toHaveBeenCalledWith(
        'minddrop/drops',
        JSON.stringify(['drop-1', 'drop-2']),
      );
    });

    it('sets topic IDs', () => {
      setDataTransferData(clipboardEvent, { topics: ['topic-1', 'topic-2'] });

      expect(clipboardEvent.clipboardData.setData).toHaveBeenCalledWith(
        'minddrop/topics',
        JSON.stringify(['topic-1', 'topic-2']),
      );
    });

    it('converts TopicMap into topic IDs and sets them', () => {
      setDataTransferData(clipboardEvent, {
        topics: { 'topic-1': {}, 'topic-2': {} },
      });

      expect(clipboardEvent.clipboardData.setData).toHaveBeenCalledWith(
        'minddrop/topics',
        JSON.stringify(['topic-1', 'topic-2']),
      );
    });
  });
});
