import { start } from 'workflow/api';
import { ingestBlogArticlesWorkflow } from '@/workflows/ingest-articles';
import { NextResponse } from 'next/server';

export async function GET() {
  const run = await start(ingestBlogArticlesWorkflow);
  return NextResponse.json({
    runId: run.runId,
    message: 'Blog articles ingestion workflow started',
  });
}
