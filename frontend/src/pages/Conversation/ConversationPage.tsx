import Sidebar from '../../components/Sidebar';
import MobileHeader from '../../components/MobileHeader';
import ConversationHeader from './components/ConversationHeader';
import VideoPanel from './components/VideoPanel';
import CallControls from './components/CallControls';
import ChatPanel from './components/ChatPanel';
import { useEffect, useState } from 'react';
import { socket } from '../../socket/socket';
import type { User } from '../../types/user';

type Topic = {
  id: string,
  title: string,
  description: string
}

export default function ConversationPage() {

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [matchedUserId, setMatchedUserId] = useState<string | null>(null);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [callState, setCallState] = useState<'idle' | 'matching' | 'active'>(
    'idle'
  );


  useEffect(() => {
    
    const handleConversationEnded = () => {
      setCallState('idle');
      setMatchedUser(null);
      setMatchedUserId(null);
      setConversationId(null);
    }

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
      const response = await fetch('http://localhost:5000/api/topics', {
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
  const handleMatchFound = (data: {
    matchedUserId: string;
    conversationId: string;
  }) => {
    console.log('Match found:', data.matchedUserId);
    console.log('Conversation ID:', data.conversationId);

    setMatchedUserId(data.matchedUserId);
    setConversationId(data.conversationId);
    setCallState('active');
  };

  socket.on('match:found', handleMatchFound);

  return () => {
    socket.off('match:found', handleMatchFound);
  };
}, []);

useEffect(() => {
  if (!matchedUserId) return;

  async function fetchMatchedUser() {
    const response = await fetch(
      `http://localhost:5000/api/users/${matchedUserId}`,
      {
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (response.ok) {
      setMatchedUser(data.data);
    }
  }

  fetchMatchedUser();
}, [matchedUserId]);

const handleCallAction = () => {
  if (callState === 'idle') {
    if (!selectedTopicId) return;

    socket.emit('match:request', {
      topicId: selectedTopicId,
    });

    setCallState('matching');
    return;
  }

  if(callState === 'matching'){
    socket.emit('match:cancel');
    setCallState('idle');
    return;
  }

if (callState === 'active') {
  socket.emit('conversation:end', {
    conversationId
  });

  setCallState('idle');
  setMatchedUserId(null);
  setMatchedUser(null);
}
};

  return (
    <main className="min-h-screen bg-[#070B1A] text-white lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <MobileHeader />

        <div className="px-5 pb-28 pt-5 sm:px-6 sm:pb-28 sm:pt-6">
          <section className="mx-auto w-full max-w-7xl">
            {/* Conversation Header */}
            <ConversationHeader
              partnerName={matchedUser?.name}
              partnerPhoto={matchedUser?.profilePhoto}
              topics={topics} // Here's all topics
              selectedTopicId={selectedTopicId} // Here's the current selection
              onTopicChange={setSelectedTopicId} // Here's how you change my selection
            />

            {/* Main Conversation Area */}
            <div className="mt-4 grid gap-4 lg:h-[calc(min(56vh,580px)+132px)] lg:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.9fr)]">
              {/* Left: Video + Controls */}
              <div className="flex min-w-0 flex-col">
                <VideoPanel />

                <CallControls
                  callState={callState}
                  onCallAction={handleCallAction}
                />
              </div>

              {/* Right: Chat */}
              <ChatPanel
                partnerId={matchedUserId}
                conversationId={conversationId}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
