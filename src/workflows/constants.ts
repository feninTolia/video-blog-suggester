export const RSS_FEED_URL = 'https://blog.webdevsimplified.com/rss.xml';
export const YOUTUBE_CHANNEL_HANDLE = '@WebDevSimplified';
export const YOUTUBE_VIDEO_URL_PREFIX = 'https://www.youtube.com/watch?v=';

export function toYouTubeVideoUrl(videoId: string) {
  return `${YOUTUBE_VIDEO_URL_PREFIX}${videoId}`;
}
