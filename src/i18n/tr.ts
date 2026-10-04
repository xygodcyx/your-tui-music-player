interface TrWord {
  checkLoginStatus: string
  loadingPlayTrack: string
}

export type LanguageCode = 'zh' | 'en'

const CHINESE_TR_WORD: TrWord = {
  checkLoginStatus: '检查登录状态...',
  loadingPlayTrack: '获取歌单...',
}

const ENGLISH_TR_WORD: TrWord = {
  checkLoginStatus: 'Check Loagin State...',
  loadingPlayTrack: 'Loading Play Track...',
}

const ALL_WORD: Record<LanguageCode, TrWord> = {
  zh: CHINESE_TR_WORD,
  en: ENGLISH_TR_WORD,
}

let currentLanguageCode: LanguageCode = 'zh'
const languageCodes = ['zh', 'en']

export function cycleLanguageCode(): LanguageCode {
  const curInx = languageCodes.findIndex(l => l === currentLanguageCode)
  if (curInx === -1) {
    currentLanguageCode = 'zh'
    return currentLanguageCode
  }

  setCurrentLanguageCode(languageCodes[(curInx + 1) % languageCodes.length] as LanguageCode)

  return currentLanguageCode
}

export function setCurrentLanguageCode(code: LanguageCode): LanguageCode {
  currentLanguageCode = code
  return currentLanguageCode
}
export function getCurrentLanguageCode(): LanguageCode {
  return currentLanguageCode
}

export function tr(key: keyof TrWord) {
  return ALL_WORD[currentLanguageCode][key]
}
