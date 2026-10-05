import type { VNode } from '@rezi-ui/core'
import type { AppState, RouterContext } from '../types'
import { ui } from '@rezi-ui/core'
import { stylesForTheme } from '../theme'
import { renderHelpPopup } from './help-popup'
import { LoginPanel } from './login-panel'

export type MainScreenHandlers = Readonly<{
  onCycleTheme: () => void
  onToggleHelp: () => void
}>

export function renderMainScreen(state: AppState, handlers: MainScreenHandlers, _ctx: RouterContext): VNode {
  const styles = stylesForTheme(state.themeName)
  const page = ui.page({
    p: 1,
    gap: 1,
    body: ui.column({ gap: 1 }, [
      state.showHelp && renderHelpPopup(state, handlers),
      state.needLogin && LoginPanel({}),
    ]),
    footer: ui.statusBar({
    }),
  })
  const content = ui.box({ border: 'none', p: 0, style: styles.rootStyle }, [page])
  return content
}
