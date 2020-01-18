<template>
  <div class="music-app-player-container" v-show="playlist.length > 0">
    <transition name="normal">
      <div class="normal-music-player" v-show="fullScreen" @touchstart.once="firstPlay">
        <div class="normal-music-player-bg">
          <div class="filter"></div>
          <img :src="currentSong.image" width="100%" height="100%" />
        </div>

        <div class="normal-music-player-top">
          <div class="normal-music-player-back" @click="back">
            <i class="music-player-arrow-down el-icon-arrow-down"></i>
          </div>
          <h1 class="normal-music-player-title" v-html="currentSong.name"></h1>
          <h2 class="normal-music-player-subtitle" v-html="currentSong.singer"></h2>
        </div>
      </div>
    </transition>
    <transition name="mini"></transition>
    <audio
      id="music-player-audio"
      ref="musicPlayerAudio"
      autoplay
      @ended="end"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script>
import Scroll from "@/common/scroll";
import ProgressCircle from "./components/progressCricle";
import ProgressBar from "./components/progressBar";
import Lyric from "lyric-parser";
import { get } from "vuex-pathify";

export default {
  name: "MusicPlayer",
  props: {},
  components: {
    Scroll,
    ProgressCircle,
    ProgressBar
  },
  data() {
    return {};
  },
  created() {},
  computed: {
    fullScreen: get("musicList/fullScreen"),
    currentSong: get("musicList/currentSong")
  },
  watch: {
    // currentSong(newVal, oldVal) {
    //   if (!newVal.id) {
    //     return;
    //   }
    //   if (newVal.id === oldVal.id) {
    //     return;
    //   }
    //   this.$refs.musicPlayerAudio.pause();
    //   this.$refs.musicPlayerAudio.currentTime = 0;
    //   this._getSong(newVal.id);
    // }
  },
  mounted() {},
  methods: {
    firstPlay() {
      console.log("firstPlay");
      // this.$refs.musicPlayerAudio.play()
    },
    end() {
      console.log("end");
    },
    ready() {
      console.log("ready");
    },
    error() {
      console.log("error");
    },
    updateTime() {
      console.log("updateTime");
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.music-app-player-container {
  .normal-music-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    background: #f2f3f4;
    .normal-music-player-bg {
      position: absolute;
      left: -50%;
      top: -50%;
      width: 300%;
      height: 300%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(30px);
      .filter {
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.6;
      }
    }
    .normal-music-player-top {
      position: relative;
      margin-bottom: 25px;
      .normal-music-player-back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .music-player-arrow-down {
          display: block;
          padding: 5px 9px;
          font-size: 35px;
          // color: $color-theme-l;
        }
      }
      .normal-music-player-title {
        width: 70%;
        margin: 0 auto;
        padding-top: 10px;
        line-height: 20px;
        text-align: center;
        // @include no-wrap();
        font-size: 18px;
        font-weight: bold;
        color: rgb(241, 241, 241);
      }
      .normal-music-player-subtitle {
        width: 70%;
        margin: 0 auto;
        line-height: 20px;
        text-align: center;
        // @include no-wrap();
        font-size: 12px;
        color: rgb(241, 241, 241);
      }
    }
  }
}
</style>