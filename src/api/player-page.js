import { HOST } from "./config"
import http from "@/utils/http"

// 获取歌词
export function getLyric(params) {
  const url = HOST + `/lyric`
  // const url = 'http://localhost:3000/lyric'
  return http({
    method: 'GET',
    url,
    params
  })
}
// 获取歌词
export function getSong(params) {
  const url = HOST + `/song/url`
  return http({
    method: 'GET',
    url,
    params
  })
}