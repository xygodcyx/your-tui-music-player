import type { AppContext } from '../types'

export const TaskId = {
  CHECK_LOGIN_STATUS: 'CHECK_LOGIN_STATUS',
  LOAD_PLAY_TRACK: 'LOAD_PLAY_TRACK',
} as const

export type TaskIdEnum = keyof typeof TaskId

export interface TaskReturn { data: unknown, success: boolean }

export type TaskReturnMap = Record<TaskIdEnum, TaskReturn>

export type TaskCaller = (ctx: AppContext, results?: TaskReturnMap) => Promise<TaskReturn>

export interface PreloadTask {
  id: TaskIdEnum
  label: string
  run: TaskCaller
  deps?: TaskIdEnum[]
}
