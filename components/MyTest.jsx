import { AblyProvider, useChannel } from 'ably/react';
import { useEffect, useState } from 'react';

const MyTest = () => {
  const client = {
    key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
    clientId: 'test-user-id',
  };

  const [messages, updateMessages] = useState([]);
  const { channel } = useChannel('chat-1234', (message) => {
    updateMessages((prev) => [...prev, message]);
  });

  useEffect(() => {
    // Ensure that the channel is available before using it
    if (channel) {
      console.log({ channel });
    }
  }, [channel]);

  return (
    <AblyProvider client={client}>
      <div>Test</div>
    </AblyProvider>
  );
};

export default MyTest;
