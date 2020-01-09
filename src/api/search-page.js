import { HOST } from "./config"
import http from "@/utils/http"

// 获取热门搜索
export function getHots () {
  const url = HOST + '/search/hot'
  // return http.get(url) // url, params, response
  return http({
    method: 'GET',
    url
  })
}

// 获取关键词搜索结果
export function getSearchByKeyWords (params = {}) {
  const url = HOST + '/search/suggest'
  return http({
    method: 'GET',
    url,
    params
  })
}
// 获取关键词搜索结果
export function getAlbumInfo (params = {}) {
  const url = HOST + '/album'
  return http({
    method: 'GET',
    url,
    params
  })
}