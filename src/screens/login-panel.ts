import type { AppState } from '../types'
import { defineWidget, ui, useAsync } from '@rezi-ui/core'
import { ClientManager } from '../helpers/apis/apis'
import { pngBase64ToRgba } from '../helpers/utils'
import { checkLoginStatus } from '../tasks/login-task'
import { StatefulPanel } from '../widgets/stateful-panel'

const QrCheck = defineWidget<{ key?: string, qrkey: string }, AppState>((props, ctx) => {
  const [tick, setTick] = ctx.useState(0)
  const [message, setMessage] = ctx.useState('')
  const { data, loading, error } = useAsync(ctx, async () => ClientManager.Instance.checkQr(props.qrkey), [tick])

  ctx.useEffect(() => {
    const timer = setTimeout(() => setTick(t => t + 1), 1000)
    return () => clearTimeout(timer)
  }, [tick])

  ctx.useEffect(async () => {
    if (data && data.code === 803) {
      ClientManager.Instance.setCookie(data.cookie)
      ClientManager.Instance.saveAuth()
      await checkLoginStatus(ctx)
    }
  }, [data?.code])

  if (loading || !data) {
    return ui.text(message)
  }

  if (error) {
    return ui.errorDisplay((error as Error).message)
  }

  setMessage(data.message)

  if (data.code === 800) {
    return ui.text('qr is can\'t used')
  }

  return ui.text(message)
})

export const LoginPanel = defineWidget((_props, ctx) => {
  const { data: info, loading, error } = useAsync(ctx, async () => {
    const { qrimg, unikey } = await ClientManager.Instance.createQr()
    const info = await pngBase64ToRgba(qrimg)
    return {
      ...info,
      unikey,
    }
  }, [])

  if (!info) {
    return ui.spacer()
  }

  return StatefulPanel({
    loading,
    error,
    children: ui.center(
      ui.column({}, [
        QrCheck({ qrkey: info.unikey }),
        ui.image({
          src: info.bytes,
          width: 30,
          height: 15,
          sourceWidth: info.width,
          sourceHeight: info.height,
        }),
      ]),

    ),
  })
})
