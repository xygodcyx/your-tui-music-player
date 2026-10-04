import type { VNode } from '@rezi-ui/core'
import type { AppState, MainScreenHandlers } from '../types'
import { ui } from '@rezi-ui/core'
import { PRODUCT_NAME, themeSpec } from '../theme'

export function renderHelpPopup(state: AppState, handlers: MainScreenHandlers): VNode {
  const { theme: { colors, name } } = themeSpec(state.themeName)

  return ui.modal({
    id: 'minimal-help-modal',
    title: `${PRODUCT_NAME} Help`,
    width: 62,
    returnFocusTo: 'help',
    frameStyle: {
      background: colors.bg.base,
      foreground: colors.fg.secondary,
      border: colors.border.default,
    },
    content: ui.column({ gap: 1 }, [
      ui.row({}, [
        ui.text(`Current Theme:`),
        ui.button({
          id: 'cycle-theme',
          label: `${name}`,
          onPress: handlers.onCycleTheme,
        }),
      ]),

      ui.text('q, ctrl+c : quit'),
      ui.text('q, ctrl+c : quit'),
      ui.text('?, h : toggle help'),
      ui.text('+, - : increment/decrement counter'),
      ui.text('t : cycle theme'),
      ui.text('e : trigger example error'),
    ]),
    actions: [
      ui.button({
        id: 'minimal-help-close',
        label: 'Close',
        onPress: handlers.onToggleHelp,
      }),
    ],
    onClose: handlers.onToggleHelp,
  })
}
