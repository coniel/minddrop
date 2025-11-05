import { useState } from 'react';
import { Events } from '@minddrop/events';
import { ItemTypes } from '@minddrop/item-types';
import {
  Button,
  ContentIcon,
  Panel,
  Text,
  Toolbar,
} from '@minddrop/ui-primitives';
import { ItemTypePropertiesEditor } from '../ItemTypePropertiesEditor';
import './ItemTypeView.css';

export interface ItemTypeViewProps {
  type: string;
}

export const ItemTypeView: React.FC<ItemTypeViewProps> = ({ type }) => {
  const itemType = ItemTypes.use(type);
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(false);

  function togglePropertiesPanel() {
    if (!propertiesPanelOpen) {
      Events.dispatch('app:right-panel:open', {
        component: ItemTypePropertiesEditor,
        props: { itemType: type },
      });
    } else {
      Events.dispatch('app:right-panel:close');
    }

    setPropertiesPanelOpen((open) => !open);
  }

  if (!itemType) {
    return <div className="item-type-view">Item type not found.</div>;
  }

  return (
    <Panel className="item-type-view">
      <div className="header">
        <div className="title">
          <ContentIcon icon={itemType.icon} />
          <Text>{itemType.namePlural}</Text>
        </div>
        <Toolbar>
          <Button
            variant="outlined"
            label="Configure"
            onClick={togglePropertiesPanel}
          />
        </Toolbar>
      </div>
    </Panel>
  );
};
