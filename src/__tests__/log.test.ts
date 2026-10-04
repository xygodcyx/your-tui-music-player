import { expect, it } from 'vitest'
import { getLogPath, LogDebug } from '../log'

it('path', () => {
  const logPath = getLogPath()
  expect(logPath).toBe('logs/log-2.log')
  LogDebug('Log Test', {
    level: 'info',
    source: 'LoginPanel',
  })
})
