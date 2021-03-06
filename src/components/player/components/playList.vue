<template>
  <transition name="playList-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="iconfont" :class="iconMode" @click="changeMode"></i>
            <span class="text">
              {{ modeText }}
              <span class="count">{{ '(' + playList.length + ')' }}</span>
            </span>
            <i class="clear-icon el-icon-delete" @click="showConfirm"></i>
          </h1>
        </div>
        <scroll
          ref="listContent"
          class="list-content"
          :data="playList"
          :refreshDelay="refreshDelay"
        >
          <transition-group name="list" tag="div">
            <div
              class="item"
              ref="playListItem"
              @click="selectItem(item, index)"
              v-for="(item, index) in playList"
              :key="getKey(item)"
            >
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text" :style="{ color: getCurrentText(item) }">
                  {{ item.name + ' - ' + item.ar.map(a => { return a.name }).join('/') }}
              </span>
              <span class="delete" @click.stop="deletOne(item, index)">
                <i class="delete-icon el-icon-close"></i>
              </span>
            </div>
          </transition-group>
        </scroll>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from "@/common/scroll";
import { get, call } from "vuex-pathify";
import { playMode } from "@/utils/config";
import { shuffleList } from "@/utils/utl";
import { MessageBox } from "mint-ui";

export default {
  name: "PlayList",
  components: {
    Scroll
  },
  data() {
    return {
      showFlag: false,
      refreshDelay: 100
    };
  },
  computed: {
    playList: get("musicPlayer/playList"),
    mode: get("musicPlayer/mode"),
    playing: get("musicPlayer/playing"),
    currentSong: get("currentSong"),
    currentIndex: get("musicPlayer/currentIndex"),
    modeText() {
      return this.mode === playMode.sequence ? "顺序播放" : this.mode === playMode.random ? "随机播放" : "单曲循环";
    },
    iconMode() {
      if (this.mode === playMode.sequence) {
        return "icon-xunhuanbofang";
      } else if (this.mode === playMode.loop) {
        return "icon-danquxunhuan";
      } else {
        return "icon-suijibofang";
      }
    }
  },
  methods: {
    setPlayMode: call("musicPlayer/setPlayMode"),
    setCurrentIndex: call("musicPlayer/setCurrentIndex"),
    deletePlayListSong: call("musicPlayer/deletePlayListSong"),
    showConfirm() {
      MessageBox.confirm("是否清空当前播放列表?").then(() => {
        this.confirmClear();
      }).catch(() => {});
    },
    // 确认清空播放列表
    confirmClear() {
      this.deletePlayListSong("all");
      this.hide();
      this.$emit("stopMusic");
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return "el-icon-headset";
      }
      return "";
    },
    getCurrentText(item) {
      return this.currentSong.id === item.id ? "#22d59c" : "unset";
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        // 找到需要播放的歌曲在播放顺序里面的索引
        index = this.playList.findIndex(song => {
          return song.id === item.id;
        });
      }
      this.setCurrentIndex(index);
    },
    // 修改播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffleList(this.playList);
      } else {
        list = this.playList;
      }
      this.resetCurrentIndex(list);
      this.$store.commit("musicPlayer/SET_PLAYLIST", list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        // 返回 index
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    // 删除播放列表一首歌曲
    deletOne(item) {
      this.deletePlayListSong(item);
      if (!this.playList.length) {
        this.hide();
        this.$emit("stopMusic");
      }
    },
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    // 定位到当前播放歌曲位置
    scrollToCurrent(current) {
      const index = this.playList.findIndex(song => {
        return current.id === song.id;
      });
      let songEl = $('.item').eq(index)[0];
      this.$refs.listContent.scrollToElement(songEl, 300);
    },
    // 生成独一无二的key
    getKey(item) {
      let uniqueID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      })
      return uniqueID
    }
  }
};
</script>

<style lang="scss">
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.3);
  &.playList-fade-enter-active,
  &.playList-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.playList-fade-enter,
  &.playList-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-radius: 2.1vw;
    background-color: #f2f3f4; // background
    .list-header {
      position: relative;
      padding: 0 8vw 0 5.4vw;
      .title {
        display: flex;
        align-items: center;
        .iconfont {
          margin-right: 2.7vw;
          font-size: 5.4vw;
          color: #fde7e7;
        }
        .text {
          flex: 1;
          font-size: 3.8vw;
          color: #2e3030;
          .count {
            position: relative;
            top: 1px;
          }
        }
        .clear-icon {
          font-size: 3.8vw;
          color: #757575;
        }
      }
    }
    .list-content {
      max-height: 64vw;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 10.7vw;
        padding: 0 8vw 0 5.4vw;
        overflow: hidden;
        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.1s;
        }
        &.list-enter,
        &.list-leave-to {
          height: 0;
        }
        .current {
          color: #22d59c;
          margin-right: 1.3vw;
        }
        .text {
          flex: 1;
          // @include no-wrap();
          line-height: 5.4vw;
          font-size: 3.8vw;
          color: #2e3030;
        }
        .delete {
          // @include extend-click();
          font-size: 2.9vw;
          color: rgb(212, 68, 57);
        }
      }
    }
    .list-close {
      text-align: center;
      line-height: 13.3vw;
      background: #f2f3f4; // background
      font-size: 3.8vw;
      color: #2e3030;
    }
  }
}
</style>
