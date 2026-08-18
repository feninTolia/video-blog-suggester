import { db } from '@/db/db';
import { chunks, content } from '@/db/schema';
import { chunkTranscript } from '@/lib/chunking/chunkTranscript';
import { embedChunks } from '@/lib/embedding/embed-chunks';
import { createYouTubeClient } from '@/lib/youtube/youtubeClient';
import {
  youtube_v3,
} from 'googleapis';
import { parseSync } from 'subtitle';
import { Readable } from 'stream';
import { FatalError } from 'workflow';
import { toYouTubeVideoUrl } from '../constants';

const THUMBNAIL_RESOLUTION_ORDER = [
  'maxres',
  'high',
  'medium',
  'standard',
  'default',
] as const;

async function readResponseBody(data: unknown): Promise<string> {
  if (typeof data === 'string') {
    return data;
  }

  if (Buffer.isBuffer(data)) {
    return data.toString('utf8');
  }

  if (data instanceof Readable) {
    const chunks: Buffer[] = [];
    for await (const chunk of data) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf8');
  }

  throw new FatalError('Unexpected captions download response body');
}

function pickCaptionTrack(items: youtube_v3.Schema$Caption[]) {
  const englishTracks = items.filter((item) =>
    item.snippet?.language?.toLowerCase().startsWith('en'),
  );
  const source = englishTracks.length > 0 ? englishTracks : items;

  return (
    source.find((item) => item.snippet?.trackKind === 'standard') ??
    source.find((item) => item.snippet?.trackKind === 'asr') ??
    source[0]
  );
}

function pickThumbnailUrl(
  thumbnails: youtube_v3.Schema$VideoSnippet['thumbnails'],
) {
  for (const resolution of THUMBNAIL_RESOLUTION_ORDER) {
    const thumbnail = thumbnails?.[resolution];
    if (thumbnail?.url) {
      return thumbnail.url;
    }
  }

  return '';
}

export async function ingestYouTubeVideoStep(videoId: string) {
  'use step';

  const youtube = createYouTubeClient();

  const videoResponse = await youtube.videos.list({
    part: ['snippet'],
    id: [videoId],
  });

  const snippet = videoResponse.data.items?.[0]?.snippet;

  if (!snippet) {
    throw new FatalError(`Failed to find video:${videoId}`);
  }

  const captionsResponse = await youtube.captions.list({
    part: ['snippet'],
    videoId,
  });

  const track = pickCaptionTrack(captionsResponse.data.items ?? []);

  if (!track?.id) {
    throw new FatalError(`No captions available for video:${videoId}`);
  }

  const downloadResponse = await youtube.captions.download({
    id: track.id,
    tfmt: 'srt',
  });

  const srt = await readResponseBody(downloadResponse.data);

  const cues = parseSync(srt)
    .filter((node) => node.type === 'cue')
    .map((node) => node.data)
    .filter((cue) => cue.text.trim().length > 0);

  const chunkText = chunkTranscript(cues);
  const embedding = await embedChunks(chunkText.map((chunk) => chunk.text));

  const url = toYouTubeVideoUrl(videoId);

  const [contentRow] = await db
    .insert(content)
    .values({
      type: 'video' as const,
      thumbnailUrl: pickThumbnailUrl(snippet.thumbnails),
      title: snippet.title ?? '',
      description: snippet.description ?? '',
      publishDate: new Date(snippet.publishedAt ?? Date.now()),
      url,
      content: cues.map((cue) => cue.text).join('\n'),
    })
    .onConflictDoNothing()
    .returning({ id: content.id });

  if (contentRow?.id == null) {
    throw new FatalError(`Duplicate detected and failed to insert - ${url}`);
  }

  if (chunkText.length > 0) {
    await db.insert(chunks).values(
      chunkText.map((chunk, idx) => ({
        contentId: contentRow.id,
        startPosition: chunk.startTime,
        embedding: embedding[idx],
        text: chunk.text,
      })),
    );
  }
}