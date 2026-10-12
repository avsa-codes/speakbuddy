import type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from 'agora-rtc-sdk-ng';
import AgoraRTC from 'agora-rtc-sdk-ng';

import { API_URL } from '../config/api';

type AgoraTokenResponse = {
  success: boolean;
  data: {
    appId: string;
    channelName: string;
    uid: number;
    token: string;
  };
};

const agoraClient: IAgoraRTCClient = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
});

let localAudioTrack: ILocalAudioTrack | null = null;
let localVideoTrack: ILocalVideoTrack | null = null;
let onLocalVideoTrackReady: (() => void) | null = null;
let isJoiningAgoraCall = false;


// onLocalVideoTrackReady stores a callback function.
// onLocalVideoReady() lets another file register that callback.
// ?.() means call the function only if one has been registered.
// When publishCamera() creates the track, it notifies the registered callback.

export async function fetchAgoraToken(
  conversationId: string
): Promise<AgoraTokenResponse['data']> {
  const response = await fetch(
    `${API_URL}/api/calls/token?conversationId=${encodeURIComponent(
      conversationId
    )}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  const result: AgoraTokenResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error('Failed to obtain Agora token.');
  }

  return result.data;
}


export async function joinAgoraCall(conversationId: string): Promise<void> {
  if (isJoiningAgoraCall) return;

  isJoiningAgoraCall = true;

  try {
    const { appId, channelName, uid, token } = await fetchAgoraToken(
      conversationId
    );

    await agoraClient.join(appId, channelName, token, uid);
  } catch (error) {
    isJoiningAgoraCall = false;
    throw error;
  }
}


export async function publishMicrophone(): Promise<void> {
  if (!localAudioTrack) {
    localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  }

  await agoraClient.publish(localAudioTrack);
}

export async function publishCamera(): Promise<void> {

  if (!localVideoTrack) {
    localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    onLocalVideoTrackReady?.();
  }

  await agoraClient.publish(localVideoTrack);
}

export async function leaveAgoraCall(): Promise<void> {
  if (localAudioTrack) {
    localAudioTrack.stop();
    localAudioTrack.close();
    localAudioTrack = null;
  }

  if (localVideoTrack) {
    localVideoTrack.stop();
    localVideoTrack.close();
    localVideoTrack = null;
  }

  try {
    await agoraClient.leave();
  } finally {
    isJoiningAgoraCall = false;
  }
}

export async function toggleMicrophone(): Promise<boolean> {
  if (!localAudioTrack) return false;

  const enabled = localAudioTrack.enabled;
  await localAudioTrack.setEnabled(!enabled);

  return !enabled;
}


export async function toggleCamera(): Promise<boolean> {
  if (!localVideoTrack) {
    await publishCamera();
    return true;
  }

  const enabled = localVideoTrack.enabled;
  await localVideoTrack.setEnabled(!enabled);

  return !enabled;
}




export function listenForRemoteUsers(
  onRemoteTrack: (
    user: IAgoraRTCRemoteUser,
    mediaType: 'audio' | 'video'
  ) => void
): () => void {
  const handleUserPublished = async (
    user: IAgoraRTCRemoteUser,
    mediaType: 'audio' | 'video' | 'datachannel'
  ) => {
    if (mediaType === 'datachannel') return;

    await agoraClient.subscribe(user, mediaType);

    if (mediaType === 'audio') {
      user.audioTrack?.play();
    }

    onRemoteTrack(user, mediaType);
  };

  agoraClient.on('user-published', handleUserPublished);

  return () => {
    agoraClient.off('user-published', handleUserPublished);
  };
}


export function getLocalVideoTrack(): ILocalVideoTrack | null {
  return localVideoTrack;
}

export function onLocalVideoReady(callback: () => void): void {
  onLocalVideoTrackReady = callback;
}