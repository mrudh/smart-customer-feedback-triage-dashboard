export const EMPTY_ANALYSIS = {
  status: 'idle',
  markdown: '',
  suggestion: null,
  error: null,
  startedAt: null,
  completedAt: null,
  rating: null,
  review: 'pending',
  provider: null,
}

export const isAnalysisActive = (status) => status === 'connecting' || status === 'streaming'