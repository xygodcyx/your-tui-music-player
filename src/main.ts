import process from 'node:process'
import { AppManager } from './app'
import { CommandManager } from './commend'
import { ClientManager } from './helpers/apis/apis'
import { ClearAllLog } from './log'

function onSignal() {
  void AppManager.Instance.shutdown()
}

async function main() {
  try {
    process.once('SIGINT', onSignal)
    process.once('SIGTERM', onSignal)
    ClearAllLog()
    AppManager.Instance.init()
    ClientManager.Instance.init()
    CommandManager.Instance.init()
    await AppManager.Instance.start()
  }
  finally {
    process.off('SIGINT', onSignal)
    process.off('SIGTERM', onSignal)
  }
}

main()
