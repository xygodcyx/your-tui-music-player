import type { AppContext } from '../../types'
import type { PreloadTask, TaskReturnMap } from '../types'
import { AppManager } from '../../app'
import { tr } from '../../i18n/tr'
import { checkLoginStatus } from '../login-task'
import { loadPlayTrackTask } from '../play-track-task'
import { TaskId } from '../types'

export const PreloadTasks: PreloadTask[] = [
  {
    id: TaskId.CHECK_LOGIN_STATUS,
    label: tr('checkLoginStatus'),
    run: checkLoginStatus,
  },
  {
    id: TaskId.LOAD_PLAY_TRACK,
    label: tr('loadingPlayTrack'),
    deps: [TaskId.CHECK_LOGIN_STATUS],
    run: loadPlayTrackTask,
  },
]

export async function runPreload(ctx: AppContext) {
  // init task list

  const state = ctx.useAppState(s => s)
  const tasks = state.preload.tasks

  const taskRunResultMap: TaskReturnMap = {
    CHECK_LOGIN_STATUS: undefined,
    LOAD_PLAY_TRACK: undefined,
  }

  // set all status to pending
  AppManager.Instance.updateState(s =>
    ({
      ...s,
      preload: {
        ...s.preload,
        tasks: tasks.map(t => ({ ...t, status: 'pending' })),
        phase: 'loading',
      },
    }),
  )

  for (const task of tasks) {
    // set current status to running
    AppManager.Instance.updateState(s => (
      {
        ...s,
        preload: {
          ...s.preload,
          currentTaskId: task.id,
          tasks: tasks.map(t => ({ ...t, status: t.id === task.id ? 'running' : t.status })),
        },
      }
    ))

    try {
      const curRun = PreloadTasks.find(t => t.id === task.id)!

      if (curRun.deps) {
        for (const dep of curRun.deps) {
          if (!taskRunResultMap[dep]) {
            // dep break
            return
          }
        }
      }
      const result = await curRun.run(ctx, taskRunResultMap)
      taskRunResultMap[task.id] = result

      AppManager.Instance.updateState(s => (
        {
          ...s,
          preload: {
            ...s.preload,
            tasks: tasks.map(t => ({ ...t, status: t.id === task.id ? 'done' : t.status })),
          },
        }
      ))
    }
    catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      AppManager.Instance.updateState(s => (
        {
          ...s,
          preload: {
            ...s.preload,
            phase: 'failed',
            tasks: tasks.map(t => ({ ...t, status: t.id === task.id ? 'failed' : t.status, error: message })),
          },
        }
      ))
      return
    }
  }

  AppManager.Instance.updateState(s => (
    {
      ...s,
      preload: {
        ...s.preload,
        phase: 'done',
        currentTaskId: null,
      },
    }
  ))
}
