import { db } from '@/db/db';
import { RSS_FEED_URL } from '../constants';

const RSSParser = (await import('rss-parser')).default;

export async function getNewArticlesFromRSSFeedStep() {
  'use step';

  const parser = new RSSParser({ customFields: { item: ['description'] } });
  const { items } = await parser.parseURL(RSS_FEED_URL);

  const existingUrls = await db.query.content
    .findMany({
      where: { type: 'article' },
      columns: { url: true },
    })
    .then((data) => data.map(({ url }) => url));

  return items.filter((item) => item.link && !existingUrls.includes(item.link));
}
