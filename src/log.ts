import { mkdir } from 'node:fs'
import { appendFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import _ from 'lodash'
import { moreErrorDetail } from './helpers/utils'

const LOG_DIR_PATH = 'logs/'
const RUNNTIME_LOG = true
const PRELOG = false

const date = new Date()
mkdir(LOG_DIR_PATH, { recursive: true }, (_err) => {})
const LOG_PATH = RUNNTIME_LOG ? path.join(LOG_DIR_PATH, 'running_time.log') : path.join(LOG_DIR_PATH, `log-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`)

export function getLogPath(): string {
  return LOG_PATH
}

export function ClearAllLog() {
  if (PRELOG) {
    return
  }
  appendFile(LOG_PATH, '==================Clear==================\n')
  writeFile(LOG_PATH, '')
}

export function LogDebug(...messages: any[]): void

export function LogDebug(...messages: any[]) {
  const date = new Date()

  const source = moreErrorDetail(new Error('n'))
  const useExtra = {
    level: 'info',
    timestamp: date.getTime(),
    source: `${source}`,
  }

  const formatMessage: string[] = []
  for (const message of messages) {
    let r = message
    if (_.isObject(message)) {
      r = JSON.stringify(message)
    }
    else {
      r = String(r)
    }
    formatMessage.push(r)
  }

  appendFile(LOG_PATH, ` [${useExtra.level!.toLocaleUpperCase()}] : ${formatMessage.join(' , ')} \n [SOURCE]: ${useExtra.source} \n [TIME] ${date.toLocaleDateString()}:${date.toLocaleTimeString()}\n\n`)
}
