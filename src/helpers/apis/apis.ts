import type { RequestBaseConfig } from '@neteasecloudmusicapienhanced/api'
import type { LoginStatusApi, PlayTrackList, PlayTrackListApi } from './types'
import { existsSync, mkdir, readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import api from '@neteasecloudmusicapienhanced/api'
import { validateScenarioDefinition } from '@rezi-ui/core/testing'
import { Singleton } from '../../base/singleton'
import { LogDebug } from '../../log'

interface AppAuthData {
  cookie: string
}

const AUTH_PATH = 'auth'
const AUTH_FILE = 'session.json'

export class ClientManager extends Singleton {
  constructor() {
    super()
  }

  public static get Instance(): ClientManager {
    return this.getInstance<ClientManager>()
  }

  private appPath: string = ''

  private baseConfig: RequestBaseConfig = {
    randomCNIP: true,
    cookie: '',
  }

  private appAuthData: AppAuthData = {
    cookie: '',
  }

  private ensureAppPath() {
    this.appPath = path.join(os.homedir(), '.config', 'your-music-player')
    mkdir(this.appPath, { recursive: true }, () => {})
  }

  private initAuth() {
    const authDirPath = path.join(this.appPath, AUTH_PATH)
    mkdir(authDirPath, { recursive: true }, () => {})
    const authFilePath = path.join(authDirPath, AUTH_FILE)
    if (!existsSync(authFilePath)) {
      writeFileSync(authFilePath, JSON.stringify(this.appAuthData), {
        encoding: 'utf8',
      })
      return
    }

    const authJsonStr = readFileSync(authFilePath, { encoding: 'utf8' }).trim()
    if (!authJsonStr.startsWith('{')) {
      LogDebug(`${authFilePath} is not json`)
      return
    }

    try {
      const authJson = JSON.parse(authJsonStr)
      this.appAuthData = authJson
      this.baseConfig.cookie = this.appAuthData.cookie
    }
    catch {
      throw new Error('Json Parse Failed')
    }
  }

  public setCookie(cookie: string) {
    this.appAuthData.cookie = cookie
    this.baseConfig.cookie = cookie
  }

  public saveAuth() {
    const authDirPath = path.join(this.appPath, AUTH_PATH)
    mkdir(authDirPath, { recursive: true }, () => {})
    const authFilePath = path.join(authDirPath, AUTH_FILE)
    writeFileSync(authFilePath, JSON.stringify(this.appAuthData))
  }

  init() {
    this.ensureAppPath()
    this.initAuth()
  }

  async createQr(): Promise<{ unikey: string, qrurl: string, qrimg: string }> {
    const { body: { data: { unikey } } }: any = await api.login_qr_key(this.baseConfig)
    const { body } = await api.login_qr_create({ ...this.baseConfig, key: unikey, qrimg: true })
    const data = body.data as { qrimg: string, qrurl: string }
    const { qrurl, qrimg } = data

    return {
      unikey,
      qrurl,
      qrimg,
    }
  }

  async checkQr(qrkey: string): Promise<{ code: number, message: string, cookie: string }> {
    const res = await api.login_qr_check({ ...this.baseConfig, key: qrkey })
    const body = res.body as { code: number, message: string, cookie: string }
    const { code, message, cookie } = body

    return {
      code,
      message,
      cookie,
    }
  }

  async checkLoginStatus(): Promise<LoginStatusApi> {
    const { body }: api.Response = await api.login_status(this.baseConfig)
    const data = body.data as { code: number, account: { id: number }, profile: { nickname: string, avatarUrl: string } }

    let code = data.code

    if (!data.account) {
      code = -1
    }

    const id = data.account?.id ?? null
    const nickname = data.profile?.nickname ?? null
    const avatarUrl = data.profile?.avatarUrl ?? null
    return {
      code,
      id,
      nickname,
      avatarUrl,
    }
  }

  async loadUserPlayTrack(uid: number): Promise<PlayTrackListApi> {
    const { body } = await api.user_playlist({
      uid,
      offset: 0,
      limit: 0,
      ...this.baseConfig,
    })

    let code = body.code

    LogDebug(body.playlist === null)

    if (!body.playlist) {
      code = -1
    }

    const temp = (body.playlist ?? []) as PlayTrackList

    const playlist: PlayTrackList = temp.map(v => ({
      id: v.id,
      name: v.name,
      coverImgUrl: v.coverImgUrl,
      nickname: v.nickname,
    }))

    return {
      code,
      playlist,
    }
  }
}
