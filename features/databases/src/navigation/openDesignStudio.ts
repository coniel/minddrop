import { Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import {
  OpenDesignStudioEvent,
  OpenDesignStudioEventData,
} from '@minddrop/feature-design-studio';
import { OpenDatabaseViewEvent } from '../events';

export function openDesignStudio(databaseId: string, designId: string) {
  const database = Databases.get(databaseId);
  const design = Databases.getDesign(databaseId, designId);

  if (!design) {
    return;
  }

  Events.dispatch<OpenDesignStudioEventData>(OpenDesignStudioEvent, {
    design: design,
    backEvent: OpenDatabaseViewEvent,
    backEventData: { databaseId, configurationPanelOpen: true },
    properties: database.properties,
    onSave: (design) => {
      // Update the design in the database
      Databases.updateDesign(databaseId, design);
    },
  });
}
