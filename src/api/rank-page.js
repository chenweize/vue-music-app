import { HOST } from "./config"
import http from "@/utils/http"

// 获取所有排行榜
export function getTopRanks() {
    const url = HOST + `/toplist/detail`
    return http({
        method: 'GET',
        url
    })
    // return http.get(url) // url, params, response
}
// 获取单个排行榜
export function getTopRank(params) {
    const url = HOST + `/top/list`
    return http({
        method: 'GET',
        url,
        params
    })
}