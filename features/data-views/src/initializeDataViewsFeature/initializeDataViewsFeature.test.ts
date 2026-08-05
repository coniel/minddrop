import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViewFixtures, DataViews } from '@minddrop/data-views';
import {
  CloseViewEvent,
  CloseViewEventData,
  Events,
  OpenViewEvent,
  OpenViewEventData,
  UpdateViewEvent,
  UpdateViewEventData,
} from '@minddrop/events';
import { DataViewViewProps } from '../DataViewView';
import {
  DataViewViewName,
  OpenDataViewViewEvent,
  OpenDataViewViewEventData,
} from '../events';
import { cleanup, setup } from '../test-utils';
import { initializeDataViewsFeature } from './initializeDataViewsFeature';

const { dataView_gallery_1 } = DataViewFixtures;

describe('initializeDataViewsFeature', () => {
  let removeEventListeners: VoidFunction;

  beforeEach(() => {
    setup();

    // Register the feature's event listeners
    removeEventListeners = initializeDataViewsFeature();
  });

  afterEach(() => {
    removeEventListeners();
    cleanup();
  });

  it('opens the data view view on open data view view event', () =>
    new Promise<void>((resolve) => {
      Events.addListener<OpenViewEventData<DataViewViewProps>>(
        OpenViewEvent,
        'test-open-data-view',
        ({ data }) => {
          // The data view view opens with the data view's details
          expect(data.view).toBe(DataViewViewName);
          expect(data.id).toBe(`data-views:data-view:${dataView_gallery_1.id}`);
          expect(data.props!.dataViewId).toBe(dataView_gallery_1.id);
          expect(data.title).toBe(dataView_gallery_1.name);
          expect(data.icon).toBe(dataView_gallery_1.icon);
          resolve();
        },
      );

      Events.dispatch<OpenDataViewViewEventData>(OpenDataViewViewEvent, {
        dataViewId: dataView_gallery_1.id,
      });
    }));

  it('updates the data view view when the data view is updated', () =>
    new Promise<void>((resolve) => {
      Events.addListener<UpdateViewEventData>(
        UpdateViewEvent,
        'test-update-data-view',
        ({ data }) => {
          // The view title follows the data view
          expect(data.id).toBe(`data-views:data-view:${dataView_gallery_1.id}`);
          expect(data.title).toBe('Renamed view');
          resolve();
        },
      );

      DataViews.update(dataView_gallery_1.id, { name: 'Renamed view' });
    }));

  it('closes the data view view when the data view is deleted', () =>
    new Promise<void>((resolve) => {
      Events.addListener<CloseViewEventData>(
        CloseViewEvent,
        'test-close-data-view',
        ({ data }) => {
          expect(data.id).toBe(`data-views:data-view:${dataView_gallery_1.id}`);
          resolve();
        },
      );

      DataViews.delete(dataView_gallery_1.id);
    }));
});
