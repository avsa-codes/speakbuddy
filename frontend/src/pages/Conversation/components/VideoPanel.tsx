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
    <section className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl border border-blue-500/30 bg-[#0b142b]">
      <div
        ref={remoteVideoContainer}
        className="absolute inset-0 flex items-center justify-center"
      >
        {!remoteVideoReady && (
          <div className="px-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/15 text-3xl text-indigo-300 sm:h-20 sm:w-20">
              🎥
            </div>

            <p className="mt-4 text-base font-medium text-white sm:text-lg">
              Waiting for partner's video
            </p>

            <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-400 sm:text-sm">
              Their video will appear here when their camera is on.
            </p>
          </div>
        )}
      </div>

      <div
        ref={localVideoContainer}
        className="absolute bottom-3 right-3 h-24 w-32 overflow-hidden rounded-xl border border-blue-400/30 bg-[#101b36] shadow-lg sm:bottom-4 sm:right-4 sm:h-32 sm:w-48"
      >
        {!localVideoReady && (
          <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
            Camera off
          </span>
        )}

        <span className="absolute bottom-2 left-2 z-10 rounded bg-black/40 px-1.5 py-0.5 text-xs text-white">
          You
        </span>
      </div>
    </section>
  );
}
