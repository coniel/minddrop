import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignRolesStore } from '../DesignRolesStore';
import { DesignRoleNotRegisteredError } from '../errors';
import { DesignRoleUnregisteredEvent } from '../events';
import { CardTitleRole } from '../roles';
import { cleanup, setup } from '../test-utils';
import { unregisterDesignRole } from './unregisterDesignRole';

describe('unregisterDesignRole', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('removes the role from the registry', () => {
    unregisterDesignRole(CardTitleRole.id);

    expect(DesignRolesStore.get(CardTitleRole.id)).toBeNull();
  });

  it('dispatches a role unregistered event', async () =>
    new Promise<void>((done) => {
      // Listen for the role unregistered event
      Events.addListener(DesignRoleUnregisteredEvent, 'test', (payload) => {
        expect(payload.data).toEqual(CardTitleRole);
        done();
      });

      unregisterDesignRole(CardTitleRole.id);
    }));

  it('throws when the role is not registered', () => {
    expect(() => unregisterDesignRole('unknown')).toThrow(
      DesignRoleNotRegisteredError,
    );
  });
});
