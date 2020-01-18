/**
 * 歌单模块
 */
import Vue from 'vue'
import { make, commit } from "vuex-pathify"
import { getMusicLists } from "@/api/main-page";
import { getHots } from "@/api/search-page";
import { getSingers, getSingerSongs } from "@/api/singer-page";
var pinyin = require("pinyin");

const state = {
    hots: [],
    musicLists: [],
    singers: [],
    fullScreen: false
}

const mutations = {
    // 创建 mutations
    ...make.mutations(state),
    SET_MUSICHOTS: (state, hots) => {
        Vue.set(state, 'hots', hots)
    },
    SET_MUSICLISTS: (state, list) => {
        Vue.set(state, 'musicLists', list)
    },
    SET_SINGERS: (state, list) => {
        // 如果数组存在, 则先对其进行排序(A-Z)
        if (list) {
            list.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            // 将 '热门歌手' 放到数组首位
            list = list.slice(-1).concat(list.slice(0, -1))
        }
        Vue.set(state, 'singers', list)
    }
}

const actions = {
    // 创建 actions
    ...make.actions(state),
    async loadHots({ state, commit }) {
        try {
            const { status, payload } = await getHots();
            if (status == 200) {
                commit('SET_MUSICHOTS', payload.result.hots)
            }
        } catch (e) {
            console.log("热门搜索获取失败: " + e);
        }
    },
    // 加载歌单
    async loadMusicList({ state, commit }, params = {}) {
        try {
            const { status, payload } = await getMusicLists(params);
            if (status === 200) {
                if (payload.playlist.tracks.length > 50) {
                    commit('SET_MUSICLISTS', payload.playlist.tracks.slice(0, 50))
                } else {
                    commit('SET_MUSICLISTS', payload.playlist.tracks)
                }
            } else {
                // 如果加载失败, 就清空仓库的歌单数据
                commit('SET_MUSICLISTS', [])
            }
        } catch (e) {
            // 如果加载失败, 就清空仓库的歌单数据
            commit('SET_MUSICLISTS', [])
            console.log("歌单加载失败: " + e);
        }
    },
    // 加载歌手(默认加载热门歌手200个)
    async loadSingerList({ state, commit }, params = { limit: 100 }) {
        try {
            const { status, payload } = await getSingers(params)
            // 整理歌手基本数据 { id, name, picUrl }
            const list = payload.artists.map(a => {
                return {
                    id: a.id,
                    name: a.name,
                    avatar: a.picUrl
                }
            })
            // 初始歌手数据
            let singers = {
                '热门': {
                    title: '热门',
                    items: payload.artists.slice(0, 10).map(a => {
                        return { id: a.id, name: a.name, avatar: a.picUrl} })
                }
            }
            // 遍历分类歌手的数据 [ { title: 'C', items: [ {...歌手基本数据}, {...}, ...] } ]
            list.forEach(l => {
                const title = pinyin(l.name[0], { style: pinyin.STYLE_FIRST_LETTER })[0][0].toUpperCase()
                if (title.match(/[A-Z]/)) {
                    if (singers[title]) {
                        singers[title]['items'].push(l)
                    } else {
                        singers[title] = {
                            title, items: [l]
                        }
                    }
                }
            });
            commit('SET_SINGERS', singers ? Object.values(singers) : [])
        } catch (e) {
            console.log('歌手加载失败: ' + e)
        }
    },
    // 加载歌手歌单
    async loadSingerSongs({ state, commit }, params = {}) {
        try {
            const { status, payload } = await getSingerSongs(params);
            if (status === 200) {
                // TODO: 数据格式暂时修改成 { id, artists, name }
                const newList = payload.hotSongs.map(item => {
                    return { id: item.id, artists: item.ar, name:item.name }
                })
                commit('SET_MUSICLISTS', newList)
            } else {
                // 如果加载失败, 就清空仓库的歌单数据
                commit('SET_MUSICLISTS', [])
            }
        } catch (e) {
            // 如果加载失败, 就清空仓库的歌单数据
            commit('SET_MUSICLISTS', [])
            console.log("首页推荐轮播图加载失败: " + e);
        }
    },
}
const getters = make.getters(state)

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

