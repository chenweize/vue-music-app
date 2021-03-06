<template>
  <div class="music-app-singer-container">
    <scroll
      ref="singerScroll"
      class="music-singer-scroll"
      :listenScroll="listenScroll"
      :probeType="probeType"
      @scroll="onScroll"
    >
      <div class="music-singer-group">
        <div
          class="music-singer-list"
          v-for="singer in singers"
          :key="singer.title + parseInt(Math.random(0,1)*100000).toString()"
          ref="singerListGroup"
        >
          <div class="music-singer-list-title">{{ singer.title }}</div>
          <div class="music-singer-item" v-for="item in singer.items" :key="item.id + parseInt(Math.random(0,1)*100000).toString()" @click="onClickSinger(item)">
            <img class="music-singer-item-avatar" v-lazy.container="item.avatar" />
            <div class="music-singer-item-info">
              <span class="music-singer-item-name">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="music-singer-shortcut" @touchstart="onShortcutStart" @touchmove.stop.prevent="onShortcutMove">
        <div
          class="music-singer-shortcut-item"
          v-for="(item, index) in shortcutList"
          :key="item.id + parseInt(Math.random(0,1)*100000).toString()"
          :data-index="index"
          :class="{'current': currentIndex === index}"
        >{{ item }}</div>
      </div>
    </scroll>
    <router-view :musicListInfo="singerInfo" :loading="loading" :definedTitle="title"></router-view>
  </div>
</template>

<script>
import Scroll from "@/common/scroll";
import { get } from "vuex-pathify";
import { getData } from "@/utils/dom";
import { getSingerInfo } from "@/api/singer-page";

const ANCHOR_HEIGHT = 20;

export default {
  name: "MusicSinger",
  components: {
    Scroll
  },
  data() {
    return {
      singerInfo: {}, // 歌手基本信息
      loading: false,
      title: '热门歌曲',
      listenScroll: true, // 滚动条相关参数
      probeType: 3, // 滚动条相关参数
      touch: {}, // 滚动条相关参数
      listHeight: [], // 滚动条相关参数
      scrollY: -1, // 滚动条相关参数
      currentIndex: 0 // 当前所处位置
    };
  },
  created() {
    this.loadAllSingers();
  },
  computed: {
    singers: get("musicLists/singers"),
    // 处理右侧快速定位栏
    shortcutList() {
      return this.singers.map(item => {
        return item.title.substr(0, 1);
      });
    }
  },
  watch: {
    singers() {
      setTimeout(() => {
        // 初始化计算Scroll高度
        this.calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      // 向下滑动的时候 newVal 是一个负数，所以当 newVal > 0 时，currentIndex 直接为 0
      const listHeight = this.listHeight;
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 计算 currentIndex 的值
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          return;
        }
      }
      // 当超 -newVal > 最后一个高度的时候
      // 因为 this.listHeight 有头尾，所以需要 - 2
      this.currentIndex = listHeight.length - 2;
    }
  },
  methods: {
    // 获取所有歌手(默认热度前100名)
    async loadAllSingers() {
      await this.$store.dispatch("musicLists/loadSingerList");
    },
    // 刷新滚动条
    refresh() {
      this.$refs.singerScroll.refresh();
    },
    // 实时监听滚动条高度变化
    onScroll(pos) {
      this.scrollY = pos.y;
    },
    onShortcutStart(e) {
      // 获取到绑定的 index
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];
      // 记录一下点击时候的 Y坐标 和 index
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this.onScrollTo(anchorIndex);
    },
    onShortcutMove(e) {
      // 再记录一下移动时候的 Y坐标，然后计算出移动了几个索引
      let firshTouch = e.touches[0];
      this.touch.y2 = firshTouch.pageY;
      // ANCHOR_HEIGHT 是索引元素的高度
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      // 计算最后的位置
      // * 1 是因为 this.touch.anchorIndex 是字符串，用 * 1 偷懒的转化一下
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this.onScrollTo(anchorIndex);
    },
    onScrollTo(index) {
      // 处理边界情况
      // 因为 index 通过滑动距离计算出来的
      // 所以向上滑超过索引框框的时候就会 < 0，向上就会超过最大值
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      // listHeight 是正的， 所以加个 -
      this.scrollY = -this.listHeight[index];
      // 使用 better-scroll 的 scrollToElement 方法实现跳转
      this.$refs.singerScroll.scrollToElement(
        this.$refs.singerListGroup[index],
        0
      );
    },
    calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.singerListGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    // 点击歌手事件
    async onClickSinger(singer) {
      this.loading = true
      try {
        // 获取歌手简介
        const { status, payload } = await getSingerInfo({ id: singer.id })
        if (status === 200) {
          // 处理歌手基本信息
          this.singerInfo = Object.assign({}, 
            singer, 
            {
              desc: payload.briefDesc.split('。')[0],
              picUrl: singer.avatar
            }
          )
        }
      } catch (e) {
        console.error('歌手详情获取失败: ' + e)
      }
      // 调用歌曲加载方法
      this.loadSingerSongs(singer.id)
    },
    // 加载歌手歌曲
    async loadSingerSongs(id) {
      this.$router.push({ path: `/singer/${id}` }); // 跳转至歌单详情界面
      await this.$store.dispatch("musicLists/loadSingerSongs", { id }); // await 等待函数执行完成
      this.loading = false
    }
  }
};
</script>

<style lang="scss">
.music-app-singer-container {
  position: fixed;
  width: 100%;
  bottom: 0;
  top: 18.2vw;
  .music-singer-scroll {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .music-singer-group {
      position: relative;
      width: 100%;
      .music-singer-list {
        display: flex;
        flex-direction: column;
        width: 100%;
        .music-singer-list-title {
          padding-left: 2.25vw;
          color: #22d59c;
          font-size: 3.8vw;
          height: 8vw;
          line-height: 8vw;
          background-color: #f1f1f1;
        }
        .music-singer-item {
          display: flex;
          flex-direction: row;
          padding: 0.75vw 2.25vw;
          border-bottom: 1px solid #e3e3e3;
          .music-singer-item-avatar {
            width: 20vw;
            height: 20vw;
            border-radius: 1.4vw;
          }
          .music-singer-item-info {
            margin-left: 4vw;
            flex: 1;
            display: flex;
            overflow: hidden;
            .music-singer-item-name {
              margin: auto 0;
              font-size: 4vw;
            }
          }
        }
      }
    }

    .music-singer-shortcut {
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 7vw;
      padding: 3.5vw 0;
      border-radius: 2.8vw;
      text-align: center;
      background: rgba(241, 241, 241, 0.5);
      font-family: Helvetica;
      .music-singer-shortcut-item {
        padding: 0.8vw;
        line-height: 1;
        color: black;
        font-size: 4.2vw;
        &.current {
          color: #22d59c;
          // font-weight: bold;
        }
      }
    }
  }
}
</style>