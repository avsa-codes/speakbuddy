import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { socket } from '../../socket/socket';

function WaitingRoomPage() {
  const { groupDiscussionId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasSessionStarted, setHasSessionStarted] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

const handleJoinSession = async () => {
  if (!groupDiscussionId) return;

  setIsJoining(true);
  setError('');

  try {
    const response = await fetch(
      `http://localhost:5000/api/group-discussions/${groupDiscussionId}/join`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to join session.');
    }

    const handleGroupJoined = (eventData: { groupDiscussionId: string }) => {
      if (eventData.groupDiscussionId !== groupDiscussionId) return;

      cleanup();
      navigate(`/group-discussion/${groupDiscussionId}`);
    };

    const handleGroupError = (eventData: { message: string }) => {
      cleanup();
      setError(eventData.message);
      setIsJoining(false);
    };

    const cleanup = () => {
      socket.off('group:joined', handleGroupJoined);
      socket.off('group:error', handleGroupError);
    };

    socket.on('group:joined', handleGroupJoined);
    socket.on('group:error', handleGroupError);

    socket.emit('group:join', { groupDiscussionId });
  } catch (error) {
    setError(
      error instanceof Error ? error.message : 'Failed to join session.'
    );
    setIsJoining(false);
  }
};

  useEffect(() => {
    const validateWaitingRoom = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/group-discussions/${groupDiscussionId}/waiting-room`,
          {
            credentials: 'include',
          }
        );

        const data = await response.json();

        if (data.data.status === 'ACTIVE') {
          setHasSessionStarted(true);
        }

        if (!response.ok) {
          throw new Error(data.message || 'Unable to enter waiting room.');
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Something went wrong.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (groupDiscussionId) {
      validateWaitingRoom();
    }
  }, [groupDiscussionId]);

  useEffect(() => {
    const handleGroupStarted = (data: {
      groupDiscussionId: string
    }) => {
      if(data.groupDiscussionId === groupDiscussionId){
        setHasSessionStarted(true);
      }
    }

    socket.on('group:started', handleGroupStarted);

    return() => {
      socket.off('group:started', handleGroupStarted)
    }
  }, [groupDiscussionId])

  if (isLoading) {
    return <p>Checking your reservation...</p>;
  }

  if (error) {
    return (
      <div className='text-white'>
        <p>{error}</p>
        <button onClick={() => navigate('/groups')}>Back to Groups</button>
      </div>
    );
  }

return (
  <div className="text-white">
    <h1>Waiting Room</h1>

    {hasSessionStarted ? (
      <>
        <p>Your group discussion has started!</p>
        <button type="button" onClick={handleJoinSession} disabled={isJoining}>
          {isJoining ? 'Joining...' : 'Join Session'}
        </button>
      </>
    ) : (
      <p>Your reservation is valid. Waiting for the session to start...</p>
    )}
  </div>
);
}

export default WaitingRoomPage;
