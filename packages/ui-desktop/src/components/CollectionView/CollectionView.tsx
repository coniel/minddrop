import { useCollection } from '@minddrop/collections';
import {
  Box,
  Button,
  Dialog,
  Inset,
  ScrollArea,
  Tabs,
  Text,
} from '@minddrop/ui-elements';
import { CollectionProperties } from '../CollectionProperties';
import './CollectionView.css';

export interface CollectionViewProps {
  /**
   * The content of the CollectionView.
   */
  path: string;
}

export const CollectionView: React.FC<CollectionViewProps> = ({ path }) => {
  const collection = useCollection(path);

  if (!collection) {
    return <Text>Collection not found</Text>;
  }

  return (
    <div className="collection-view">
      <div className="collection-view-header">
        <h1>{collection.name}</h1>
      </div>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button>Collection settings</Button>
        </Dialog.Trigger>
        <Dialog.Content height="80vh" maxWidth="1000px">
          <Dialog.Title>{collection.name}</Dialog.Title>
          <Tabs.Root>
            <Inset side="x" my="5">
              <Tabs.List style={{ paddingLeft: 8 }}>
                <Tabs.Trigger value="account">General</Tabs.Trigger>
                <Tabs.Trigger value="documents">Properties</Tabs.Trigger>
                <Tabs.Trigger value="settings">Cards</Tabs.Trigger>
                <Tabs.Trigger value="templates">Templates</Tabs.Trigger>
              </Tabs.List>
            </Inset>
            <Tabs.Content value="account">
              <Text>Make changes to your account.</Text>
            </Tabs.Content>

            <Tabs.Content value="documents">
              <CollectionProperties collection={collection} />
            </Tabs.Content>

            <Tabs.Content value="settings">
              <Text>Edit your profile or update contact information.</Text>
            </Tabs.Content>

            <Tabs.Content value="templates">
              <Text>Edit your profile or update contact information.</Text>
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};
