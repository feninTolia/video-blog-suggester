import { db } from '@/db/db';
import { chunks, content } from '@/db/schema';
import { chunkArticles } from '@/lib/chunking/chunkArticles';
import { embedChunks } from '@/lib/embedding/embed-chunks';
import { load } from 'cheerio';
import Parser from 'rss-parser';
import { FatalError } from 'workflow';
import z from 'zod';

const feedItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  link: z.url(),
  pubDate: z.coerce.date(),
});

export async function ingestArticleStep(feedItem: Parser.Item) {
  'use step';

  const { error, data: item } = feedItemSchema.safeParse(feedItem);

  if (error) {
    throw new FatalError(
      `Failed to process RSS feed item:${feedItem.link} - ${error.message}`,
    );
  }

  const response = await fetch(item.link);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch article:${item.link} - ${response.statusText}`,
    );
  }

  const html = await response.text();

  const $ = load(html);

  const mainHtml = $('article main').html();

  const thumbnailUrl =
    $('meta[property="og:image"]').attr('content') ??
    $('meta[name="twitter:image"]').attr('content');

  if (mainHtml == null || thumbnailUrl == null) {
    throw new FatalError(
      `Failed load main content for RSS feed item:${item.link}`,
    );
  }

  const chunkText = chunkArticles(mainHtml);
  const embedding = await embedChunks(chunkText);

  const [contentRow] = await db
    .insert(content)
    .values({
      type: 'article' as const,
      thumbnailUrl,
      title: item.title,
      description: item.description,
      publishDate: item.pubDate,
      url: item.link,
      content: mainHtml,
    })
    .onConflictDoNothing()
    .returning({ id: content.id });

  if (contentRow?.id == null) {
    throw new FatalError(
      `Duplicate detected and failed to insert - ${item.link}`,
    );
  }

  if (chunkText.length > 0) {
    await db.insert(chunks).values(
      chunkText.map((chunk, idx) => ({
        contentId: contentRow.id,
        startPosition: null,
        embedding: embedding[idx],
        text: chunk,
      })),
    );
  }
}
