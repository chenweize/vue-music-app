<template>
  <div class="music-app-player-container" v-if="playList.length > 0">
    <transition name="normal">
      <!-- HTML5 中, PC 端基于鼠标的界面互动主要是单击(click), 移动端界面交互方式主要是触摸(touch) -->
      <!-- touchstart: 触摸开始时触发 -->
      <div class="normal-music-player" v-show="fullScreen" @touchstart.once="firstPlay">
        <div class="normal-music-player-bg">
          <div class="filter"></div>
          <img :src="currentSong.al.picUrl" width="100%" height="100%" />
        </div>

        <div class="normal-music-player-top">
          <div class="normal-music-player-back" @click="onClickDown">
            <i class="music-player-arrow-down el-icon-arrow-down"></i>
          </div>
          <h1 class="normal-music-player-title" v-html="currentSong.name"></h1>
          <h2
            class="normal-music-player-subtitle"
            v-html="currentSong.ar.map(a => { return a.name }).join('/')"
          ></h2>
        </div>

        <div class="normal-music-player-middle" @click="changeMiddle">
          <transition name="middleL">
            <div class="normal-player-middle-l" v-show="currentShow === 'cd'">
              <div class="normal-player-cd">
                <div class="cd" :class="cdTransition">
                  <img :src="currentSong.al.picUrl" class="image" />
                </div>
              </div>
            </div>
          </transition>

          <transition name="middleR">
            <scroll
              class="normal-player-middle-r"
              ref="lyricList"
              v-show="currentShow === 'lyric'"
            >
              <div class="player-middle-lyric">
                <div class="currentLyric" v-if="currentLyric">
                  <p
                    ref="lyricLine"
                    class="text"
                    v-for="(line, index) in currentLyric"
                    :key="getKey(index)"
                    :class="{ 'current': currentLineNum == index }"
                  >{{line}}</p>
                </div>
                <p class="no-lyric" v-if="currentLyric === null">暂无歌词</p>
              </div>
            </scroll>
          </transition>
        </div>

        <div class="normal-music-player-bottom">
          <div class="music-player-progress">
            <span class="player-progress-time time-l">{{formatTime(currentTime)}}</span>
            <div class="player-progress-bar">
              <progress-bar
                :percent="percent"
                @percentChangeEnd="percentChangeEnd"
                @percentChange="percentChange"
              ></progress-bar>
            </div>
            <span class="player-progress-time time-r">{{formatTime(duration)}}</span>
          </div>
          <div class="music-player-operators">
            <div class="player-operators-icon i-left">
              <i class="iconfont" :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="player-operators-icon i-left">
              <i class="el-icon-d-arrow-left" @click="prev"></i>
            </div>
            <div class="player-operators-icon i-center">
              <i class="el-icon-video-play" @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="player-operators-icon i-right">
              <i class="el-icon-d-arrow-right" @click="next"></i>
            </div>
            <div class="player-operators-icon i-right">
              <i
                class="iconfont"
                :class="getFavoriteIcon(currentSong)"
                @click="toggleFavorite(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-music-player" v-show="!fullScreen" @click="onClickMini">
        <div class="mini-player-icon">
          <img :class="cdTransition" :src="currentSong.al.picUrl" width="45" height="45">
        </div>
        <div class="mini-player-text">
          <h4 class="mini-player-name" v-html="currentSong.name"></h4>
          <div class="mini-player-desc" v-html="currentSong.ar.map(a => { return a.name }).join('/')"></div>
        </div>
        <div class="mini-player-control" @click.stop="togglePlaying">
          <progress-circle :radius="32" :percent="percent">
            <i class="iconfont mini-player-play" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="mini-player-control" @click.stop="showPlayList">
          <i class="iconfont icon-caidan"></i>
        </div>
      </div>
    </transition>
    <play-lists @stopMusic="stopMusic" ref="playLists"></play-lists>
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
import PlayLists from "./components/playList";
import { getLyric, getSong } from "@/api/player-page";
import { get, call } from "vuex-pathify";
import { playMode } from "@/utils/config";
import { shuffleList } from "@/utils/utl";
import { Toast } from 'mint-ui';

