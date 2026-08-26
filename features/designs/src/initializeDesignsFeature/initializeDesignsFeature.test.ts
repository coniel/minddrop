import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { Events } from '@minddrop/events';
import { OpenViewEvent } from '@minddrop/views';
import { DesignStudioViewId, DesignStudioViewName } from '../constants';
import { OpenDesignStudioEvent } from '../events';
import { cleanup, setup } from '../test-utils';
import { initializeDesignsFeature } from './initializeDesignsFeature';

const { design_books } = DesignFixtures;

describe('initializeDesignsFeature', () => {
  let removeEventListeners: VoidFunction;

  beforeEach(() => {
    setup();

    // Register the feature's event listeners
    removeEventListeners = initializeDesignsFeature();
  });

  afterEach(() => {
    removeEventListeners();
    cleanup();
  });

  it('opens the design studio view on open design studio events', () =>
    new Promise<void>((resolve) => {
      Events.addListener(
        OpenViewEvent,
        'test-open-design-studio',
        ({ data }) => {
          // The design studio view opens with the requested design
          expect(data.view).toBe(DesignStudioViewName);
          expect(data.id).toBe(DesignStudioViewId);
          expect(data.props!.designId).toBe(design_books.id);
          resolve();
        },
      );

      Events.dispatch(OpenDesignStudioEvent, {
        designId: design_books.id,
      });
    }));
});
