import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { Events } from '@minddrop/events';
import {
  CloseViewEvent,
  OpenViewEvent,
  UpdateViewEvent,
} from '@minddrop/views';
import {
  DataViewViewName,
  NewDataViewViewId,
  NewDataViewViewName,
  OpenDataViewViewEvent,
  OpenNewDataViewViewEvent,
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
      Events.addListener(OpenViewEvent, 'test-open-data-view', ({ data }) => {
        // The data view view opens with the data view's details
        expect(data.view).toBe(DataViewViewName);
        expect(data.id).toBe(`data-views:data-view:${dataView_gallery_1.id}`);
        expect(data.props!.dataViewId).toBe(dataView_gallery_1.id);
        expect(data.title).toBe(dataView_gallery_1.name);
        expect(data.icon).toBe(dataView_gallery_1.icon);
        resolve();
      });

      Events.dispatch(OpenDataViewViewEvent, {
        dataViewId: dataView_gallery_1.id,
      });
    }));

  it('opens the new data view view on open new data view view event', () =>
    new Promise<void>((resolve) => {
      Events.addListener(
        OpenViewEvent,
        'test-open-new-data-view',
        ({ data }) => {
          // The new data view view opens with the selected view type
          expect(data.view).toBe(NewDataViewViewName);
          expect(data.id).toBe(NewDataViewViewId);
          expect(data.props!.viewType).toBe(dataView_gallery_1.type);
          resolve();
        },
      );

      Events.dispatch(OpenNewDataViewViewEvent, {
        viewType: dataView_gallery_1.type,
      });
    }));

  it('updates the data view view when the data view is updated', () =>
    new Promise<void>((resolve) => {
      Events.addListener(
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
      Events.addListener(CloseViewEvent, 'test-close-data-view', ({ data }) => {
        expect(data.id).toBe(`data-views:data-view:${dataView_gallery_1.id}`);
        resolve();
      });

      DataViews.delete(dataView_gallery_1.id);
    }));
});
