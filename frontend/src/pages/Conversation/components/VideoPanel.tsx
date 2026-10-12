import { useEffect, useRef, useState } from 'react';


import {
  getLocalVideoTrack,
  onLocalVideoReady,
  listenForRemoteUsers,
} from '../../../services/agora.service';

export default function VideoPanel() {
  const [localVideoReady, setLocalVideoReady] = useState(false);
  const [remoteVideoReady, setRemoteVideoReady] = useState(false);

  const localVideoContainer = useRef<HTMLDivElement | null>(null);
  const remoteVideoContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onLocalVideoReady(() => {
      setLocalVideoReady(true);
    });
  }, []);

  useEffect(() => {
    if (!localVideoReady) return;

    const track = getLocalVideoTrack();
    const container = localVideoContainer.current;

    if (!track || !container) return;

    track.play(container);
  }, [localVideoReady]);

useEffect(() => {
  return listenForRemoteUsers((user, mediaType) => {
    if (mediaType !== 'video') return;

    const container = remoteVideoContainer.current;
    if (!container || !user.videoTrack) return;

    user.videoTrack.play(container);
    setRemoteVideoReady(true);
  });
}, []);

  return (
    <section className="relative h-[min(56vh,580px)] overflow-hidden rounded-2xl border border-blue-500/40 bg-[#0b142b]">
      <div
        ref={remoteVideoContainer}
        className="flex h-full items-center justify-center"
      >
        {!remoteVideoReady && (
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/15 text-3xl text-indigo-300">
              🎥
            </div>

            <p className="mt-4 text-lg font-medium text-white">
              Waiting for partner's video
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Their video will appear here when their camera is on.
            </p>
          </div>
        )}
      </div>

      <div
        ref={localVideoContainer}
        className="absolute bottom-4 right-4 h-28 w-40 overflow-hidden rounded-xl border border-blue-400/30 bg-[#101b36] shadow-lg sm:h-32 sm:w-48"
      >
        {!localVideoReady && (
          <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
            Camera off
          </span>
        )}

        <span className="absolute bottom-2 left-2 z-10 text-xs text-white">
          You
        </span>
      </div>
    </section>
  );
}
