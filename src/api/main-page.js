import { HOST } from "./config"
import http from "@/utils/https"

// 获取轮播图
export function getBanner (params) {
  const url = HOST + '/banner'
  return http.get(url) // url, params, response
}