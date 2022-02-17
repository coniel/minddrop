import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Topic, Topics } from '@minddrop/topics';
import { useTranslation } from '@minddrop/i18n';
import { InvisibleTextField, InvisibleTextFieldProps } from '@minddrop/ui';
import { useAppCore } from '@minddrop/app';

export interface TopicTitleProps extends Partial<InvisibleTextFieldProps> {
  /**
   * The topic.
   */
  topic: Topic;
}

export const TopicTitle = React.forwardRef<HTMLInputElement, TopicTitleProps>(
  ({ topic, ...other }, ref) => {
    const inputRef = useRef<HTMLInputElement>();
    const input = ref || inputRef;
    const { t } = useTranslation();
    const core = useAppCore();
    const [title, setTitle] = useState(topic.title);
    const [focused, setFocused] = useState(false);
    const debouncedTitleUpdate = useDebouncedCallback(
      (value: string) => Topics.update(core, topic.id, { title: value }),
      500,
      { maxWait: 500 },
    );

    useEffect(() => {
      debouncedTitleUpdate.cancel();
    }, [topic.id]);

    useEffect(() => {
      if (!focused) {
        setTitle(topic.title);
      }

      if (!topic.title) {
        setTimeout(() => {
          if (typeof input !== 'function' && input.current) {
            input.current.focus();
          }
        }, 50);
      }
    }, [topic.title]);

    const handleTitleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        debouncedTitleUpdate(event.target.value);
      },
      [],
    );

    return (
      <InvisibleTextField
        ref={input}
        className="topic-title"
        label={t('topicName')}
        placeholder={t('untitled')}
        size="title"
        value={title}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleTitleChange}
        {...other}
      />
    );
  },
);
