'use client';

import { useState, useEffect, useRef } from 'react';

export function useBroadcastMessage() {
  const [message, setMessage] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const lastMessageRef = useRef('');

  function fetchMessage() {
    fetch('/api/system-message')
      .then(r => r.json())
      .then((data: { message?: string }) => {
        const msg = data.message ?? '';
        if (msg !== lastMessageRef.current) {
          lastMessageRef.current = msg;
          setDismissed(false);
        }
        setMessage(msg);
      })
      .catch(() => {});
  }

  useEffect(() => {
    fetchMessage();
    const id = setInterval(fetchMessage, 30_000);
    return () => clearInterval(id);
  }, []);

  return {
    message: dismissed ? '' : message,
    dismiss: () => setDismissed(true),
  };
}
