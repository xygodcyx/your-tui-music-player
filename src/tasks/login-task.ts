import type { AppContext } from '../types'
import type { TaskReturn } from './types'
import { AppManager } from '../app'
import { ClientManager } from '../helpers/apis/apis'

export async function checkLoginStatus(_ctx: AppContext): Promise<TaskReturn> {
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

    return {
      data: loginStatus,
      success: true,
    }
  }
  else {
    AppManager.Instance.updateState(s => ({
      ...s,
      needLogin: true,
    }))

    return {
      data: null,
      success: false,
    }
  }
}
