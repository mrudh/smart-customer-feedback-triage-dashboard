import { buildSeedFeedback } from '@/data/seedFeedback'
import { delay } from '@/utils/delay'
import { hasSimulation } from '@/utils/simulation'

let failedOnce = false

export async function fetchFeedback(signal) {
  await delay(hasSimulation('slow') ? 3000 : 700, signal)

  if (hasSimulation('error') && !failedOnce) {
    failedOnce = true
    throw new Error('The feedback service is unavailable right now.')
  }
  if (hasSimulation('empty')) return []
  return buildSeedFeedback()
}
