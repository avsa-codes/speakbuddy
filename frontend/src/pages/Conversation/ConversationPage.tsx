import { useEffect, useRef, useState } from 'react';

import Sidebar from '../../components/Sidebar';
import MobileHeader from '../../components/MobileHeader';
import ConversationHeader from './components/ConversationHeader';
import VideoPanel from './components/VideoPanel';
import CallControls from './components/CallControls';
import ChatPanel from './components/ChatPanel';
import RatingModal from './components/RatingModal';

import { socket } from '../../socket/socket';
import type { User } from '../../types/user';
import { API_URL } from '../../config/api';

import {
  joinAgoraCall,
  publishMicrophone,
  leaveAgoraCall,
  toggleMicrophone,
  publishCamera,
  toggleCamera,
} from '../../services/agora.service';

type Topic = {
  id: string;
  title: string;
  description: string;
};

type IncomingCall = {
  conversationId: string;
  callerId: string;
  callType: 'audio' | 'video';
};

export default function ConversationPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [matchedUserId, setMatchedUserId] = useState<string | null>(null);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [callState, setCallState] = useState<'idle' | 'matching' | 'active'>(
    'idle'
  );

  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);

  const [acceptedCallType, setAcceptedCallType] = useState<
    'audio' | 'video' | null
  >(null);

  const [ratingTarget, setRatingTarget] = useState<User | null>(null);

  const matchedUserRef = useRef<User | null>(null);
  const matchedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    matchedUserRef.current = matchedUser;
    matchedUserIdRef.current = matchedUserId;
  }, [matchedUser, matchedUserId]);

  // Toggle microphone.
  const handleMicClick = async () => {
    try {
      await toggleMicrophone();
    } catch (error) {
      console.error('Failed to toggle microphone:', error);
    }
  };

  // Handle the conversation ending and prepare the rating modal.
  useEffect(() => {
    const handleConversationEnded = async () => {
      const partner = matchedUserRef.current;
      const partnerId = matchedUserIdRef.current;

      void leaveAgoraCall().catch((error) => {
        console.error('Failed to leave Agora call:', error);
      });

      if (partner) {
        setRatingTarget(partner);
      } else if (partnerId) {
        try {
          const response = await fetch(`${API_URL}/api/users/${partnerId}`, {
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            setRatingTarget(data.data);
          }
        } catch (error) {
          console.error('Failed to load rating recipient:', error);
        }
      }

      setCallState('idle');
      setMatchedUser(null);
      setMatchedUserId(null);
      setConversationId(null);
      setAcceptedCallType(null);
      setIsChatOpen(false);
    };

    socket.on('conversation:ended', handleConversationEnded);

    return () => {
      socket.off('conversation:ended', handleConversationEnded);
    };
  }, []);

  // Recover an active conversation after reconnecting.
  useEffect(() => {
    const handleConversationRecovered = (data: { partnerUserId: string }) => {
      console.log('Conversation recovered:', data.partnerUserId);
      setMatchedUserId(data.partnerUserId);
      setCallState('active');
    };

    socket.on('conversation:recovered', handleConversationRecovered);

    return () => {
      socket.off('conversation:recovered', handleConversationRecovered);
    };
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      socket.emit('conversation:recover');
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on('connect', handleConnect);

    return () => {
      socket.off('connect', handleConnect);
    };
  }, []);

  // Load conversation topics.
  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await fetch(`${API_URL}/api/topics`, {
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          setTopics(data.data);
        }
      } catch (error) {
        console.error('Failed to load topics:', error);
      }
    }

    void fetchTopics();
  }, []);

  // Handle a successful match and join the Agora audio call.
  useEffect(() => {
    const handleMatchFound = async (data: {
      matchedUserId: string;
      conversationId: string;
    }) => {
      console.log('Match found:', data.matchedUserId);
      console.log('Conversation ID:', data.conversationId);

      setMatchedUserId(data.matchedUserId);
      setConversationId(data.conversationId);
      setCallState('active');

      try {
        await joinAgoraCall(data.conversationId);
        await publishMicrophone();

        console.log('Agora audio started:', data.conversationId);
      } catch (error) {
        console.error('Failed to start Agora audio:', error);
      }
    };

    socket.on('match:found', handleMatchFound);

    return () => {
      socket.off('match:found', handleMatchFound);
    };
  }, []);

  // Load the matched user's profile.
  useEffect(() => {
    if (!matchedUserId) {
      setMatchedUser(null);
      return;
    }

    async function fetchMatchedUser() {
      try {
        const response = await fetch(`${API_URL}/api/users/${matchedUserId}`, {
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          setMatchedUser(data.data);
        }
      } catch (error) {
        console.error('Failed to load matched user:', error);
      }
    }

    void fetchMatchedUser();
  }, [matchedUserId]);

  // Start or toggle video.
  const handleCameraClick = () => {
    if (!conversationId || callState !== 'active') return;

    if (acceptedCallType === null) {
      socket.emit('call:invite', {
        conversationId,
        callType: 'video',
      });

      return;
    }

    void toggleCamera().catch((error) => {
      console.error('Failed to toggle camera:', error);
    });
  };

  // Start, cancel, or end a conversation.
  const handleCallAction = () => {
    if (callState === 'idle') {
      if (!selectedTopicId) return;

      socket.emit('match:request', {
        topicId: selectedTopicId,
      });

      setCallState('matching');
      return;
    }

    if (callState === 'matching') {
      socket.emit('match:cancel');
      setCallState('idle');
      return;
    }

    if (callState === 'active') {
      if (!conversationId) return;

      socket.emit('conversation:end', {
        conversationId,
      });
    }
  };

  // Listen for incoming calls.
  useEffect(() => {
    const handleIncomingCall = (data: IncomingCall) => {
      setIncomingCall(data);
    };

    socket.on('call:incoming', handleIncomingCall);

    return () => {
      socket.off('call:incoming', handleIncomingCall);
    };
  }, []);

  // Start publishing the camera after a video call is accepted.
  useEffect(() => {
    const handleCallAccepted = async (data: {
      conversationId: string;
      acceptedBy: string;
      callType: 'audio' | 'video';
    }) => {
      if (data.conversationId !== conversationId) return;
      if (data.callType !== 'video') return;

      try {
        await publishCamera();
        setAcceptedCallType('video');

        console.log('Video call started:', data.conversationId);
      } catch (error) {
        console.error('Failed to start video call:', error);
      }
    };

    socket.on('call:accepted', handleCallAccepted);

    return () => {
      socket.off('call:accepted', handleCallAccepted);
    };
  }, [conversationId]);

  // Handle rejected calls.
  useEffect(() => {
    const handleCallRejected = (data: {
      conversationId: string;
      rejectedBy: string;
      callType: 'audio' | 'video';
    }) => {
      if (data.conversationId !== conversationId) return;

      setIncomingCall(null);
      alert('Your call was declined.');
    };

    socket.on('call:rejected', handleCallRejected);

    return () => {
      socket.off('call:rejected', handleCallRejected);
    };
  }, [conversationId]);

  // Submit the partner's rating.
  const handleRatingSubmit = async (rating: number) => {
    if (!ratingTarget) return;

    const response = await fetch(`${API_URL}/api/ratings/${ratingTarget.id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? 'Failed to submit rating.');
    }

    setRatingTarget(null);
  };

  //timer

  useEffect(() => {
    if (callState !== 'active') {
      setElapsedSeconds(0);
      return;
    }

    const startedAt = Date.now();

    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [callState]);

  return (
    <main className="flex h-dvh overflow-hidden bg-[#070B1A] text-white">
      <Sidebar />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0">
          <MobileHeader />
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden px-3 py-3 sm:px-5 sm:py-5 lg:px-6">
          <section className="mx-auto flex h-full w-full max-w-[1600px] min-w-0 flex-col overflow-hidden">
            {/* Header stays above the video area. */}
            <div className="shrink-0">
              <ConversationHeader
                partnerName={matchedUser?.name}
                partnerPhoto={matchedUser?.profilePhoto}
                topics={topics}
                selectedTopicId={selectedTopicId}
                onTopicChange={setSelectedTopicId}
                elapsedSeconds={elapsedSeconds}
              />
            </div>

            {/* Video and controls occupy the remaining height. */}
            <div className="relative mt-3 flex min-h-0 flex-1 gap-3 overflow-hidden sm:mt-4 sm:gap-4">
              <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden sm:gap-4">
                <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
                  <VideoPanel />
                </div>

                <div className="shrink-0">
                  <CallControls
                    callState={callState}
                    onCallAction={handleCallAction}
                    onCameraClick={handleCameraClick}
                    onMicClick={handleMicClick}
                  />
                </div>
              </div>

              {/* Mobile backdrop. It does not contain ChatPanel. */}
              <button
                type="button"
                aria-label="Close chat backdrop"
                onClick={() => setIsChatOpen(false)}
                className={`fixed inset-0 z-30 bg-black/50 lg:hidden ${
                  isChatOpen ? '' : 'hidden'
                }`}
              />

              {/*
                Keep this aside mounted at all times.
                Hiding it must not unmount ChatPanel or clear its messages.
              */}
              <aside
                aria-label="Conversation chat"
                aria-hidden={!isChatOpen}
                className={`fixed inset-x-3 bottom-24 top-20 z-40 flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D1428] shadow-2xl sm:inset-x-auto sm:bottom-28 sm:right-6 sm:top-24 sm:w-[380px] lg:relative lg:inset-auto lg:h-full lg:w-[340px] lg:shrink-0 ${
                  isChatOpen ? '' : 'hidden'
                }`}
              >
                <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
                  <h2 className="font-semibold text-white">Chat</h2>

                  <button
                    type="button"
                    onClick={() => setIsChatOpen(false)}
                    aria-label="Close chat"
                    className="rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  <ChatPanel
                    partnerId={matchedUserId}
                    conversationId={conversationId}
                  />
                </div>
              </aside>
            </div>
          </section>
        </div>
      </div>

      {/* Floating button to open chat. */}
      {!isChatOpen && (
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          aria-label="Open chat"
          className="fixed bottom-5 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-500 sm:bottom-6 sm:right-6"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h8M8 14h5m-1 7-4-4H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5l-4 4Z"
            />
          </svg>
        </button>
      )}

      {/* Incoming call modal. */}
      {incomingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-blue-500/40 bg-[#0b142b] p-6 text-center shadow-xl">
            <h2 className="text-xl font-semibold text-white">
              Incoming {incomingCall.callType} call
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Someone wants to start a video conversation with you.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  socket.emit('call:reject', {
                    conversationId: incomingCall.conversationId,
                  });

                  setIncomingCall(null);
                }}
                className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
              >
                Reject
              </button>

              <button
                type="button"
                onClick={() => {
                  socket.emit('call:accept', {
                    conversationId: incomingCall.conversationId,
                  });

                  setIncomingCall(null);
                }}
                className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-600"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating modal. */}
      {ratingTarget && (
        <RatingModal
          user={ratingTarget}
          onSubmit={handleRatingSubmit}
          onClose={() => setRatingTarget(null)}
        />
      )}
    </main>
  );
}
