import { defineWidget, ui, useAsync, when } from '@rezi-ui/core'
import { imageToRgba } from '../helpers/utils'

interface ImageCardProps {
  pathOrBuffer: string
  key?: string
}

export const ImageCard = defineWidget<ImageCardProps>((props, ctx) => {
  const { data: rgbaInfo, loading, error } = useAsync(ctx, () => imageToRgba(props.pathOrBuffer), [props.pathOrBuffer])

  try {
    const imageWidget = when(loading, () => ui.spinner({ label: 'Loading profile...' }))
      ?? when(error as any, () => ui.errorDisplay(`Failed to load image ${error}`))
      ?? when(!rgbaInfo, () => ui.errorDisplay('No rgba'))
      ?? ui.image({
        src: rgbaInfo!.bytes,
        protocol: 'auto',
        width: 20,
        height: 10,
        sourceWidth: rgbaInfo!.width,
        sourceHeight: rgbaInfo!.height,
        fit: 'cover',
      })
    return imageWidget
  }
  catch (error: unknown) {
    return ui.errorDisplay(`Failed to load image ${(error as Error).message}`)
  }
})
