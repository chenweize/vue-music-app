import { HOST } from "./config"
import http from "@/utils/http"

// 获取轮播图
export function getBanner () {
  const url = HOST + '/banner'
  return http({
    method: 'GET',
    url
  })
  // return http.get(url) // url, params, response
}

// 获取推荐歌单
export function getRecommendLists (params) {
  const url = HOST + `/personalized`
  return http({
    method: 'GET',
    url,
    params
  })
}

// 获取推荐歌单详情
export function getMusicLists (params) {
  const url = HOST + `/playlist/detail`
  return http({
    method: 'GET',
    url,
    params
  })
}

// 获取推荐歌曲
export function getRecommendNewSongs () {
  const url = HOST + `/personalized/newsong`
  return http({
    method: 'GET',
    url
  })
}

// 获取推荐歌曲详情
export function getSongInfo (params) {
  const url = HOST + `/song/detail`
  return http({
    method: 'GET',
    url,
    params
  })
}
