import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';

export function useStreamClient({ apiKey, user, token }) {
  const [videoClient, setVideoClient] = useState(null);
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    if (!apiKey || !user || !token) return;

    let isMounted = true;
    const initializeClient = async () => {
      try {
        const tokenProvider = () => Promise.resolve(token);

        const myVideoClient = new StreamVideoClient({
          apiKey,
          user,
          tokenProvider,
        });

        const myChatClient = StreamChat.getInstance(apiKey);
        await myChatClient.connectUser(user, token);

        if (isMounted) {
          setVideoClient(myVideoClient);
          setChatClient(myChatClient);
        }
      } catch (error) {
        console.error('lient initialization error', error);
      }
    };

    initializeClient();

    return () => {
      isMounted = false;
      if (videoClient) videoClient?.disconnect().catch(console.error);
      if (chatClient) chatClient?.disconnect().catch(console.error);
    };
  }, [apiKey, user, token]);

  return { videoClient, chatClient };
}
