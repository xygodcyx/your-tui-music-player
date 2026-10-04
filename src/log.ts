import type { LogEntrie, WithOptional } from './types'

import { mkdir } from 'node:fs'
import { appendFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import _ from 'lodash'

const LOG_DIR_PATH = 'logs/'
const RUNNTIME_LOG = true
const PRELOG = true

const date = new Date()
mkdir(LOG_DIR_PATH, { recursive: true }, (_err) => {})
const LOG_PATH = RUNNTIME_LOG ? path.join(LOG_DIR_PATH, 'running_time.log') : path.join(LOG_DIR_PATH, `log-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`)

export function getLogPath(): string {
  return LOG_PATH
}

export function ClearAllLog() {
  if (PRELOG) {
    appendFile(LOG_PATH, '==================Clear==================\n')
    return
  }
  writeFile(LOG_PATH, '')
}

type LogExtra = Omit<WithOptional<LogEntrie, 'timestamp' | 'level'>, 'message' | 'id'>

export function LogDebug(...messages: any[]): void
export function LogDebug(message1: any, extra?: LogExtra): void

export function LogDebug(...messages: any[]) {
  const hasCleanExtra = messages.length > 1 && messages[messages.length - 1].source

  let extra = {}
  if (hasCleanExtra) {
    extra = messages[messages.length - 1]
  }

  const date = new Date()

  const useExtra: LogExtra = {
    level: 'info',
    timestamp: date.getTime(),
    source: 'NULL',
    ...extra,
  }

  const formatMessage: string[] = []
  for (const message of messages.slice(0, hasCleanExtra ? messages.length - 1 : messages.length)) {
    let r = message
    if (_.isObject(message)) {
      r = JSON.stringify(message)
    }
    formatMessage.push(r)
  }

  appendFile(LOG_PATH, ` [${useExtra.level!.toLocaleUpperCase()}] MESSAGE: ${formatMessage.join(' , ')} | SOURCE: ${useExtra.source ?? ''} | DETAIL: ${useExtra.details ?? 'NULL'} | IN ${date.toLocaleDateString()}:${date.toLocaleTimeString()}\n`)
}
