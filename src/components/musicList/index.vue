<template>
  <transition name="musicList" mode="out-in">
    <div class="music-list-container">
      <div class="music-list-info">
        <div
          class="music-list-info-background"
          :style="{ 'background-image': 'url(' + musicListInfo.picUrl + ')' }"
        ></div>
        <div class="music-list-info-bg-mask"></div>
        <div class="music-list-info-header">
          <i class="music-back el-icon-back" @click="onClickBack"></i>
          <div class="music-list-header-text">
            <span>歌单</span>
          </div>
        </div>
        <div class="music-list-info-footer">
          <h4 class="music-list-footer-text">{{ musicListInfo.name }}</h4>
          <span class="music-list-footer-hot">
            <i class="el-icon-headset"></i>
            {{ Math.floor(musicListInfo.playCount / 10000) }}万
          </span>
        </div>
      </div>

      <scroll class="music-list-scroll" ref="playListScroll">
        <div>
          <div class="play-list-header">
            <i class="play-list-icon el-icon-video-play"></i>
            <span class="play-list-header-title">{{ '播放全部(共'+ playList.length +')' }}</span>
          </div>
          <div></div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import Scroll from "@/common/scroll";
import { get } from "vuex-pathify";

export default {
  name: "MusicList",
  props: {
    musicListInfo: { type: Object, default: () => {} }
  },
  components: {
    Scroll
  },
  data() {
    return {};
  },
  created() {},
  computed: {
    playList: get("musicLists/musicLists")
  },
  watch: {
    // playList: {
    //   immediate: true,
    //   handler(newVal) {
    //     $('.music-list-info-background').css({'background-image': 'url'(playList.coverImgUrl)})
    //   }
    // }
  },
  mounted() {},
  methods: {
    onClickBack() {
      this.$router.back();
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.music-list-container {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  background-color: #ffffff; // #22d59c
  .music-list-info {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 35%;
    .music-list-info-background {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: -20px;
      z-index: -1;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50%;
    }
    .music-list-info-bg-mask {
      z-index: 2;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      opacity: 0.2;
      background: #000;
    }
    .music-list-info-header {
      display: flex;
      z-index: 10;
      .music-back {
        font-size: 22px;
        color: #fff;
        margin: 10px;
      }
      .music-list-header-text {
        margin: 10px 0;
        color: #fff;
      }
    }
    .music-list-info-footer {
      color: #fff;
      z-index: 10;
      margin-bottom: 10px;
      .music-list-footer-text {
        margin: 10px 20px;
      }
      .music-list-footer-hot {
        margin: 10px 20px;
      }
    }
  }
  .music-list-scroll {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #f2f3f4;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    flex: 1;
    .play-list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      border-bottom: 1px solid #dedede;
      .play-list-icon {
        font-size: 22px;
      }
      .play-list-header-title {
        font-size: 16px;
      }
    }
  }
}

// 进入页面动画效果
.musicList-enter-active,
.musicList-leave-active {
  transition: all 0.2s;
}
.musicList-enter,
.musicList-leave-to {
  transform: translate3d(30%, 0, 0);
  opacity: 0;
}
</style>