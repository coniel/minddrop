import React, { useEffect, useState } from 'react';
import { Events } from '@minddrop/events';
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

  useEffect(() => {
    // Listen for browse designs events and show the design browser overlay
    Events.addListener<BrowseDesignsEventData>(
      BrowseDesignsEvent,
      `${EventListenerId}:browse`,
      () => {
        setView('browse-designs');
      },
    );

    // Listen for mapper open events and show the property mapper overlay
    Events.addListener<OpenPropertyMapperEventData>(
      OpenPropertyMapperEvent,
      `${EventListenerId}:mapper`,
      () => {
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

  if (!view) {
    return null;
  }

  return <div className="design-property-mapping-backdrop" />;
};
