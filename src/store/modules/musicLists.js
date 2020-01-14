/**
 * 歌单模块
 */
import Vue from 'vue'
import { make, commit } from "vuex-pathify"
import { getMusicLists } from "@/api/main-page";
import { getHots } from "@/api/search-page";
import { getSingers } from "@/api/singer-page"

const state = {
    hots: [],
    musicLists: []
}

const mutations = {
    // 创建 mutations
    ...make.mutations(state),
    SET_MUSICHOTS: (state, hots) => {
        Vue.set(state, 'hots', hots)
    },
    SET_MUSICLISTS: (state, list) => {
        Vue.set(state, 'musicLists', list)
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
                if (payload.result.tracks.length > 50) {
                    commit('SET_MUSICLISTS', payload.result.tracks.slice(0, 50))
                } else {
                    commit('SET_MUSICLISTS', payload.result.tracks)
                }
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
    // 加载歌手(默认加载热门歌手200个)
    async loadSingerList({ state, commit }, params = { limit: 100 }) {
        try {
            const { status, payload } = await getSingers(params)
            console.log(payload)
            // {
            //     title: 'C',
            //         items: [
            //             {
            //                 id: 2116,
            //                 name: '陈奕迅',
            //                 avatar:
            //                     'http://p4.music.126.net/_d1scu7z_1dmd0Zgv9mTLA==/19165587183900212.jpg'
            //             },
            //             {
            //                 id: 89365,
            //                 name: 'Coldplay',
            //                 avatar:
            //                     'http://p4.music.126.net/eL-ft_ucUcby648eVnNewA==/19162288649094558.jpg'
            //             },
            //             {
            //                 id: 1007170,
            //                 name: '陈粒',
            //                 avatar:
            //                     'http://p3.music.126.net/Q92YwJrk2f2tsK-7B0VIhQ==/6628955605123612.jpg'
            //             }
            //         ]
            // }
        } catch (e) {
            console.log('歌手加载失败: ' + e)
        }
    }
}
const getters = make.getters(state)

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

