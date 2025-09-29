import { useEffect, useState } from 'react';
import {
  type User,
  type Channel as StreamChannel,
  StreamChat,
} from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
  LoadingIndicator,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import './App.css';

const API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const userId = 'delicate-sunset-1';
const userName = 'delicate';

const user: User = {
  id: userId,
  name: userName,
  image: `https://getstream.io/random_png/?name=${userName}`,
};

function App() {
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [client, setClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(API_KEY);
      await chatClient.connectUser(user, chatClient.devToken(user.id));

      if (!chatClient) return;

      const channel = chatClient.channel('messaging', 'custom_channel_id', {
        members: [userId],
      });

      await channel.watch();

      setChannel(channel);
      setClient(chatClient);
    }

    init();

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [client]);

  if (!client || !channel) return <LoadingIndicator />;

  return (
    <Chat client={client}>
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}

export default App;
