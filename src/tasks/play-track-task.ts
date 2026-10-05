import type { LoginStatusApi } from '../helpers/apis/types'
import type { AppContext } from '../types'
import type { TaskReturn, TaskReturnMap } from './types'
import { AppManager } from '../app'
import { ClientManager } from '../helpers/apis/apis'
import { TaskId } from './types'

export async function loadPlayTrackTask(ctx: AppContext, results: TaskReturnMap): Promise<TaskReturn> {
  const userInfo = results[TaskId.CHECK_LOGIN_STATUS].data as LoginStatusApi
  const loadPlayTrack = await ClientManager.Instance.loadUserPlayTrack(userInfo.id)

  if (loadPlayTrack.code === 200) {
    AppManager.Instance.updateState(s => ({
      ...s,
    }))

    return {
      data: loadPlayTrack,
      success: true,
    }
  }
  else {
    return {
      data: null,
      success: false,
    }
  }
}
