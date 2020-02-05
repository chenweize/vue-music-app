/**
 * 播放器模块
 */
import Vue from 'vue'
import { make } from "vuex-pathify"
import { is } from "ramda"
import { playMode } from "@/utils/config"

const state = {
  mode: 0, // 默认 0: 顺序播放, 1: 单曲循环, 2: 随机播放
  singer: {}, // 歌手信息
  playing: false, // 播放状态
  fullScreen: false, // 全屏
  playList: [], // 播放列表
  currentIndex: -1, // 当前播放索引
  // currentSong: {}, // 当前播放歌曲
}

const mutations = {
  ...make.mutations(state),
  SET_FULLSCREEN: (state, data) => {
    state.fullScreen = data
  },
  SET_PLAYLIST: (state, data) => {
    // 利用set特性把数组的数据去重
    const newData = [...new Set(data)]
    Vue.set(state, 'playList', newData)
    // 播放列表更新完成后, 将列表第一首歌设为当前歌曲
    if (state.mode !== 2) {
      Vue.set(state, 'currentIndex', 0)
    }
  },
  SET_PLAY_STATUS: (state, flag) => {
    Vue.set(state, 'playing', flag)
  },
  SET_PLAY_MODE: (state, data) => {
    Vue.set(state, 'mode', data)
  },
  SET_CURRENT_INDEX: (state, data) => {
    Vue.set(state, 'currentIndex', data)
  },
}
const actions = {
  ...make.actions(state),
  setFullScreen({ state, commit }, data) {
    commit('SET_FULLSCREEN', data) // 设置全屏
  },
  setPlayList({ state, commit }, data) {
    // 复制当前播放列表
    let newList = Object.assign([], state.playList)
    // 如果是数组则将其跟播放列表拼接在首位
    if (Array.isArray(data)) {
      newList = data.concat(newList)
    }
    // 如果是对象就插入播放列表最后一首
    else if (is(Object, data)) {
      newList.unshift(data)
    }
    commit('SET_PLAYLIST', newList) // 提交新播放列表
    commit('SET_FULLSCREEN', true) // 设置全屏
  },
  // 修改播放状态
  setPlayStatus({ state, commit }, flag) {
    commit('SET_PLAY_STATUS', flag) // 设置播放状态
  },
  // 修改播放模式
  setPlayMode({ state, commit }, data) {
    commit('SET_PLAY_MODE', data)
  },
  // 修改当前播放序号
  setCurrentIndex({ state, commit }, data) {
    commit('SET_CURRENT_INDEX', data)
  },
  // 删除播放列表歌曲
  deletePlayListSong({ state, commit }, data) {
    // 复制当前播放列表
    let newList = Object.assign([], state.playList)
    // 删除歌曲的序号
    let index = newList.findIndex(item => {
      return item.id === data.id;
    });
    // 如果是对象则说明是删除一首歌
    if (is(Object, data)) {
      newList.splice(index, 1)
    }
    // 删除播放列表所有歌曲
    else {
      newList = []
      // 如果全部删除, 则停止播放
      commit('SET_PLAY_STATUS', false)
    }
    commit('SET_CURRENT_INDEX', index)
    commit('SET_PLAYLIST', newList) // 提交新播放列表
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

