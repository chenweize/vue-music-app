import { HOST } from "./config"
import http from "@/utils/http"

// 获取所有歌手信息
export function getSingers(params) {
    const url = HOST + `/top/artists`
    return http({
        method: 'GET',
        url,
        params
    })
}

// 获取歌手简介信息
export function getSingerInfo(params) {
    const url = HOST + `/artist/desc`
    return http({
        method: 'GET',
        url,
        params
    })
}

// 获取歌手单曲
export function getSingerSongs(params) {
    const url = HOST + `/artists`
    return http({
        method: 'GET',
        url,
        params
    })
}