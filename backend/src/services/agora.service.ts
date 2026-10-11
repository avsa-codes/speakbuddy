import { RtcTokenBuilder } from "agora-access-token";

const appId = process.env.AGORA_APP_ID;
const appCertificate = process.env.AGORA_APP_CERTIFICATE;

export const generateAgoraToken = (
  channelName: string,
  uid: number,
): string => {
  if (!appId || !appCertificate) {
    throw new Error("Agora credentials are not configured.");
  }

  const expirationTimeInSeconds = 3600;

  const privilegeExpiredTs =
    Math.floor(Date.now() / 1000) + expirationTimeInSeconds;

return RtcTokenBuilder.buildTokenWithUid(
  appId,
  appCertificate,
  channelName,
  uid,
  1,
  privilegeExpiredTs,
);
};
