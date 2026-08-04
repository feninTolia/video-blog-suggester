import { load } from 'cheerio';

// export function chunkArticles(mainHtml: string): string[] {
//   const $ = load(mainHtml, null, false);
//   const container = $('div').first();
//   const chunks: string[] = [];
//   let currentChunk = '';

//   container.contents().each((_i, elem) => {
//     const $elem = $(elem);
//     if ($elem.is('h2')) {
//       if (currentChunk.trim()) {
//         chunks.push(currentChunk.trim());
//       }
//       currentChunk = $elem.text().trim() + ' ';
//     } else {
//       const text = $elem.text().trim();
//       if (text) {
//         currentChunk += text + ' ';
//       }
//     }
//   });

//   if (currentChunk.trim()) {
//     chunks.push(currentChunk.trim());
//   }

//   return chunks;
// }

export function chunkArticles(mainHtml: string): string[] {
  const result: string[] = [];

  const $ = load(mainHtml, null, false);
  const $main = $.root();

  let currentChunk = '';

  $main.children().each((_i, el) => {
    const text = $(el).text().trim();

    if (el.name === 'h2') {
      if (currentChunk.trim()) {
        result.push(currentChunk.trim());
      }
      currentChunk = '';
    }

    if (text) {
      currentChunk += `${text}\n\n`;
    }
  });

  if (currentChunk.trim()) {
    result.push(currentChunk.trim());
  }

  return result;
}
