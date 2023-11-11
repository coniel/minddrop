import React, { useState } from 'react';
import { EmojiPicker } from './EmojiPicker';

export default {
  title: 'ui/EmojiPicker',
  component: EmojiPicker,
};

export const Default: React.FC = () => {
  const [selected, setSelected] = useState('');

  return (
    <div>
      <div style={{ height: 20 }}>{selected}</div>
      <EmojiPicker onSelect={setSelected} />
    </div>
  );
};
