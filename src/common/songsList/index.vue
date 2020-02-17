<template>
  <div class="songs-list-container">
    <div class="songs-list-item" v-for="(item, index) in playList" :key="getKey(item.id)" @click="onClickListItem(index, item)">
      <div class="songs-list-item-no">{{ index + 1 }}</div>
      <div class="songs-list-item-info">
        <div class="songs-list-item-name">{{ item.name }}</div>
        <div class="songs-list-item-artists">
          {{ item.ar ? item.ar.map(i => {return i.name}).join('/') : item.artists.map(i => {return i.name}).join('/') }}
        </div>
      </div>
      <div class="songs-list-item-icon el-icon-video-play"></div>
    </div>
    <!-- 解决当迷你播放器出现时, 最底下的歌曲被遮挡BUG -->
    <div class="songs-list-bottom" v-if="showBottom">
      ~~ 我是有底线的 ~~
    </div>
  </div>
</template>

<script>
import { getKey } from "@/utils/utl"

export default {
  name: "SongsList",
  props: {
      // 歌曲列表
    playList: {
      type: Array,
      default: () => []
    }
  },
  data() {
      return {
        showBottom: false
      }
  },
  computed: {},
  watch: {
    // 根据列表长度判断是否展示底部提示
    playList: {
      immediate: true,
      async handler(newVal) {
        await this.$nextTick() // 等待DOM更新完成再执行下面操作
        // list 高度
        let containerHight = $('.songs-list-container').outerHeight()
        // scroll 高度
        let scrollHight = $($($('.songs-list-container').parent()[0]).parent()[0]).outerHeight()
        scrollHight > containerHight ? this.showBottom = false : this.showBottom = true
      },
      deep: true
    }
  },
  methods: {
    onClickListItem(index, item) {
      this.$emit("clickItem", index, item)
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
.songs-list-container {
//   position: relative;
//   height: 100%;
//   width: 100%;
  .songs-list-item {
    display: flex;
    width: 100%;
    .songs-list-item-no {
      width: 40px;
      font-size: 17px;
      color: #999;
      margin: auto 0;
      text-align: center;
    }
    .songs-list-item-info {
      padding: 6px 0;
      flex: 1;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      .songs-list-item-name {
        font-size: 17px;
        white-space: nowrap;
        word-break: normal;
      }
      .songs-list-item-artists {
        font-size: 13px;
        color: #888;
        margin-top: 3px;
        white-space: nowrap;
        word-break: normal;
      }
    }
    .songs-list-item-icon {
      color: #999;
      margin: auto 20px;
      font-size: 22px;
    }
  }
  .songs-list-bottom {
    position: relative;
    width: 100%;
    height: 60px;
    text-align: center;
    line-height: 60px;
    color: #969696;
  }
}
</style>