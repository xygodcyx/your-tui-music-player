import type { LoginStatus } from '../../helpers/types'
import type { AppContext } from '../../types'
import { AppManager } from '../../app'
import { ClientManager } from '../../helpers/apis'

export async function checkLoginStatus(_ctx: AppContext): Promise<LoginStatusInfo> {
  const loginStatus = await ClientManager.Instance.checkLoginStatus()
  if (loginStatus.code === 200) {
    AppManager.Instance.updateState(s => ({
      ...s,
      needLogin: false,
      userinfo: {
        id: loginStatus.id!,
        nickname: loginStatus.nickname!,
        avatarUrl: loginStatus.avatarUrl!,
      },
    }))
  }
  else {
    AppManager.Instance.updateState(s => ({
      ...s,
      needLogin: true,
    }))
  }

  return loginStatus
}
