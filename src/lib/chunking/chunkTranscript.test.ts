import { describe, it, expect } from 'vitest';
import {
  chunkTranscript,
  TRANSCRIPT_CHUNK_CUE_SIZE,
  TRANSCRIPT_CHUNK_CUE_OVERLAP,
} from './chunkTranscript';

function makeCues(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    start: i * 1000,
    end: i * 1000 + 500,
    text: `c${i}`,
  }));
}

describe('chunkTranscript', () => {
  it('returns empty array for empty cues', () => {
    expect(chunkTranscript([])).toEqual([]);
  });

  it('returns a single chunk when fewer cues than chunk size', () => {
    const result = chunkTranscript(makeCues(5));
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      text: 'c0 c1 c2 c3 c4',
      startTime: 0,
    });
  });

  it('returns a single chunk for exactly the chunk size', () => {
    const result = chunkTranscript(makeCues(TRANSCRIPT_CHUNK_CUE_SIZE));
    expect(result).toHaveLength(1);
    expect(result[0].text).toContain('c0');
    expect(result[0].text).toContain(`c${TRANSCRIPT_CHUNK_CUE_SIZE - 1}`);
    expect(result[0].startTime).toBe(0);
  });

  it('creates chunks of chunk size with the configured overlap', () => {
    const result = chunkTranscript(makeCues(30));
    expect(result).toHaveLength(3);

    const step = TRANSCRIPT_CHUNK_CUE_SIZE - TRANSCRIPT_CHUNK_CUE_OVERLAP;
    result.forEach((chunk, idx) => {
      expect(chunk.startTime).toBe(idx * step * 1000);
    });
  });

  it('overlaps each consecutive chunk by the overlap amount', () => {
    const result = chunkTranscript(makeCues(30));
    const overlapStart = TRANSCRIPT_CHUNK_CUE_SIZE - TRANSCRIPT_CHUNK_CUE_OVERLAP;

    result.slice(1).forEach((chunk, idx) => {
      const previousChunk = result[idx];
      const previousOverlap = previousChunk.text
        .split(' ')
        .slice(-TRANSCRIPT_CHUNK_CUE_OVERLAP)
        .join(' ');
      const currentFirst = chunk.text
        .split(' ')
        .slice(0, TRANSCRIPT_CHUNK_CUE_OVERLAP)
        .join(' ');

      expect(currentFirst).toBe(previousOverlap);
    });

    expect(result[1].startTime).toBe(overlapStart * 1000);
  });

  it('does not create a trailing chunk that only repeats the overlap', () => {
    const result = chunkTranscript(makeCues(27));
    expect(result).toHaveLength(2);
    expect(result[1].text).toContain('c26');
  });

  it('includes trailing partial window', () => {
    const result = chunkTranscript(makeCues(16));
    expect(result).toHaveLength(2);
    expect(result[1].text).toBe('c12 c13 c14 c15');
    expect(result[1].startTime).toBe(12000);
  });
});