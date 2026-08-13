import { searchContent } from '@/lib/search/search-content';

export function ResultCard({
  result,
}: {
  result: Awaited<ReturnType<typeof searchContent>>[number];
}) {
  return (
    <a
      href={getUrlAtChunkLocation(result)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 rounded-xl border border-border bg-card p-3 transition-colors hover:border-muted"
    >
      <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg bg-muted/10">
        <img
          src={result.thumbnailUrl}
          alt={result.title}
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-1.5 left-1.5 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {result.type}
        </span>
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <h2 className="truncate font-medium text-foreground group-hover:underline">
          {result.title}
        </h2>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {result.description}
        </p>
      </div>

      <div className="flex shrink-0 items-start pt-0.5">
        <span className="rounded-full border border-border px-2 py-0.5 text-sm font-bold tabular-nums  text-emerald-500">
          {(result.similarity * 100).toFixed(0)}% match
        </span>
      </div>
    </a>
  );
}

function getUrlAtChunkLocation(
  result: Awaited<ReturnType<typeof searchContent>>[number],
) {
  const type = result.type;

  switch (type) {
    case 'article': {
      const splitText = result.rawText.split('\n');

      if (splitText.length === 1) {
        return `${result.url}#:~:text=${encodeURIComponent(splitText[0])}`;
      } else {
        return `${result.url}#:~:text=${encodeURIComponent(splitText[0])},${encodeURIComponent(splitText.at(-1) ?? '')}`;
      }
    }

    case 'video':
      return result.url;

    default:
      throw new Error('Unknown result type' + (type satisfies never));
  }
}
