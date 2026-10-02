import {
  MessageCircle,
  Users,
  Mic,
  Video,
  MonitorUp,
  Hand,
  Activity,
  Grid2X2,
  Send,
  X,
  Maximize2,
} from 'lucide-react';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../../socket/socket';
import { useNavigate } from 'react-router-dom';

type GroupDiscussion = {
  id: string;
  status: 'WAITING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  scheduledStartAt: string | null;
  maxParticipants: number;
  topic: {
    id: string;
    title: string;
    description: string;
  };
};

type GroupMessage = {
  text: string;
  senderId: string;
  senderName: string;
  sentAt: string;
};

const participants = [
  { name: 'You', initials: 'Y', color: 'from-indigo-500 to-blue-500' },
  {
    name: 'Participant 2',
    initials: 'P2',
    color: 'from-purple-500 to-pink-500',
  },
  { name: 'Participant 3', initials: 'P3', color: 'from-cyan-500 to-blue-500' },
  {
    name: 'Participant 4',
    initials: 'P4',
    color: 'from-rose-500 to-orange-500',
  },
  {
    name: 'Participant 5',
    initials: 'P5',
    color: 'from-emerald-500 to-teal-500',
  },
  { name: 'Participant 6', initials: 'P6', color: 'from-amber-500 to-red-500' },
];

