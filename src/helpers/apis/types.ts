// code is not api code, it mean has data

// login status
export interface LoginStatusApi {
  code: number
  id?: number
  nickname?: string
  avatarUrl?: string
}

// play track list
// not just user track list, all track list
export type PlayTrackList = {
  id: number
  name: string
  coverImgUrl: string
  nickname: string
}[]

export interface PlayTrackListApi {
  code: number
  playlist: PlayTrackList
}
