import React, { useCallback, useEffect, useState } from 'react';
import { Events } from '@minddrop/events';
import { DesignBrowser } from './DesignBrowser';
import {
  BrowseDesignsEvent,
  BrowseDesignsEventData,
  EventListenerId,
  OpenPropertyMapperEvent,
  OpenPropertyMapperEventData,
} from './events';
import './DesignPropertyMappingFeature.css';

type OverlayView = 'browse-designs' | 'property-mapper' | null;

export const DesignPropertyMappingFeature: React.FC = () => {
  const [view, setView] = useState<OverlayView>(null);
  const [databaseId, setDatabaseId] = useState<string | null>(null);

  useEffect(() => {
    // Listen for browse designs events and show the design browser overlay
    Events.addListener<BrowseDesignsEventData>(
      BrowseDesignsEvent,
      `${EventListenerId}:browse`,
      (event) => {
        setDatabaseId(event.data.databaseId);
        setView('browse-designs');
      },
    );

    // Listen for mapper open events and show the property mapper overlay
    Events.addListener<OpenPropertyMapperEventData>(
      OpenPropertyMapperEvent,
      `${EventListenerId}:mapper`,
      (event) => {
        setDatabaseId(event.data.databaseId);
        setView('property-mapper');
      },
    );

    return () => {
      Events.removeListener(BrowseDesignsEvent, `${EventListenerId}:browse`);
      Events.removeListener(
        OpenPropertyMapperEvent,
        `${EventListenerId}:mapper`,
      );
    };
  }, []);

  // Close the overlay and reset state
  const handleClose = useCallback(() => {
    setView(null);
    setDatabaseId(null);
  }, []);

  // Handle design selection — switch to mapper view
  const handleSelectDesign = useCallback((designId: string) => {
    setView('property-mapper');
  }, []);

  if (!view || !databaseId) {
    return null;
  }

  return (
    <>
      <div className="design-property-mapping-backdrop" onClick={handleClose} />

      {/* Render the design browser overlay */}
      {view === 'browse-designs' && (
        <DesignBrowser
          databaseId={databaseId}
          onSelectDesign={handleSelectDesign}
          onClose={handleClose}
        />
      )}
    </>
  );
};
