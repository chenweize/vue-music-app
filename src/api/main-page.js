import { HOST } from "./config"
import http from "@/utils/http"

// 获取轮播图
export function getBanner (params, response) {
  const url = HOST + '/banner'
  return http.get(url) // url, params, response
}