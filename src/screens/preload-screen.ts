import type { VNode } from '@rezi-ui/core'
import type { AppState, RouterContext } from '../types'
import { defineWidget, ui } from '@rezi-ui/core'
import { runPreload } from '../tasks/preload/preload-tasks'
import { PRODUCT_NAME } from '../theme'

export type PreloadScreenHandlers = Readonly<{
  onRetry: () => void
}>

const preloadLayer = defineWidget<{ key?: string, routerCtx: RouterContext }, AppState>((props, ctx) => {
  const preload = ctx.useAppState(s => s.preload)
  ctx.useEffect(() => {
    runPreload(ctx)
  }, [])

  ctx.useEffect(() => {
    if (preload.phase === 'done') {
      props.routerCtx.router.navigate('home')
    }
  }, [preload.phase])

  const currentTask = preload.currentTaskId && preload.tasks.find(t => t.id === preload.currentTaskId)!

  return ui.column(
    { gap: 1 },
    [
      ui.text(PRODUCT_NAME, {
        variant: 'heading',
        style: {
          bold: true,
        },
      }),
      ui.divider(),
      ui.text(`${preload.phase}`),
      ui.row({ gap: 1 }, [
        currentTask ? ui.text(`Cur Task : ${currentTask.label}`) : null,
        currentTask
          ? currentTask.error
            ? ui.text(`Error :${currentTask.error}`, {
                wrap: true,
              })
            : null
          : null,
      ]),
      // ui.progress(0.42, {
      //   style: { fg: rgb(80, 220, 120) },
      //   trackStyle: { fg: rgb(80, 80, 80) },
      // }),
    ],
  )
})

export function renderPreloadScreen(state: AppState, handler: PreloadScreenHandlers, ctx: RouterContext): VNode {
  return ui.layers([
    preloadLayer({ routerCtx: ctx }),
  ])
}
