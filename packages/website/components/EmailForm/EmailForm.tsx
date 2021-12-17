import React, { FormEvent, useRef, useState } from 'react';
import { Button } from '@minddrop/ui';
import styles from './EmailForm.module.css';

export const EmailForm: React.FC = () => {
  const inputEl = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const subscribe = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!inputEl.current) {
      return;
    }

    const res = await fetch('/api/subscribe', {
      body: JSON.stringify({
        email: inputEl.current.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const { error } = await res.json();

    if (error) {
      setMessage(error);
      setLoading(false);

      return;
    }

    setLoading(false);

    inputEl.current.value = '';
    setMessage(
      "Success! We'll send you an email as soon as MindDrop is available.",
    );
  };

  return (
    <div className={styles.root}>
      <form
        aria-label="Subscribe to newsletter"
        className={styles.form}
        onSubmit={subscribe}
      >
        <input
          required
          ref={inputEl}
          type="email"
          name="email"
          placeholder="you@example.com"
          aria-label="Email address"
          className={styles.input}
        />
        <Button type="submit" size="large" variant="primary" disabled={loading}>
          Notify me
        </Button>
      </form>
      <div className={styles.message}>{message}</div>
    </div>
  );
};
