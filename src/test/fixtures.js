export function makeFeedback(overrides = {}) {
  const { triage, ...rest } = overrides
  return {
    id: 'ofb_test',
    customer: { id: 'cus_1', name: 'Priya Sharma', email: 'priya@gmail.com' },
    orderNumber: '7894221',
    channel: 'email',
    subject: 'Order arrived with missing items',
    message: 'Several items were missing.',
    receivedAt: '2026-09-26T10:00:00.000Z',
    notes: [],
    ...rest,
    triage: { status: 'new', sentiment: null, category: null, classifiedBy: null, updatedAt: null, ...triage },
  }
}

export function streamOf(chunks) {
  const encoder = new TextEncoder()
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(typeof chunk === 'string' ? encoder.encode(chunk) : chunk)
      controller.close()
    },
  })
}
