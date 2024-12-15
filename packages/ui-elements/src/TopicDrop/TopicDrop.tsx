import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import { mapPropsToClasses } from '@minddrop/utils';
import './TopicDrop.css';

export interface TopicDropProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The topic name.
   */
  label?: string;
}

export const TopicDrop = React.forwardRef<HTMLDivElement, TopicDropProps>(
  ({ label, className, children, ...other }, ref) => {
    const { t } = useTranslation();

    return (
      <div
        role="button"
        ref={ref}
        className={mapPropsToClasses(
          { className, untitled: !label },
          'topic-drop',
        )}
        {...other}
      >
        {label || t('untitled')}
        {children}
      </div>
    );
  },
);

TopicDrop.displayName = 'TopicDrop';
