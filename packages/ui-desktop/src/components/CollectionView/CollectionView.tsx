import { useCollection } from '@minddrop/collections';
import { Text } from '@minddrop/ui-elements';
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
      <CollectionProperties collection={collection} />
    </div>
  );
};
