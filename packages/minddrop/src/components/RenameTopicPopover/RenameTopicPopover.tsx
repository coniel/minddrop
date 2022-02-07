import React, { FC, useCallback, useRef } from 'react';
import { InvisibleTextField, PopoverContent } from '@minddrop/ui';
import { Topic, Topics } from '@minddrop/topics';
import './RenameTopicPopover.css';
import { useAppCore } from '@minddrop/app';
import { useTranslation } from '@minddrop/i18n';

export interface RenameTopicPopoverProps {
  /**
   * The topic being renamed.
   */
  topic: Topic;

  /**
   * Callback fired when the popover closes.
   */
  onClose(): void;
}

export const RenameTopicPopover: FC<RenameTopicPopoverProps> = ({
  topic,
  onClose,
}) => {
  const form = useRef<HTMLFormElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();
  const core = useAppCore();

  const selectInput = useCallback(() => {
    setTimeout(() => {
      input.current.select();
    });
  }, [input]);

  const submitForm = useCallback(() => {
    form.current.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true }),
    );
  }, [form]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      const formElements = (event.target as HTMLFormElement).elements;
      const inputs = formElements as typeof formElements & {
        title: { value: string };
      };

      Topics.update(core, topic.id, { title: inputs.title.value });
      onClose();
    },
    [core, topic.id],
  );

  return (
    <PopoverContent
      align="center"
      side="top"
      sideOffset={-50}
      onOpenAutoFocus={selectInput}
      onPointerDownOutside={submitForm}
      onEscapeKeyDown={onClose}
    >
      <form data-testid="form" ref={form} onSubmit={handleSubmit}>
        <InvisibleTextField
          ref={input}
          className="rename-topic-popover-input"
          label={t('topicName')}
          name="title"
          placeholder={t('untitled')}
          defaultValue={topic.title}
          size="large"
        />
      </form>
    </PopoverContent>
  );
};
