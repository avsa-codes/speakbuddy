import { useEffect, useState } from 'react';
import { socket } from '../../../socket/socket';

type Message = {
  id: string;
  sender: 'partner' | 'you';
  text: string;
  time: string;
};

interface ChatPanelProps {
  partnerId: string | null;
  conversationId: string | null;
}

export default function ChatPanel({ partnerId, conversationId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [partnerName, setPartnerName] = useState('Partner');
  const partnerFirstName = partnerName.split(' ');


  const handleSendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    socket.emit('message:send', {
      conversationId,
      text: trimmedMessage,
    });

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: crypto.randomUUID(),
        sender: 'you',
        text: trimmedMessage,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);

    setMessage('');
  };

  useEffect(() => {
    if (!partnerId) return;

    async function fetchPartner() {
      const response = await fetch(
        `http://localhost:5000/api/users/${partnerId}`,
        {
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPartnerName(data.data.name);
      }
    }

    fetchPartner();
  }, [partnerId]);

  useEffect(() => {
    const handleMessageReceive = (data: { text: string; senderId: string }) => {
      console.log('Message received:', data);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: crypto.randomUUID(),
          sender: 'partner',
          text: data.text,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    };

    socket.on('message:receive', handleMessageReceive);

    return () => {
      socket.off('message:receive', handleMessageReceive);
    };
  }, []);

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-blue-500/40 bg-[#0b142b]">
      {/* Tabs */}
      <div className="flex border-b border-blue-400/20">
        <button
          type="button"
          className="flex-1 border-b-2 border-indigo-500 px-4 py-4 text-sm font-semibold text-indigo-300"
        >
          Chat
        </button>

        <button
          type="button"
          className="flex-1 px-4 py-4 text-sm text-slate-400 transition hover:text-white"
        >
          Participants
        </button>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        {' '}
        {/* Conversation suggestions */}
        <div className="flex flex-wrap gap-2 pb-1"></div>
        {messages.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col ${
              item.sender === 'you' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs font-semibold text-white">
                {item.sender === 'you' ? 'You' : partnerFirstName[0]}
              </span>

              <span className="text-xs text-slate-500">{item.time}</span>
            </div>

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-5 ${
                item.sender === 'you'
                  ? 'rounded-br-md bg-indigo-600 text-white'
                  : 'rounded-bl-md bg-blue-500/15 text-slate-200'
              }`}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="border-t border-blue-400/20 p-3">
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Type a message or use voice command..."
            className="min-w-0 flex-1 rounded-xl border border-blue-400/30 bg-[#101b36] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
          />

          <button
            type="submit"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg transition hover:bg-indigo-500"
            aria-label="Send message"
          >
            ➤
          </button>
        </form>
      </div>
    </section>
  );
}
