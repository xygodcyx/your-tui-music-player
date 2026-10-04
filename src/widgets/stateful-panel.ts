import type { VNode } from '@rezi-ui/core'
import { defineWidget, ui, when } from '@rezi-ui/core'

interface StatefulPanelProps {
  key?: string
  loading: boolean
  error: unknown
  // data: unknown
  children: VNode
  loadingStyle?: 'dots' | 'line' | 'circle' | 'bounce' | 'pulse' | 'arrows' | 'dots2'
  loadingMessage?: string
  errorMessage?: string
  // noDataMessage?: string
}

export const StatefulPanel = defineWidget<StatefulPanelProps>((props) => {
  const key = props.key ?? ''
  const { loading, error, loadingStyle = 'dots', loadingMessage = 'loading ...', errorMessage = `Some Error(${key})` } = props

  try {
    return when(loading, () => ui.spinner({ label: loadingMessage, variant: loadingStyle }))
      ?? when(error as any, () => ui.errorDisplay(`${errorMessage}${error}`))
      ?? props.children
  }
  catch (error: unknown) {
    return ui.errorDisplay(`Failed :${(error as Error).message}`)
  }
})
