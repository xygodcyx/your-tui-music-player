import type { AppContext } from '../../types'
import type { PreloadTask } from './types'
import { AppManager } from '../../app'
import { tr } from '../../i18n/tr'
import { checkLoginStatus } from '../tasks/login-task'
import { loadPlayTrackTask } from '../tasks/play-track-task'

export const PreloadTasks: PreloadTask[] = [
  {
    id: 'check-login-status',
    label: tr('checkLoginStatus'),
    run: checkLoginStatus,
  },
  {
    id: 'loading-play-track',
    label: tr('loadingPlayTrack'),
    run: loadPlayTrackTask,
  },
]

export async function runPreload(ctx: AppContext) {
  // init task list

  const state = ctx.useAppState(s => s)
  const tasks = state.preload.tasks

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
      await PreloadTasks.find(t => t.id === task.id)!.run(ctx)

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
