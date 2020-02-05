<template>
  <transition name="userMusicList">
    <div class="music-app-user-container">
      <div class="music-user-top">
        <i class="music-back el-icon-back" @click="() => { this.$router.back() }"></i>
        <div class="music-user-top-switch">
          <p class="user-switch-favorite" @click="onClickFavorite">我的收藏</p>
          <p class="user-switch-recent" @click="onClickRecent">最近播放</p>
        </div>
      </div>

      <div class="music-user-player">
        <i class="play-action-icon el-icon-video-play"></i>
        <div class="music-user-player-title">
          播放全部
          <span>(共{{0}}首)</span>
        </div>
      </div>

      <div class="music-user-playlist">
        <scroll ref="favoriteList" class="user-musiclist-scroll" v-if="switchIndex">
          <div>
            <songs-list :playList="playList"></songs-list>
          </div>
        </scroll>
        <scroll ref="recentList" class="user-musiclist-scroll" v-else>
          <div>
            <songs-list :playList="playList"></songs-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-container" v-show="noResult">
        <div class="no-result-message">
          <i class="no-result-icon el-icon-headset"></i>
          <span>去寻找最触动你心灵的声音吧~</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from "@/common/scroll";
import SongsList from "@/common/songsList";
import { get } from "vuex-pathify"

export default {
  name: "MusicUser",
  components: {
    Scroll,
    SongsList
  },
  data() {
    return {
      switchIndex: 0, // 选择默认 0 (近期播放), 1 为我的收藏
      noResult: false
    };
  },
  created() {},
  computed: {
    playList: get("musicLists/musicLists")
  },
  watch: {
    switchIndex: {
      immediate: true, // 解决 watch 数据第一次不更新BUG
      async handler(newVal) {
        await this.$nextTick(); // 等待当前 dom 全部加载完成再进行以下操作
        if (newVal) {
          $(".user-switch-favorite").addClass("checked");
          $(".user-switch-recent").removeClass("checked");
        } else {
          $(".user-switch-favorite").removeClass("checked");
          $(".user-switch-recent").addClass("checked");
        }
      }
    }
  },
  methods: {
    onClickFavorite() {
      this.switchIndex = 1;
    },
    onClickRecent() {
      this.switchIndex = 0;
    }
  }
};
</script>

<style lang="scss">
.music-app-user-container {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  background-color: #ffffff; // #22d59c
  .music-user-top {
    background-color: #22d59c;
    display: flex;
    align-items: center;
    .music-back {
      font-size: 20px;
      color: #fff;
      margin: 0 10px;
    }
    .music-user-top-switch {
      margin: 6px auto;
      border: 1px solid #fff;
      display: flex;
      justify-content: center;
      padding: 5px 25px;
      border-radius: 42px;
      .user-switch-favorite {
        margin: 0;
        font-size: 15px;
        color: #e9e9e9;
        border-right: 1px solid;
        padding-right: 7px;
      }
      .user-switch-recent {
        margin: 0;
        font-size: 15px;
        color: #e9e9e9;
        border-left: 1px solid;
        padding-left: 7px;
      }
      .checked {
        color: #fff;
      }
    }
  }
  .music-user-player {
    position: absolute;
    top: 44px;
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    border-bottom: 1px solid #e1e1e1;
    .play-action-icon {
      font-size: 20px;
      margin: auto 0;
    }
    .music-user-player-title {
      margin-left: 10px;
      font-size: 16px;
      flex: 1;
      span {
        font-size: 15px;
        color: #888;
      }
    }
  }
  .user-musiclist-scroll {
    position: absolute;
    top: 84px;
    width: 100%;
    bottom: 0;
    overflow: hidden;
    
  }
  .no-result-container {
    position: absolute;
    top: 84px;
    width: 100%;
    bottom: 0;
    .no-result-message {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      text-align: center;
      justify-content: center;
      width: 100%;
      .no-result-icon {
        font-size: 50px;
        color: #dbdbdb;
      }
      span {
        font-size: 15px;
        color: #2e3030;
      }
    }
  }
}
</style>