import { loadImage } from '@rezi-ui/node'
import got from 'got'
import sharp from 'sharp'

export interface ImageInfo {
  bytes: Uint8Array<ArrayBufferLike>
  width: number
  height: number
}

const CACHE_IMAGE: Record<string, ImageInfo> = {}

export async function imageToRgba(path: string): Promise<ImageInfo> {
  if (CACHE_IMAGE[path]) {
    return CACHE_IMAGE[path]
  }

  let buffer
  if (path.startsWith('http') || path.startsWith('https')) {
    buffer = await got(path).buffer()
  }
  else {
    buffer = loadImage(path)
  }
  const { data, info } = await sharp(buffer)
    .toColorspace('srgb')
    .resize({
      width: 256 / 2,
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const imageResult = {
    bytes: data,
    width: info.width,
    height: info.height,
  }

  CACHE_IMAGE[path] = imageResult
  return imageResult
}

export async function pngBase64ToRgba(base64Data: string) {
  const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '')
  // eslint-disable-next-line node/prefer-global/buffer
  const pngBuffer = Buffer.from(base64, 'base64')

  const { data, info } = await sharp(pngBuffer)
    .toColorspace('srgb')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  return {
    bytes: data,
    width: info.width,
    height: info.height,
  }
}

export async function sleep(ms: number) {
  return new Promise(resove => setTimeout(resove, ms))
}

export function moreErrorDetail<T extends Error>(error: T, depth: number = 1) {
  return error.stack.split('\n').slice(2, 2 + depth).toString().trim()
}
