import type { AppAction } from './commend'
import type { LanguageCode } from './i18n/tr'
import type { AppState } from './types'
import { createNodeApp } from '@rezi-ui/node'
import { Singleton } from './base/singleton'
import { routes } from './router'
import { PreloadTasks } from './tasks/preload/preload-tasks'
import { cycleTheme, DEFAULT_THEME_NAME, themeSpec } from './theme'

// const { REZI_HSR } = process.env
// const enableHsr = process.argv.includes('--hsr') || REZI_HSR === '1'

export class AppManager extends Singleton {
  public static get Instance() {
    return this.getInstance<AppManager>()
  }

  currentLanguageCode: LanguageCode = 'zh'

  public initialState: AppState = {
    needLogin: false,
    showHelp: false,
    themeName: DEFAULT_THEME_NAME,
    lastError: null,
    userinfo: null,
    preload: {
      tasks: PreloadTasks.map(t => ({
        id: t.id,
        label: t.label,
        status: 'pending',
      })),
      phase: 'loading',
      currentTaskId: null,
    },
    userPlayTrack: [],
  }

  public get Root() {
    return this.root
  }

  public init() {
  }

  private root = createNodeApp({
    initialState: this.initialState,
    config: {
      fpsCap: 120,
      screen: {
        mode: 'alt',
      },
    },
    theme: themeSpec(this.initialState.themeName).theme,
    routes,
    initialRoute: 'preload',
  })

  reduceState(state: AppState, action: AppAction): AppState {
    if (action.type === 'toggle-help')
      return { ...state, showHelp: !state.showHelp }
    if (action.type === 'cycle-language')
      return { ...state, themeName: cycleTheme(state.themeName) }
    if (action.type === 'cycle-theme')
      return { ...state, themeName: cycleTheme(state.themeName) }
    return state
  }

  updateState(updater: (s: AppState) => AppState) {
    this.root.update(updater)
  }

  async start() {
    await this.root.start()
  }

  async stop() {
    await this.root.stop()
  }

  dispose() {
    this.root.dispose()
  }

  shutdown() {
    this.stop()
    this.dispose()
  }
}
