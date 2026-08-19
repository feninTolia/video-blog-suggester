DROP INDEX "chunks_embedding_idx";--> statement-breakpoint
CREATE INDEX "idx_search_queries_user_id" ON "search_queries" ("user_id","created_at");