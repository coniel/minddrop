import { useEffect } from 'react';
import { Events } from '@minddrop/events';
import { DocumentView as DocumentRenderer } from '@minddrop/documents';
import { setActiveDocument } from '../api';
import { ParentDirProvider } from '@minddrop/utils';
import { Fs } from '@minddrop/file-system';

export const DocumentView: React.FC<{ path: string }> = ({ path }) => {
  useEffect(() => {
    Events.addListener(
      'documents:document:wrap',
      'reopen-document-view-on-wrapped',
      ({ data }) => {
        if (path === data.oldPath) {
          setActiveDocument(data.newPath);
        }
      },
    );

    return () => {
      Events.removeListener(
        'documents:document:wrap',
        'reopen-document-view-on-wrapped',
      );
    };
  }, [path]);

  return (
    <ParentDirProvider value={Fs.parentDirPath(path)}>
      <DocumentRenderer path={path} />
    </ParentDirProvider>
  );
};
