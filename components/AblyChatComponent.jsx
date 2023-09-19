import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './AblyChatComponent.module.css';
import { getChannelHistory, useChannel } from './AblyReactEffect';

const AblyChatComponent = () => {
  const router = useRouter();
  const userId = router?.query?.userId || '';
  let inputBox = null;
  let messageEnd = null;

  const [messageText, setMessageText] = useState('');
  const [receivedMessages, setMessages] = useState([]);
  const messageTextIsEmpty = messageText.trim().length === 0;

  const [channel, ably] = useChannel('chat-1234', (message) => {
    const history = receivedMessages.slice(-199);
    console.log(history);
    setMessages([...history, message]);
  });

  const sendChatMessage = (messageText) => {
    channel.publish({ name: 'chat-message', data: messageText, userId });
    setMessageText('');
    inputBox.focus();
  };

  const handleFormSubmission = (event) => {
    event.preventDefault();
    sendChatMessage(messageText);
  };

  const handleKeyPress = (event) => {
    if (event.charCode !== 13 || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText);
    event.preventDefault();
  };

  const messages = receivedMessages.map((message, index) => {
    const author =
      message?.clientId == userId
        ? 'me'
        : message.connectionId === ably.connection.id
        ? 'me'
        : 'other';
    return (
      <span key={index} className={styles.message} data-author={author}>
        {message.data}
      </span>
    );
  });

  useEffect(() => {
    // Fetch and display previous messages
    getChannelHistory('chat-1234', (messages) => {
      console.log({ messages });
      setMessages(messages);
    });

    messageEnd.scrollIntoView({ behaviour: 'smooth' });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      ably.connection.close();
    };
    // Add the 'beforeunload' event listener when the component mounts
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Remove the event listener when the component unmounts (cleanup)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className={styles.chatHolder}>
      <div className={styles.chatText}>
        {messages}
        <div
          ref={(element) => {
            messageEnd = element;
          }}
        ></div>
      </div>
      <form onSubmit={handleFormSubmission} className={styles.form}>
        <textarea
          ref={(element) => {
            inputBox = element;
          }}
          value={messageText}
          placeholder="Type a message..."
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.textarea}
        ></textarea>
        <button
          type="submit"
          className={styles.button}
          disabled={messageTextIsEmpty}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AblyChatComponent;
