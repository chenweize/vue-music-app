<template>
  <transition name="musicList" mode="out-in">
    <div class="music-list-container">
      <div class="music-list-info">
        <div
          class="music-list-info-background"
          :style="{ 'background-image': 'url(' + listInfo.picUrl + ')' }"
        ></div>
        <div class="music-list-info-bg-mask"></div>
        <div class="music-list-info-header">
          <i class="music-back el-icon-back" @click="onClickBack"></i>
          <div class="music-list-header-text">
            <span>{{ definedTitle }}</span>
          </div>
        </div>
        <div class="music-list-info-footer">
          <h4 class="music-list-footer-text">{{ listInfo.name }}</h4>
          <span class="music-list-footer-hot" v-if="listInfo.playCount">
            <i class="el-icon-headset"></i>
            {{ Math.floor(listInfo.playCount / 10000) }}万
          </span>
          <div class="music-list-footer-desc" v-if="listInfo.desc">
            <span>{{ '简介：' + listInfo.desc }}</span>
          </div>
        </div>
      </div>

      <scroll
        class="music-list-scroll"
        ref="playListScroll"
        @scroll="onScroll"
        :probe-type="probeType"
        :listen-scroll="listenScroll"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      >
        <div>
          <div class="play-list-header">
            <i class="play-list-icon el-icon-video-play" @click="onClickPlayAll"></i>
            <div class="play-list-header-title">
              播放全部
              <span>{{ '(共'+ musicList.length +')' }}</span>
            </div>
          </div>
          <songs-list :playList="musicList" @clickItem="clickMusicItem"></songs-list>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import Scroll from "@/common/scroll";
import SongsList from "@/common/songsList";
import { get } from "vuex-pathify";

export default {
  name: "MusicList",
  props: {
    musicListInfo: { type: Object, default: () => {} },
    definedTitle: { type: String, default: '歌单' },
    loading: { type: Boolean, default: false },
    loadMore: { type: Boolean, default: false }
  },
  components: {
    Scroll,
    SongsList
  },
  data() {
    return {
      listInfo: [],
      scrollY: 0,
      probeType: 3,
      listenScroll: true
    };
  },
  created() {},
  computed: {
    musicList: get("musicLists/musicLists"),
    mode: get("musicPlayer/mode")
  },
  watch: {
    musicListInfo: {
      immediate: true,
      handler(newVal) {
        this.listInfo = newVal;
      },
      deep: true
    },
    scrollY(newY) {
      if (this.loadMore && this.musicList.length > 49) {
        let scrollHeight = $(".music-list-scroll").outerHeight();
        let listHeight = $(".music-list-scroll div").outerHeight();
        if (listHeight - Math.abs(newY) - scrollHeight < 90) {
          this.debounce(() => {
            this.$emit('loadMoreData', this.musicList.length)
          }, 20);
        }
      } 
    }
  },
  mounted() {},
  methods: {
    onClickBack() {
      this.$router.back();
    },
    onClickPlayAll() {
      this.$store.dispatch("musicPlayer/setPlayList", this.musicList);
      // 非随机模式时播放第一首歌曲
      if (this.mode !== 2) {
        this.$store.dispatch("musicPlayer/setCurrentIndex", 0);
      }
    },
    clickMusicItem(index, song) {
      this.$store.dispatch("musicPlayer/setPlayList", song);
      this.$store.dispatch("musicPlayer/setCurrentIndex", 0)
    },
    onScroll(position) {
      this.scrollY = position.y;
    },
    // 防抖动
    debounce(fn, wait) {
      if (this.fun !== null) {
        clearTimeout(this.fun);
      }
      this.fun = setTimeout(fn, wait);
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
      bottom: -5.4vw;
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
        font-size: 5.9vw;
        color: #fff;
        margin: 2.7vw;
      }
      .music-list-header-text {
        margin: 2.7vw 0;
        color: #fff;
      }
    }
    .music-list-info-footer {
      color: #fff;
      z-index: 10;
      margin-bottom: 2.7vw;
      .music-list-footer-text {
        margin: 2.7vw 5.3vw;
      }
      .music-list-footer-hot {
        margin: 2.7vw 5.3vw;
      }
      .music-list-footer-desc {
        margin: 2.7vw 5.3vw 0 5.3vw;
        font-size: 3.4vw;
      }
    }
  }
  .music-list-scroll {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #fff; // #f2f3f4
    border-top-left-radius: 4vw;
    border-top-right-radius: 4vw;
    flex: 1;
    .play-list-header {
      display: flex;
      height: 10.7vw;
      line-height: 10.7vw;
      padding: 0 2.7vw;
      border-bottom: 1px solid #dedede;
      .play-list-icon {
        font-size: 5.9vw;
        margin: auto 0;
      }
      .play-list-header-title {
        font-size: 4.2vw;
        flex: 1;
        margin-left: 2.2vw;
        span {
          font-size: 4vw;
          color: #888;
        }
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