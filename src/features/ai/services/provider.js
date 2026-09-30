export class AiRequestError extends Error {
  constructor(kind, message, retryable = kind !== 'auth' && kind !== 'blocked') {
    super(message)
    this.name = 'AiRequestError'
    this.kind = kind
    this.retryable = retryable
  }
}

export class StreamAbort {
  constructor(cause) {
    this.cause = cause
  }
}
