import { HOST } from "./config"
import http from "@/utils/http"

// 获取所有排行榜
export function getSingers(params) {
    const url = HOST + `/top/artists`
    return http({
        method: 'GET',
        url,
        params
    })
}