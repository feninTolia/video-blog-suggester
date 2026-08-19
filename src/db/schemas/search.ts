import { index, snakeCase, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { id } from '../utils';
import { user } from './auth';

export const searchQueries = snakeCase.table(
  'search_queries',
  {
    id,
    queryText: text().notNull(),
    userId: uuid()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    resultContentIds: uuid().array().notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_search_queries_user_id').on(table.userId, table.createdAt),
  ],
);
