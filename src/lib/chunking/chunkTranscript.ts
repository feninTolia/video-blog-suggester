export interface TranscriptCue {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptChunk {
  text: string;
  startTime: number;
}

export const TRANSCRIPT_CHUNK_CUE_SIZE = 15;
export const TRANSCRIPT_CHUNK_CUE_OVERLAP = 3;

export function chunkTranscript(cues: TranscriptCue[]): TranscriptChunk[] {
  if (cues.length === 0) return [];

  const chunks: TranscriptChunk[] = [];
  const step = TRANSCRIPT_CHUNK_CUE_SIZE - TRANSCRIPT_CHUNK_CUE_OVERLAP;

  for (let i = 0; i < cues.length - TRANSCRIPT_CHUNK_CUE_OVERLAP; i += step) {
    const windowCues = cues.slice(i, i + TRANSCRIPT_CHUNK_CUE_SIZE);

    chunks.push({
      text: windowCues.map((cue) => cue.text).join(' '),
      startTime: windowCues[0].start,
    });
  }

  return chunks;
}
