import Sidebar from '../../components/Sidebar';
import MobileHeader from '../../components/MobileHeader';
import ConversationHeader from './components/ConversationHeader';
import VideoPanel from './components/VideoPanel';
import CallControls from './components/CallControls';
import ChatPanel from './components/ChatPanel';
import { useEffect, useState } from 'react';
import { socket } from '../../socket/socket';
import type { User } from '../../types/user';
import { API_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [matchedUserId, setMatchedUserId] = useState<string | null>(null);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [callState, setCallState] = useState<'idle' | 'matching' | 'active'>(
    'idle'
  );
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [acceptedCallType, setAcceptedCallType] = useState<
    'audio' | 'video' | null
  >(null);
  const { currentUser } = useAuth();

  const handleMicClick = async () => {
    try {
      await toggleMicrophone();
    } catch (error) {
      console.error('Failed to toggle microphone:', error);
    }
  };

  useEffect(() => {

const handleConversationEnded = () => {
  void leaveAgoraCall().catch((error) => {
    console.error('Failed to leave Agora call:', error);
  });

  setCallState('idle');
  setMatchedUser(null);
  setMatchedUserId(null);
  setConversationId(null);
  setAcceptedCallType(null);
};
    socket.on('conversation:ended', handleConversationEnded);

    return () => {
      socket.off('conversation:ended', handleConversationEnded);
    };
  }, []);

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

  useEffect(() => {
    async function fetchTopics() {
      const response = await fetch(`${API_URL}/api/topics`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setTopics(data.data);
      }
    }

    fetchTopics();
  }, []);

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

  useEffect(() => {
    if (!matchedUserId) return;

    async function fetchMatchedUser() {
      const response = await fetch(`${API_URL}/api/users/${matchedUserId}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setMatchedUser(data.data);
      }
    }

    fetchMatchedUser();
  }, [matchedUserId]);


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
      socket.emit('conversation:end', {
        conversationId,
      });

      setCallState('idle');
      setMatchedUserId(null);
      setMatchedUser(null);
    }
  };

  //audio + video implementation 

  useEffect(() => {
    const handleIncomingCall = (data: IncomingCall) => {
      setIncomingCall(data);
    }

    socket.on('call:incoming', handleIncomingCall);

    return() => {
      socket.off('call:incoming', handleIncomingCall);
    }
  }, []);


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


  return (
    <main className="min-h-dvh overflow-x-hidden bg-[#070B1A] text-white lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <MobileHeader />

        <div className="px-3 pb-24 pt-3 sm:px-6 sm:pb-28 sm:pt-6 lg:px-6">
          <section className="mx-auto w-full max-w-7xl">
            <ConversationHeader
              partnerName={matchedUser?.name}
              partnerPhoto={matchedUser?.profilePhoto}
              topics={topics}
              selectedTopicId={selectedTopicId}
              onTopicChange={setSelectedTopicId}
            />

            <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:mt-4 sm:gap-4 xl:h-[calc(min(56vh,580px)+132px)] xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.9fr)]">
              <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
                <VideoPanel />
                <CallControls
                  callState={callState}
                  onCallAction={handleCallAction}
                  onCameraClick={handleCameraClick}
                  onMicClick={handleMicClick}
                />
              </div>

              <div className="min-w-0">
                <ChatPanel
                  partnerId={matchedUserId}
                  conversationId={conversationId}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

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
    </main>
  );
}
