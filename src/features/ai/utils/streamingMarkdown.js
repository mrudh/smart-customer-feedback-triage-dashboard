export function balanceStreamingMarkdown(markdown) {
  const boldMarkers = markdown.match(/\*\*/g)?.length ?? 0
  return boldMarkers % 2 === 1 ? `${markdown}**` : markdown
}
