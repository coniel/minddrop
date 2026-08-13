import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignRolesStore } from '../DesignRolesStore';
import { DesignRoleRegisteredEvent } from '../events';
import { CardTitleRole } from '../roles';
import { cleanup, setup } from '../test-utils';
import { registerDesignRole } from './registerDesignRole';

describe('registerDesignRole', () => {
  beforeEach(() => setup({ loadRoles: false }));
  afterEach(cleanup);

  it('adds the role to the registry', () => {
    registerDesignRole(CardTitleRole);

    expect(DesignRolesStore.get(CardTitleRole.id)).toEqual(CardTitleRole);
  });

  it('dispatches a role registered event', async () =>
    new Promise<void>((done) => {
      // Listen for the role registered event
      Events.addListener(DesignRoleRegisteredEvent, 'test', (payload) => {
        expect(payload.data).toEqual(CardTitleRole);
        done();
      });

      registerDesignRole(CardTitleRole);
    }));
});
