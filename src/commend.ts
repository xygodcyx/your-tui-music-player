import { AppManager } from './app'
import { Singleton } from './base/singleton'

import { themeSpec } from './theme'

export type UserCommand
  = | 'quit'
    | 'toggle-help'
    | 'cycle-theme'
    | 'cycle-language'

export type AppAction
  = | Readonly<{ type: 'toggle-help' }>
    | Readonly<{ type: 'cycle-theme' }>
    | Readonly<{ type: 'cycle-language' }>

const COMMAND_BY_KEY = {
  'q': 'quit',
  'h': 'toggle-help',
  'ctrl+l': 'toggle-log',
  'shift+/': 'toggle-help',
  't': 'cycle-theme',
} as const

function resolveCommand(key: keyof typeof COMMAND_BY_KEY): UserCommand {
  return COMMAND_BY_KEY[key] as UserCommand
}

export class CommandManager extends Singleton {
  public static get Instance() {
    return this.getInstance<CommandManager>()
  }

  public init() {
    this.bindKeys()
  }

  private bindKeys() {
    AppManager.Instance.Root.keys({
      'q': () => {
        this.applyCommand(resolveCommand('q'))
      },
      'ctrl+c': () => { },
      'ctrl+l': () => this.applyCommand(resolveCommand('ctrl+l')),
      'h': () => this.applyCommand(resolveCommand('h')),
      't': () => this.applyCommand(resolveCommand('t')),
      'escape': () => {
        AppManager.Instance.Root.update(state => (state.showHelp ? { ...state, showHelp: false } : state))
      },
    })
  }

  private async applyCommand(command: ReturnType<typeof resolveCommand>): Promise<void> {
    if (!command)
      return

    switch (command) {
      case 'quit': {
        await AppManager.Instance.stop()
        AppManager.Instance.dispose()
        break
      }
      case 'toggle-help': {
        this.dispatch({ type: 'toggle-help' })
        break
      }
      case 'cycle-language': {
        this.dispatch({ type: 'cycle-language' })
        break
      }
      case 'cycle-theme': {
        this.dispatch({ type: 'cycle-theme' })
        break
      }
    }
  }

  public dispatch(action: AppAction): void {
    let nextThemeName = AppManager.Instance.initialState.themeName
    let themeChanged = false

    AppManager.Instance.Root.update((previous) => {
      const next = AppManager.Instance.reduceState(previous, action)
      if (next.themeName !== previous.themeName) {
        nextThemeName = next.themeName
        themeChanged = true
      }
      return next
    })

    if (themeChanged) {
      AppManager.Instance.Root.setTheme(themeSpec(nextThemeName).theme)
    }
  }
}
