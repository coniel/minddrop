import { DatabaseFixtures } from '@minddrop/databases';
import { DatabaseDesignStudioProvider } from '../DatabaseDesignStudioProvider';

const { objectDatabase } = DatabaseFixtures;

export interface MockDatabaseDesignStudioProps {
  children: React.ReactNode;
  databaseId?: string;
  designId?: string;
}

export const MockDatabaseDesignStudioProvider: React.FC<
  MockDatabaseDesignStudioProps
> = ({
  children,
  databaseId = objectDatabase.id,
  designId = objectDatabase.designs[0].id,
}) => {
  return (
    <DatabaseDesignStudioProvider databaseId={databaseId} designId={designId}>
      {children}
    </DatabaseDesignStudioProvider>
  );
};
