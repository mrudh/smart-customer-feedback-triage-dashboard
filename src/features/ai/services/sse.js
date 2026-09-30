export async function* readSseData(body) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { value, done } = await reader.read()
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true })
      buffer = buffer.replace(/\r\n?/g, '\n')

      let boundary = buffer.indexOf('\n\n')
      while (boundary !== -1) {
        const data = parseEvent(buffer.slice(0, boundary))
        buffer = buffer.slice(boundary + 2)
        if (data !== null) yield data
        boundary = buffer.indexOf('\n\n')
      }

      if (done) {
        const data = parseEvent(buffer)
        if (data !== null) yield data
        return
      }
    }
  } finally {
    // If the user stopped early, cancel and so the browser closes the connection
    await reader.cancel().catch(() => undefined)
    reader.releaseLock()
  }
}

function parseEvent(raw) {
  const dataLines = []
  for (const line of raw.split('\n')) {
    if (line.startsWith('data:')) dataLines.push(line.slice(5).replace(/^ /, ''))
  }
  return dataLines.length ? dataLines.join('\n') : null
}