export default {
  name: "MusicPlayer",
  props: {},
  components: {
    Scroll,
    ProgressCircle,
    ProgressBar,
    PlayLists
  },
  data() {
    return {
      songReady: false,
      songUrl: "", // 播放歌曲的地址
      currentShow: "cd", // 播放器中间部分当前显示样式 'cd': 专辑图片, 'lyric': 歌词
      currentLyric: "", // 当前歌曲的歌词
      currentLineNum: 0, // 当前歌词
      currentTime: 0, // 当前时间
      currentLyricTime: [],
      duration: 0, // 歌曲时长
      percent: 0 // 播放进度
    };
  },
  created() {
    this.move = false;
    this.getUserPlayList()
  },
  computed: {
    fullScreen: get("musicPlayer/fullScreen"),
    playList: get("musicPlayer/playList"),
    mode: get("musicPlayer/mode"),
    playing: get("musicPlayer/playing"),
    currentSong: get("currentSong"),
    currentIndex: get("musicPlayer/currentIndex"),
    favoriteList: get("musicPlayer/favoriteList"),
    cdTransition() {
      return this.playing ? "play" : "play pause";
    },
    iconMode() {
      if (this.mode === playMode.sequence) {
        return "icon-xunhuanbofang";
      } else if (this.mode === playMode.loop) {
        return "icon-danquxunhuan";
      } else {
        return "icon-suijibofang";
      }
    },
    playIcon() {
      return this.playing ? "el-icon-video-pause" : "el-icon-video-play";
    },
    miniIcon () {
      return this.playing ? 'icon-iconfront-' : 'icon-icon--'
    }
  },
  watch: {
    currentSong: {
      immediate: true,
      async handler(newVal = {}, oldVal = {}) {
        await this.$nextTick();
        if (!newVal.id) {
          return;
        }
        if (newVal.id === oldVal.id) {
          return;
        }
        this.$refs.musicPlayerAudio.pause();
        this.$refs.musicPlayerAudio.currentTime = 0;
        this.getCurrentSong(newVal.id);
      },
      deep: true
    },
    songUrl(newVal) {
      // TODO: 处理付费歌词提示
      if(newVal) {
        this.loadMusicLyric(this.currentSong.id);
        this.$refs.musicPlayerAudio.src = newVal;
        let stop = setInterval(() => {
          this.duration = this.$refs.musicPlayerAudio.duration;
          if (this.duration) {
            clearInterval(stop);
          }
        }, 50);
        this.setPlayingState(true);
      } else {
        // 提示
        Toast({
          message: `这首歌为付费歌曲, 自动为您播放下一首`, // 提示信息
          duration: 3000 // 持续时间
        });
        setTimeout(()=>{this.next()}, 3000)
      }
      
    },
    currentTime(time) {
      this.percent = this.currentTime / this.duration;
      // 实时定位高亮歌词
      if(this.currentLyricTime.indexOf(parseInt(time)) > -1) {
        this.currentLineNum = this.currentLyricTime.indexOf(parseInt(time))
        // 让高亮歌词位于中间位置
        if (this.currentLineNum > 4) {
          let lineEl = this.$refs.lyricLine[this.currentLineNum - 4];
          this.$refs.lyricList.scrollToElement(lineEl, 1000);
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
      }
    }
  },
  mounted() {},
  methods: {
    setPlayingState: call("musicPlayer/setPlayStatus"),
    setPlayMode: call("musicPlayer/setPlayMode"),
    setCurrentIndex: call("musicPlayer/setCurrentIndex"),
    // 收起播放器全屏
    onClickDown() {
      this.$store.dispatch("musicPlayer/setFullScreen", false);
      this.currentShow = "cd";
    },
    // 点击迷你播放器
    onClickMini() {
      this.$store.dispatch("musicPlayer/setFullScreen", true);
    },
    // 删除最后一首的时候暂停音乐
    stopMusic () {  
      this.$refs.musicPlayerAudio.pause()
    },
    // 显示播放列表
    showPlayList () {
      this.$refs.playLists.show()
    },
    // 显示/隐藏 cd/歌词
    changeMiddle() {
      if (this.currentShow === "cd") {
        this.currentShow = "lyric";
      } else {
        this.currentShow = "cd";
      }
    },
    // 获取当前歌曲
    async getCurrentSong(id) {
      const { status, payload } = await getSong({ id });
      if (status == 200) {
        this.songUrl = payload.data[0].url;
      }
    },
    // 加载当前歌曲歌词
    async loadMusicLyric(id) {
      this.currentLyricTime = [] // 每次加载新歌词时清空上一首歌词对应时间
      try {
        const { status, payload } = await getLyric({ id });
        if (status == 200) {
          this.handleCurrentLyric(payload.lrc.lyric)
          // console.log(this.currentLyric)
          // 歌词重载以后 高亮行设置为 0
          this.currentLineNum = 0;
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
      } catch (e) {
        this.currentLyricTime = []
        this.currentLyric = null;
        this.currentLineNum = 0;
        console.error("歌词获取失败: " + e);
      }
    },
    // 处理歌词
    handleCurrentLyric(lyric) {
      const timeRegExp = /\[(\d+:\d+\.\d+)\]/;
      let array = lyric.split("\n");
      // 过滤掉空歌词
      let Lyric = array.filter(a => {
        let wordsStr = a.split(']')[1]
        if(wordsStr) return wordsStr
      })
      // 处理当前歌词
      let currentLyric = Lyric.map(a => {
        return a.split(']')[1]
      })
      this.currentLyric = currentLyric
      // 处理当前歌词时间
      let currentLyricTime = Lyric.map(a => {
        return this.handleTime(timeRegExp.exec(a)[1])
      })
      this.currentLyricTime = currentLyricTime
      this.$nextTick()
    },
    // 处理歌词时间
    handleTime(time) {
      let res = time.split(":");
      let minites = parseInt(res[0])*60;
      let seconds = parseFloat(res[1]);
      // Number()把函数对象转换为数字,toFixed(n)保留n位小数，因为toFixed(n)的使用,把time再次变为字符串，故用parseInt再转化
      // parseInt() 取整是方便提前定位歌词位置
      let resTime = parseInt(Number(minites+seconds).toFixed(2))
      return resTime
    },
    // 格式化时间
    formatTime(time = 0) {
      time = time;
      let minute = parseInt(time / 60);
      let second = parseInt(time % 60);
      if (second < 10) {
        second = "0" + second;
      }
      return minute + ":" + second;
    },
    // 播放模式进行
    percentChangeEnd(percent) {
      this.move = false;
      const currentTime = this.duration * percent;
      this.$refs.musicPlayerAudio.currentTime = currentTime;
      if (!this.playing) {
        this.$refs.musicPlayerAudio.play();
        this.setPlayingState(true);
      }
    },
    // 点击播放进度条
    percentChange(percent) {
      this.move = true;
      const currentTime = this.duration * percent;
      this.currentTime = currentTime;
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        // list = shuffle(this.sequenceList)
        list = shuffleList(this.playList);
      } else {
        // list = this.sequenceList
        list = this.playList;
      }
      // 重置当前播放序列号, 解决切换到随机播放时, 当前播放序列号为及时更新导致切歌BUG
      this.resetCurrentIndex(list);
      this.$store.commit("musicPlayer/SET_PLAYLIST", list);
    },
    // 重置当前播放序列号
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    // 点击 播放/暂停 按钮
    togglePlaying() {
      const audio = this.$refs.musicPlayerAudio;
      this.setPlayingState(!this.playing);
      this.playing ? audio.play() : audio.pause();
      // if (this.currentLyric) {
      //   this.currentLyric.togglePlay();
      // }
    },
    // 下一首
    next() {
      if (!this.songReady) {
        return;
      }
      if (this.playList.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playList.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    // 上一首
    prev() {
      if (!this.songReady) {
        return;
      }
      this.songReady = false;
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playList.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    // 点击我喜欢图标
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.$store.dispatch('musicPlayer/deleteFavorite', song).then((index) => {
          // index > -1 表示这首歌属于 我喜欢
          if (index > -1) {
            // 存放到 localStorage 中
            this.$storage.setStorageItem("my_favorite_of_music", this.favoriteList)
            Toast({
              message: `已从我喜欢列表移除`,
              duration: 1500
            });
          }
        }).catch(e => {})
      } else {
        this.$store.dispatch('musicPlayer/setFavorite', song).then((favorite) => {
          // favorite >0 表示我喜欢存储成功
          if (favorite > 0) {
            // 存放到 localStorage 中
            this.$storage.setStorageItem("my_favorite_of_music", this.favoriteList);
            Toast({
              message: `已添加到我喜欢列表`,
              duration: 1500
            });
          }
        }).catch(e => {})        
      }
    },
    // 获取我喜欢图标
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-aixin1'
      }
      return 'icon-aixin'
    },
    // 判断当前播放歌曲是否是'我喜欢'
    isFavorite (song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    firstPlay() {
      this.$refs.musicPlayerAudio.play();
    },
    end() {
      this.currentLineNum = 0
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    // 单曲循环播放
    loop() {
      this.$refs.musicPlayerAudio.currentTime = 0;
      this.$refs.musicPlayerAudio.play();
    },
    ready() {
      this.songReady = true;
      // 保存历史播放记录
      this.savePlayHistory(this.currentSong)
    },
    error() {
      this.songReady = true;
    },
    updateTime(e) {
      if (this.move) {
        return;
      }
      this.currentTime = e.target.currentTime;
    },
    // 获取历史播放记录与我喜欢, 并存储
    getUserPlayList() {
      const history = this.$storage.getStorageItem("play_history_of_music");
      const favorite = this.$storage.getStorageItem("my_favorite_of_music");
      if(history) {
        this.getUserHistory(history)
      }
      if(favorite) {
        this.getUserFavorite(favorite)
      }
    },
    // 获取本地用户历史播放记录
    getUserHistory(history = []) {
      // filter 是用来解决BUG localStorage 在没获取到对应数据是返回 false 
      // eg: [{...}, {...}, false] => [{...}, {...}]
      history = history.filter(i => { return i!==false });
      this.$store.dispatch('musicPlayer/setPlayHistory', history)
    },
    // 获取用户 "我喜欢" 列表
    getUserFavorite(favorite = []) {
      // filter 是用来解决BUG localStorage 在没获取到对应数据是返回 false 
      // eg: [{...}, {...}, false] => [{...}, {...}]
      favorite = favorite.filter(i => { return i!==false });
      this.$store.dispatch('musicPlayer/setFavorite', favorite)
    },
    // 保存播放歌曲的历史记录
    savePlayHistory(song) {
      // 存到 store 中
      this.$store.dispatch('musicPlayer/setPlayHistory', song).then((history) => {
        // 存放到 localStorage 中
        this.$storage.setStorageItem("play_history_of_music", history);
      }).catch(e => {})
    },
    // 生成独一无二的key
    getKey(item) {
      let uniqueID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      })
      return uniqueID
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
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.4s;
      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter,
    &.normal-leave-to {
      opacity: 0;
    }
    .normal-music-player-bg {
      position: absolute;
      left: -50%;
      top: -50%;
      width: 300%;
      height: 300%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(8vw);
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
      margin-bottom: 4vw;
      .normal-music-player-back {
        position: absolute;
        top: 0;
        left: 1.6vw;
        z-index: 50;
        .music-player-arrow-down {
          display: block;
          padding: 1.3vw 2.4vw;
          font-size: 8vw;
          color: #fff;
        }
      }
      .normal-music-player-title {
        width: 70%;
        margin: 0 auto;
        padding-top: 2.7vw;
        line-height: 5.4vw;
        text-align: center;
        // @include no-wrap();
        font-size: 4.8vw;
        font-weight: bold;
        color: rgb(241, 241, 241);
      }
      .normal-music-player-subtitle {
        width: 70%;
        margin: 0 auto;
        line-height: 5.4vw;
        text-align: center;
        // @include no-wrap();
        font-size: 3.5vw;
        color: rgb(241, 241, 241);
      }
    }
    .normal-music-player-middle {
      display: flex;
      align-items: center;
      position: fixed;
      width: 100%;
      top: 17.4vw;
      bottom: 45.4vw;
      white-space: nowrap;
      font-size: 0;
      .normal-player-middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        &.middleL-enter-active,
        &.middleL-leave-active {
          transition: all 0.3s;
        }
        &.middleL-enter,
        &.middleL-leave-to {
          opacity: 0;
        }
        .normal-player-cd {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 4vw solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      }

      .normal-player-middle-r {
        display: inline-block;
        position: absolute;
        top: 0;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        &.middleR-enter-active,
        &.middleR-leave-active {
          transition: all 0.2s;
        }
        &.middleR-enter,
        &.middleR-leave-to {
          opacity: 0;
        }
        .player-middle-lyric {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 10.7vw;
            color: #c7c7c7;
            font-size: 3.8vw;
            &.current {
              color: #fff;
            }
          }
          .no-lyric {
            line-height: 10.4vw;
            margin-top: 60%;
            color: #c7c7c7;
            font-size: 3.8vw;
          }
        }
      }
    }
    .normal-music-player-bottom {
      position: absolute;
      bottom: 13.4vw;
      width: 100%;
      .music-player-progress {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 2.7vw 0;
        .player-progress-time {
          color: rgb(241, 241, 241);
          font-size: 2.94vw;
          flex: 0 0 8vw;
          line-height: 8vw;
          width: 8vw;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
            color: rgb(219, 219, 219);
          }
        }
        .player-progress-bar {
          flex: 1;
        }
      }
      .music-player-operators {
        display: flex;
        align-items: center;
        .player-operators-icon {
          flex: 1;
          color: rgb(241, 241, 241);
          &.disable {
            color: rgb(212, 68, 57);
          }
          i {
            font-size: 8vw;
          }
          .mode {
            font-size: 6.67vw;
          }
          &.i-left {
            text-align: right;
          }
          &.i-center {
            padding: 0 5.4vw;
            text-align: center;
            i {
              font-size: 10.7vw;
            }
          }
          &.i-right {
            text-align: left;
          }
          .icon-like {
            color: rgb(240, 116, 107);
          }
        }
      }
    }
  }
  .mini-music-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 16vw;
    background: rgba(255, 255, 255, 0.85);
    .mini-player-icon {
      flex: 0 0 12vw;
      width: 12vw;
      padding: 0 5.4vw 0 10.7vw;
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .mini-player-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .mini-player-name {
       margin-bottom: 0.5vw;
       line-height: 4.2vw;
       font-size: 4.2vw;
       margin: 0;
       color: #2E3030;
      }
      .mini-player-desc {
        font-size: 3.5vw;
        color: #2E3030;
        margin-top: 0.8vw;
      }
    }
    .mini-player-control {
      flex: 0 0 8vw;
      width: 8vw;
      padding: 0 2.7vw;
      .icon-play-mini, .icon-pause-mini, .icon-playlist, .iconfont {
        font-size: 7.5vw;
        color: rgba(19, 19, 19, 0.6);
      }
      .iconfont {
        position: relative;
        left: -0.8vw;
        top: -0.65vw;
      }
      .icon-iconfront- {
        color: #4c4c4c;
        font-size: 5.9vw;
        position: absolute;
        left: 0.8vw;
        top: 0.65vw;
      }
      .icon-icon-- {
        color: #4c4c4c;
        font-size: 5.9vw;
        position: absolute;
        left: 1.1vw;
        top: 0.6vw;
      }
    }
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter,
    &.mini-leave-to {
      opacity: 0;
    }
  }
}
</style>