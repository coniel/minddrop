import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Spaces } from '@minddrop/spaces';
import { SpaceFixtures } from '@minddrop/spaces/test-utils';
import { render } from '@minddrop/test-utils';
import {
  CloseViewEvent,
  OpenViewEvent,
  UpdateViewEvent,
} from '@minddrop/views';
import { OpenSpaceViewEvent, SpaceViewName } from '../events';
import { MockFs, cleanup, setup } from '../test-utils';
import { SpacesFeature } from './SpacesFeature';

const { space_1 } = SpaceFixtures;

describe('<SpacesFeature />', () => {
  beforeEach(() => {
    setup();

    // Load a space into the store and its file into the mock
    // file system so it can be deleted
    Spaces.Store.load([space_1]);
    MockFs.addFiles(SpaceFixtures.getSpaceFiles());
  });

  afterEach(cleanup);

  it('opens the space view on open space view event', () =>
    new Promise<void>((resolve) => {
      render(<SpacesFeature />);

      Events.addListener(OpenViewEvent, 'test-open-space', (data) => {
        // The space view opens with the space's details
        expect(data.view).toBe(SpaceViewName);
        expect(data.id).toBe(`spaces:space:${space_1.id}`);
        expect(data.props!.spaceId).toBe(space_1.id);
        expect(data.title).toBe(space_1.name);
        expect(data.icon).toBe(space_1.icon);
        resolve();
      });

      Events.dispatch(OpenSpaceViewEvent, {
        spaceId: space_1.id,
      });
    }));

  it('updates the space view when the space is updated', () =>
    new Promise<void>((resolve) => {
      render(<SpacesFeature />);

      Events.addListener(UpdateViewEvent, 'test-update-space', (data) => {
        // The view title and icon follow the space
        expect(data.id).toBe(`spaces:space:${space_1.id}`);
        expect(data.title).toBe('Renamed space');
        resolve();
      });

      Spaces.update(space_1.id, { name: 'Renamed space' });
    }));

  it('closes the space view when the space is deleted', () =>
    new Promise<void>((resolve) => {
      render(<SpacesFeature />);

      Events.addListener(CloseViewEvent, 'test-close-space', (data) => {
        expect(data.id).toBe(`spaces:space:${space_1.id}`);
        resolve();
      });

      Spaces.delete(space_1.id);
    }));
});
