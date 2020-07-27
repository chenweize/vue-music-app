/**
 * 播放器模块
 */
import Vue from 'vue'
import { make } from "vuex-pathify"
import { is, indexOf, uniq } from "ramda"
import { playMode } from "@/utils/config"

const state = {
  mode: 0, // 默认 0: 顺序播放, 1: 单曲循环, 2: 随机播放
  singer: {}, // 歌手信息
  playing: false, // 播放状态
  fullScreen: false, // 全屏
  playList: [], // 播放列表
  currentIndex: -1, // 当前播放索引
  playHistory: [], // 历史播放记录
  favoriteList: [] // 我喜欢歌单
  // currentSong: {}, // 当前播放歌曲
}

const mutations = {
  ...make.mutations(state),
  SET_FULLSCREEN: (state, data) => {
    state.fullScreen = data
  },
  SET_PLAYLIST: (state, data) => {
    // 利用 uniq 把数组的数据去重
    const newData = uniq(data)
    Vue.set(state, 'playList', newData)
    // 播放列表更新完成后, 将列表第一首歌设为当前歌曲
    // if (state.mode !== 2) {
    //   Vue.set(state, 'currentIndex', 0)
    // }
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
  SET_PLAY_HISTORY: (state, data) => {
    Vue.set(state, 'playHistory', data)
  },
  SET_MY_FAVORITE: (state, data) => {
    Vue.set(state, 'favoriteList', data)
  }
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
      // newList = data.concat(newList)
      newList = data
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
      // 若删除的是当前播放歌曲之前的歌曲, 把当前播放序号 -1
      // 若删除的是当前播放歌曲之后的歌曲, 就不改变前播放序号
      if (index < state.currentIndex) {
        index = state.currentIndex - 1
      }
      if (index > state.currentIndex) {
        index = state.currentIndex
      }
    }
    // 删除播放列表所有歌曲
    else {
      newList = []
      // 如果全部删除, 则停止播放
      commit('SET_PLAY_STATUS', false)
    }
    commit('SET_CURRENT_INDEX', index)
    commit('SET_PLAYLIST', newList) // 提交新播放列表
  },
  // 存储历史播放歌曲
  setPlayHistory({ state, commit }, data) {
    let history = Object.assign([], state.playHistory)
    if (!Array.isArray(data)) {
      let index = indexOf(data, history)
      // index 大于 -1 说明当前播放歌曲存在历史播放中, 则将这首歌放在历史播放记录首位
      // 如果等于 -1 说明当前播放歌曲不存在历史播放中, 则插入历史播放记录首位，并删除最后一首
      if (index > -1) {
        history.splice(index, 1) // 删除 1个 下标从 index 开始的元素
        history.unshift(data) // 将这首歌插入历史播放记录首位
      } else {
        // 如果近期播放歌曲超过50首, 删除最后一首
        if(history.length > 49) {
          history.splice(49, 1)
        }
        // history.splice(history.length - 1, 1)
        history.unshift(data)
      }
    } else {
      // 解决初次加载为数组时插入会出现BUG
      history = data
    }
    commit('SET_PLAY_HISTORY', history)
    return history ? history : []
  },
  // 存储我喜欢歌曲
  setFavorite({ state, commit }, data) {
    // 复制 store 的我喜欢列表
    let favorite = Object.assign([], state.favoriteList)
    // 判断这首歌曲是否是一个数组
    // 该判断是为了解决一个我已经忘了的BUG
    if (!Array.isArray(data)) {
      favorite.unshift(data)
    } else {
      favorite = data
    }
    commit('SET_MY_FAVORITE', favorite)
    return favorite ? favorite.length : 0
  },
  // 删除我喜欢的歌曲
  deleteFavorite({ state, commit }, data) {
    // 复制 store 的我喜欢列表
    let favorite = Object.assign([], state.favoriteList)
    // 寻找删除歌曲的序列号
    let index = favorite.findIndex(item => {
      return item.id === data.id;
    });
    // 移除该歌曲的序列号
    favorite.splice(index, 1)
    commit('SET_MY_FAVORITE', favorite)
    return index
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

