/**
 * 歌单模块
 */
import Vue from 'vue'
import { make, commit } from "vuex-pathify"
import { getMusicLists } from "@/api/main-page";
import { getHots } from "@/api/search-page";

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
                    commit('SET_MUSICLISTS', payload.result.tracks.slice(0, 50) )
                } else {
                    commit('SET_MUSICLISTS',  payload.result.tracks )
                }
            } else {
                // 如果加载失败, 就清空仓库的歌单数据
                commit('SET_MUSICLISTS', [] )
            }
        } catch (e) {
            // 如果加载失败, 就清空仓库的歌单数据
            commit('SET_MUSICLISTS', [] )
            console.log("首页推荐轮播图加载失败: " + e);
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

