/* eslint-disable no-underscore-dangle */
import { Core, ResourceChange, ResourceConnector } from '@minddrop/core';
import type PouchDB from 'pouchdb';
import { deserializeResourceDocument } from '../deserializeResourceDocument';
import { serializeResouceDocument } from '../serializeResouceDocument';
import { ResourceDocument, DBResourceDocument } from '../types';

function groupDocsByResourceType(
  allDocs: PouchDB.Core.AllDocsResponse<DBResourceDocument>,
): Record<string, DBResourceDocument[]> {
  return allDocs.rows.reduce((map, row) => {
    const nextMap = { ...map };
    const { doc } = row;

    // If this is the first doc of this type,
    // create an array for the type.
    if (!map[doc.resourceType]) {
      nextMap[doc.resourceType] = [];
    }

    // Clean and add the doc to the type array
    nextMap[doc.resourceType].push(deserializeResourceDocument(doc));

    return nextMap;
  }, {});
}

function initializeConnector(
  core: Core,
  db: PouchDB.Database,
  connector: ResourceConnector,
  resourceDocs: Record<string, DBResourceDocument[]>,
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

        db.put(serializeResouceDocument(data, connector.type));
      },
    );
  }

  if (connector.updateEvent) {
    core.addEventListener<string, ResourceChange<ResourceDocument, any>>(
      connector.updateEvent,
      async (payload) => {
        const { data } = payload;
        const resource = await db.get(data.after.id);

        db.put({
          _rev: resource._rev,
          ...serializeResouceDocument(data.after, connector.type),
        });
      },
    );
  }

  if (connector.deleteEvent) {
    core.addEventListener<string, ResourceDocument>(
      connector.deleteEvent,
      async (payload) => {
        const { data } = payload;

        const resource = await db.get(data.id);

        db.put({
          ...resource,
          _deleted: true,
        });
      },
    );
  }
}

export async function initializeResourceConnectors(
  core: Core,
  db: PouchDB.Database,
) {
  // Fetch all documents
  const allDocs = await db.allDocs<DBResourceDocument>({ include_docs: true });
  // Organise docs into a { [resourceType]: Resouce[] } map
  const resourceDocs = groupDocsByResourceType(allDocs);

  core.getResourceConnectors().forEach((connector) => {
    initializeConnector(core, db, connector, resourceDocs);
  });

  // Subscribe to changes
  db.changes<DBResourceDocument>({
    since: 'now',
    live: true,
    include_docs: true,
  }).on('change', (change) => {
    const { doc } = change;
    const cleanedDoc = deserializeResourceDocument(doc);
    const connector = core
      .getResourceConnectors()
      .find((connector) => doc.resourceType === connector.type);

    if (!connector || !connector.onChange) {
      return;
    }

    connector.onChange(cleanedDoc, !!change.deleted);
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
      core.removeEventListeners(data.createEvent);
      core.removeEventListeners(data.updateEvent);
      core.removeEventListeners(data.deleteEvent);
    },
  );
}
