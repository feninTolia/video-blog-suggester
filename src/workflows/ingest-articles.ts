import { getNewArticlesFromRSSFeedStep } from './steps/fetch-rss-step';
import { ingestArticleStep } from './steps/process-article-step';
import { batchExec } from './utils/batchExec';

export async function ingestBlogArticlesWorkflow() {
  'use workflow';

  const newArticles = await getNewArticlesFromRSSFeedStep();

  return await batchExec(newArticles, ingestArticleStep);
}
