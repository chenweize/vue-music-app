import { HOST } from "./config"
import http from "@/utils/http"

// 获取轮播图
export function getBanner (params) {
  const url = HOST + '/banner'
  return http({
    method: 'GET',
    url
  })
  // return http.get(url) // url, params, response
}