import { ingestYouTubeVideosWorkflow } from '@/workflows/ingest-videos';
import { verifyAndRunCron } from '@/workflows/utils/verifyAndRunCron';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return await verifyAndRunCron(req, ingestYouTubeVideosWorkflow);
}