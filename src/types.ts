import type { LogLevel, RouteRenderContext, TokenCount, WidgetContext } from '@rezi-ui/core'

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type MainScreenHandlers = Readonly<{
  onCycleTheme: () => void
  onToggleHelp: () => void
}>

export type ThemeName = 'nord' | 'dark' | 'light'

export type AppContext = WidgetContext<AppState>

export type RouterContext = RouteRenderContext<AppState>

export type LogEntrie = Readonly<{
  id: string
  timestamp: number
  level: LogLevel
  source: string
  message: string
  details?: string
  tokens?: TokenCount
  durationMs?: number
  costCents?: number
}>

export interface LogParams {
  message: string
  extra: Omit<LogEntrie, 'message'>
}

export interface UserInfo {
  id?: number
  nickname?: string
  avatarUrl?: string
}
export type TaskStatus = 'pending' | 'running' | 'done' | 'failed'

export interface TaskState {
  id: string
  label: string
  status: TaskStatus
  error?: string
}

export interface AppState {
  preload: {
    tasks: TaskState[]
    phase: 'loading' | 'done' | 'failed'
    currentTaskId: string | null
  }
  needLogin: boolean
  showHelp: boolean
  themeName: ThemeName
  lastError: string | null
  userinfo: UserInfo | null
}
