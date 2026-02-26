import React, { useEffect, useRef, useState } from 'react';
import { MarkdownEditor } from '@minddrop/feature-markdown-editor';
import { ScrollArea, Select } from '@minddrop/ui-primitives';
import { IssueFeature, IssueStatus, IssueType } from '../types';
import {
  ISSUE_FEATURES,
  ISSUE_STATUSES,
  ISSUE_TYPES,
} from '../IssuesPanel/constants';
import './NewIssueDialog.css';

export interface NewIssueData {
  title: string;
  status: IssueStatus;
  type: IssueType;
  feature: IssueFeature;
  content: string;
}

interface NewIssueDialogProps {
  onSubmit: (data: NewIssueData) => void;
  onClose: () => void;
}

const STATUS_OPTIONS = ISSUE_STATUSES.map((status) => ({
  value: status.value,
  label: status.label,
}));

const TYPE_OPTIONS = ISSUE_TYPES.map((type) => ({
  value: type.value,
  label: type.label,
}));

const FEATURE_OPTIONS = ISSUE_FEATURES.map((feature) => ({
  value: feature.value,
  label: feature.label,
}));

export const NewIssueDialog: React.FC<NewIssueDialogProps> = ({
  onSubmit,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<IssueStatus>('open');
  const [type, setType] = useState<IssueType>('task');
  const [feature, setFeature] = useState<IssueFeature>('other');
  const contentRef = useRef('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }

      if (event.key === 'Enter' && event.metaKey) {
        event.preventDefault();
        event.stopPropagation();
        onSubmit({
          title: title.trim() || 'New Issue',
          status,
          type,
          feature,
          content: contentRef.current,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () =>
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [title, status, type, feature, onSubmit, onClose]);

  return (
    <div className="new-issue-dialog-overlay" onMouseDown={onClose}>
      <div
        className="new-issue-dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <input
          ref={titleRef}
          className="new-issue-dialog-title"
          placeholder="Issue title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <div className="new-issue-dialog-fields">
          <Select
            size="sm"
            variant="subtle"
            value={status}
            onValueChange={(value: IssueStatus) => setStatus(value)}
            options={STATUS_OPTIONS}
          />
          <Select
            size="sm"
            variant="subtle"
            value={type}
            onValueChange={(value: IssueType) => setType(value)}
            options={TYPE_OPTIONS}
          />
          <Select
            size="sm"
            variant="subtle"
            value={feature}
            onValueChange={(value: IssueFeature) => setFeature(value)}
            options={FEATURE_OPTIONS}
          />
          <div className="new-issue-dialog-fields-spacer" />
          <span className="new-issue-dialog-hint">⌘↵ submit</span>
        </div>

        <ScrollArea className="new-issue-dialog-editor">
          <MarkdownEditor
            initialValue=""
            onDebouncedChange={(value) => {
              contentRef.current = value;
            }}
          />
        </ScrollArea>
      </div>
    </div>
  );
};
