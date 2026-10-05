import type { RouteDefinition } from '@rezi-ui/core'
import type { AppState, RouterContext } from './types'
import { ui } from '@rezi-ui/core'
import { CommandManager } from './commend'
import { renderMainScreen } from './screens/main-screen'
import { renderPreloadScreen } from './screens/preload-screen'

type MainScreenRenderer = typeof renderMainScreen
type PreloadScreenRenderer = typeof renderPreloadScreen

export type MainScreenModule = Readonly<{
  renderMainScreen?: MainScreenRenderer
}>

export function buildPreloadView(renderer: PreloadScreenRenderer) {
  return (state: AppState, ctx: RouterContext) =>
    renderer(state, {
      onRetry() {

      },
    }, ctx)
}

export function buildMainView(renderer: MainScreenRenderer) {
  return (state: AppState, ctx: RouterContext) =>
    renderer(state, {
      onCycleTheme: () => CommandManager.Instance.dispatch({ type: 'cycle-theme' }),
      onToggleHelp: () => CommandManager.Instance.dispatch({ type: 'toggle-help' }),
    }, ctx)
}

export const routes: readonly RouteDefinition<AppState>[] = [
  {
    id: 'preload',
    title: 'Preload',
    screen: (params, ctx) => buildPreloadView(renderPreloadScreen)(ctx.state, ctx),
  },
  {
    id: 'home',
    title: 'Home',
    keybinding: 'ctrl+1',
    screen: (params, ctx) => buildMainView(renderMainScreen)(ctx.state, ctx),
  },
  {
    id: 'settings',
    title: 'Settings',
    keybinding: 'ctrl+2',
    screen: (_params, _ctx) =>
      ui.button({
        id: 'inc',
        label: 'Increment',
      }),
  },
]
