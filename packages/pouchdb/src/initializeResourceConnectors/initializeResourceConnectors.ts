/* eslint-disable no-underscore-dangle */
import { Core, ResourceChange, ResourceConnector } from '@minddrop/core';
import { ResourceDocument, DBApi, GroupedResources } from '../types';

function initializeConnector(
  core: Core,
  db: DBApi,
  connector: ResourceConnector,
  resourceDocs: GroupedResources,
) {
  // Load existing docs
  if (connector.onLoad && resourceDocs[connector.type]) {
    connector.onLoad(resourceDocs[connector.type]);
  }

  if (connector.createEvent) {
    core.addEventListener<string, ResourceDocument>(
      connector.createEvent,
      async (payload) => {
        const { data } = payload;

        db.add(connector.type, data);
      },
    );
  }

  if (connector.updateEvent) {
    core.addEventListener<string, ResourceChange<ResourceDocument, any>>(
      connector.updateEvent,
      async (payload) => {
        const { data } = payload;

        db.update(data.after.id, data.after);
      },
    );
  }

  if (connector.deleteEvent) {
    core.addEventListener<string, ResourceDocument>(
      connector.deleteEvent,
      async (payload) => {
        const { data } = payload;

        db.delete(data.id);
      },
    );
  }
}

export async function initializeResourceConnectors(core: Core, db: DBApi) {
  // Fetch all documents
  const resourceDocs = await db.getAllDocs();

  core.getResourceConnectors().forEach((connector) => {
    initializeConnector(core, db, connector, resourceDocs);
  });

  // Listen to 'core:register-resource' and initialize
  // new resources.
  core.addEventListener<string, ResourceConnector>(
    'core:register-resource',
    (payload) => {
      initializeConnector(core, db, payload.data, resourceDocs);
    },
  );

  // Listen to 'core:unregister-resource' and remove
  // the resource.
  core.addEventListener<string, ResourceConnector>(
    'core:unregister-resource',
    (payload) => {
      const { data } = payload;
      core.removeAllEventListeners(data.createEvent);
      core.removeAllEventListeners(data.updateEvent);
      core.removeAllEventListeners(data.deleteEvent);
    },
  );
}