function GroupDiscussionPage() {

  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(true);

  const { groupDiscussionId } = useParams();

  const [discussion, setDiscussion] = useState<GroupDiscussion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [chatError, setChatError] = useState('');

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/group-discussions/${groupDiscussionId}`,
          { credentials: 'include' }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load discussion.');
        }

        setDiscussion(data.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Something went wrong.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (groupDiscussionId) {
      fetchDiscussion();
    }
  }, [groupDiscussionId]);

  useEffect(() => {
    const handleGroupMessage = (message: GroupMessage) => {
      setMessages((previousMessages) => [...previousMessages, message]);
    };

    const handleGroupError = (data: { message: string }) => {
      setChatError(data.message);
    };

    socket.on('group:message', handleGroupMessage);
    socket.on('group:error', handleGroupError);

    return () => {
      socket.off('group:message', handleGroupMessage);
      socket.off('group:error', handleGroupError);
    };
  }, []);

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = messageInput.trim();

    if (!trimmedMessage) return;

    socket.emit('group:message', {
      groupDiscussionId,
      text: trimmedMessage,
    });

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        text: trimmedMessage,
        senderId: 'me',
        senderName: 'You',
        sentAt: new Date().toISOString(),
      },
    ]);

    setMessageInput('');
    setChatError('');
  };

  const handleLeaveGroup = () => {
    if (!groupDiscussionId) return;

    socket.emit('group:leave', { groupDiscussionId });

    navigate('/groups');
  };

  return (
    <div className="min-h-screen bg-[#080c19] p-4 text-white sm:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1600px] flex-col gap-5">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
              <MessageCircle size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold sm:text-2xl">
                Group Discussion
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Practice together, grow together
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Session in progress
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 flex-col gap-5 lg:flex-row">
          <main className="flex min-w-0 flex-1 flex-col gap-5">
            {/* Topic */}
            {isLoading ? (
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
                Loading discussion...
              </section>
            ) : error ? (
              <section className="rounded-2xl border border-red-500/20 bg-slate-900 p-6 text-red-300">
                {error}
              </section>
            ) : discussion ? (
              <section className="rounded-2xl border border-indigo-400/20 bg-gradient-to-r from-indigo-500/10 to-blue-500/5 p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Today&apos;s topic
                </p>

                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  {discussion.topic.title}
                </h2>

                <p className="mt-2 text-sm text-slate-300">
                  {discussion.topic.description}
                </p>
              </section>
            ) : null}

            {/* Participants */}
            <section className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white">Participants</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    People in this discussion
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300">
                  <Users size={16} />
                  <span>{participants.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {participants.map((participant, index) => (
                  <div
                    key={participant.name}
                    className="relative flex min-h-40 flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-700/80 bg-gradient-to-br from-slate-800 to-slate-950 p-5"
                  >
                    <div
                      className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${participant.color} text-lg font-bold text-white shadow-lg`}
                    >
                      {participant.initials}
                    </div>

                    <p className="font-medium text-white">{participant.name}</p>

                    <span className="absolute right-3 top-3 rounded-full bg-slate-950/70 p-2 text-slate-300">
                      <Mic size={15} />
                    </span>

                    {index === 0 && (
                      <span className="mt-1 text-xs text-indigo-300">
                        This is you
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Controls */}
            <section className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <button
                type="button"
                title="Camera (coming later)"
                disabled
                className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-400 opacity-60"
              >
                <Video size={21} />
              </button>

              <button
                type="button"
                title="Microphone (coming later)"
                disabled
                className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-400 opacity-60"
              >
                <Mic size={21} />
              </button>

              <button
                type="button"
                title="Share screen (coming later)"
                disabled
                className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-400 opacity-60"
              >
                <MonitorUp size={21} />
              </button>

              <button
                type="button"
                title="Raise hand (coming later)"
                disabled
                className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-400 opacity-60"
              >
                <Hand size={21} />
              </button>

              <button
                type="button"
                title="Activity (coming later)"
                disabled
                className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-400 opacity-60"
              >
                <Activity size={21} />
              </button>

              <button
                type="button"
                onClick={() => setIsChatOpen((open) => !open)}
                title="Toggle group chat"
                className={`rounded-xl border p-3 transition ${
                  isChatOpen
                    ? 'border-indigo-400/40 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Grid2X2 size={21} />
              </button>

              <button
                type="button"
                onClick={handleLeaveGroup}
                className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400"
              >
                Leave Group
              </button>
            </section>
          </main>

          {/* Chat panel */}
          {isChatOpen && (
            <aside className="flex min-h-[420px] w-full flex-col overflow-hidden rounded-2xl border border-indigo-400/30 bg-slate-900/90 shadow-[0_0_30px_rgba(79,70,229,0.10)] lg:w-[360px] lg:shrink-0 xl:w-[400px]">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-500/15 p-2 text-indigo-300">
                    <MessageCircle size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-white">Group Chat</h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Session conversation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Expand chat (coming later)"
                    disabled
                    className="rounded-lg p-2 text-slate-400 opacity-60"
                  >
                    <Maximize2 size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsChatOpen(false)}
                    title="Close chat"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  >
                    <X size={19} />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5">
                {messages.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-2xl bg-slate-800 p-4 text-indigo-300">
                      <MessageCircle size={30} />
                    </div>
                    <h3 className="font-medium text-white">
                      Start a conversation
                    </h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
                      Send a message to begin chatting with other participants.
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isOwnMessage = message.senderId === 'me';

                    return (
                      <div
                        key={`${message.sentAt}-${index}`}
                        className={`flex flex-col ${
                          isOwnMessage ? 'items-end' : 'items-start'
                        }`}
                      >
                        <p className="mb-1 px-1 text-xs font-medium text-slate-400">
                          {isOwnMessage
                            ? 'You'
                            : message.senderName.split(' ')[0]}
                        </p>

                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            isOwnMessage
                              ? 'bg-indigo-500 text-white'
                              : 'border border-slate-700 bg-slate-800 text-white'
                          }`}
                        >
                          <p className="break-words text-sm">{message.text}</p>
                        </div>

                        <span className="mt-1 text-xs text-slate-500">
                          {new Date(message.sentAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    );
                  })
                )}

                {chatError && (
                  <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {chatError}
                  </p>
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="border-t border-slate-800 p-3"
              >
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    placeholder="Type a message..."
                    className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-slate-500"
                  />

                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="rounded-lg bg-indigo-500 p-2.5 text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send size={17} />
                  </button>
                </div>
              </form>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupDiscussionPage;
