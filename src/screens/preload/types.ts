import type { AppContext } from '../../types'

export type PreloadScreenHandlers = Readonly<{
  onRetry: () => void
}>

export interface PreloadTask {
  id: string
  label: string
  run: (ctx: AppContext) => Promise<unknown>
}
