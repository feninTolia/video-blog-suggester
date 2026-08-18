import { serverEnv } from '@/data/serverEnv';
import { google, youtube_v3 } from 'googleapis';

export function createYouTubeClient(): youtube_v3.Youtube {
  const oauth2Client = new google.auth.OAuth2(
    serverEnv.GOOGLE_CLIENT_ID,
    serverEnv.GOOGLE_CLIENT_SECRET,
  );

  oauth2Client.setCredentials({ refresh_token: serverEnv.GOOGLE_REFRESH_TOKEN });

  return google.youtube({ version: 'v3', auth: oauth2Client });
}
