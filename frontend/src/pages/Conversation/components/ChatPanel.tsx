import { useEffect, useState } from 'react';
import { socket } from '../../../socket/socket';
import { API_URL } from '../../../config/api';

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

export default function ChatPanel({
  partnerId,
  conversationId,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [partnerName, setPartnerName] = useState('Partner');

  const partnerFirstName = partnerName.split(' ')[0];

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || !conversationId) return;

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
    if (!partnerId) {
      setPartnerName('Partner');
      return;
    }

    async function fetchPartner() {
      try {
        const response = await fetch(`${API_URL}/api/users/${partnerId}`, {
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          setPartnerName(data.data.name);
        }
      } catch (error) {
        console.error('Failed to fetch partner:', error);
      }
    }

    fetchPartner();
  }, [partnerId]);

  useEffect(() => {
    const handleMessageReceive = (data: { text: string; senderId: string }) => {
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
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-blue-500/20 bg-[#0b142b]">
      {/* Chat header — no Participants tab */}
      <div className="flex shrink-0 items-center border-b border-blue-400/15 bg-[#0d1730] px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Chat</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Message your conversation partner
          </p>
        </div>
      </div>

      {/* Only this area scrolls */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-contain p-3 sm:p-4">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 text-xl">
              💬
            </div>

            <p className="text-sm font-medium text-slate-200">
              Your conversation starts here
            </p>

            <p className="mt-1 max-w-[240px] text-xs leading-5 text-slate-500">
              {partnerId
                ? 'Send a message to get the conversation going.'
                : 'Find a speaking partner to start chatting.'}
            </p>
          </div>
        ) : (
          messages.map((item) => (
            <div
              key={item.id}
              className={`flex min-w-0 flex-col ${
                item.sender === 'you' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="mb-1 flex max-w-full items-center gap-2 px-1">
                <span className="truncate text-xs font-semibold text-slate-300">
                  {item.sender === 'you' ? 'You' : partnerFirstName}
                </span>

                <span className="shrink-0 text-[10px] text-slate-500">
                  {item.time}
                </span>
              </div>

              <div
                className={`max-w-[88%] break-words [overflow-wrap:anywhere] rounded-2xl px-3.5 py-2.5 text-sm leading-5 sm:max-w-[85%] sm:px-4 sm:py-3 ${
                  item.sender === 'you'
                    ? 'rounded-br-md bg-indigo-600 text-white'
                    : 'rounded-bl-md border border-blue-400/10 bg-[#152342] text-slate-200'
                }`}
              >
                {item.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input stays at the bottom */}
      <div className="shrink-0 border-t border-blue-400/15 bg-[#0d1730] p-3">
        <form
          className="flex min-w-0 items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Message your partner..."
            autoComplete="off"
            className="h-11 min-w-0 flex-1 rounded-xl border border-blue-400/15 bg-[#101b36] px-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 sm:px-4"
          />

          <button
            type="submit"
            disabled={!message.trim() || !conversationId}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ➤
          </button>
        </form>
      </div>
    </section>
  );
}
