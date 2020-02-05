<template>
  <div class="songs-list-container">
    <div class="songs-list-item" v-for="(item, index) in playList" :key="item.id" @click="onClickListItem(index, item)">
      <div class="songs-list-item-no">{{ index + 1 }}</div>
      <div class="songs-list-item-info">
        <div class="songs-list-item-name">{{ item.name }}</div>
        <div
          class="songs-list-item-artists"
        >{{ item.ar ? item.ar.map(i => {return i.name}).join('/'):item.artists.map(i => {return i.name}).join('/') }}</div>
      </div>
      <div class="songs-list-item-icon el-icon-video-play"></div>
    </div>
    <!-- 解决当迷你播放器出现时, 最底下的歌曲被遮挡BUG -->
    <div class="songs-list-bottom" v-if="playLists.length&&!fullScreen">
      
    </div>
  </div>
</template>

<script>
import { get } from "vuex-pathify";

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
      return {}
  },
  computed: {
    playLists: get("musicPlayer/playList"),
    fullScreen: get("musicPlayer/fullScreen")
  },
  methods: {
    onClickListItem(index, item) {
      this.$emit("clickItem", index, item)
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
  }
}
</style>