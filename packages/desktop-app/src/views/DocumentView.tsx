import { useMemo } from 'react';
import { Documents } from '@minddrop/documents';
import { DocumentRenderer } from '@minddrop/ui-desktop';
import { DocumentBreadcrumb } from '@minddrop/ui-desktop';
import { Breadcrumbs, Toolbar } from '@minddrop/ui-elements';
import { setActiveDocument } from '../api';
import './DocumentView.css';

export const DocumentView: React.FC<{ id: string }> = ({ id }) => {
  const trail = useMemo(() => getDocumentTrail(id), [id]);

  return (
    <div className="document-view">
      <Toolbar data-tauri-drag-region className="top-toolbar">
        <Breadcrumbs className="document-breadcrumbs">
          {trail.map((id, index) => (
            <DocumentBreadcrumb
              key={id}
              documentId={id}
              onClick={index === trail.length - 1 ? 'rename' : 'open'}
              onOpen={setActiveDocument}
            />
          ))}
        </Breadcrumbs>
      </Toolbar>
      <DocumentRenderer id={id} />
    </div>
  );
};

function getDocumentTrail(id: string): string[] {
  const parents = [];
  let current: string | undefined = id;

  while (current) {
    parents.unshift(current);

    current = Documents.getParent(current)?.id;
  }

  return parents;
}
