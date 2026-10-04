import type { LoginStatusInfo } from '../../helpers/types'
import type { AppContext } from '../../types'
import { AppManager } from '../../app'
import { ClientManager } from '../../helpers/apis'

export async function loadPlayTrackTask(_ctx: AppContext): Promise<void> {
  const loginStatus = await ClientManager.Instance.loadUserPlayTrack()

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
