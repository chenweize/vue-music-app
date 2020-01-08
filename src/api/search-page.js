import { HOST } from "./config"
import http from "@/utils/https"

// 获取轮播图
export function getHot (params) {
  const url = HOST + '/search/hot'
  return http.get(url) // url, params, response
}