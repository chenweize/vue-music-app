<template>
  <div class="music-app-search-container">
    <div class="music-search-box">
      <router-link tag="div" class="music-back" to="/">
        <i style="color: #fff;" class="el-icon-back"></i>
      </router-link>
      <el-input
        class="search-input"
        placeholder="请输入内容"
        v-model="searchWords"
        @blur="onBlur"
        @focus="onFocus"
      >
        <i
          v-if="searchWords"
          slot="suffix"
          style="color: #fff;"
          class="el-input__icon el-icon-circle-close"
          @click="onClickClearWords"
        ></i>
        <i
          v-else
          slot="suffix"
          style="color: #fff;"
          class="el-input__icon el-icon-search"
          @click="onClickSearchMusic"
        ></i>
      </el-input>
    </div>

    <scroll class="music-search-scroll" ref="searchScroll">
      <!-- better-scroll 只对容器内第一个div实现滚动效果 -->
      <div ref="search">
        <div class="music-search-info" v-if="!searchWords">
          <div class="search-hots" v-loading="searchHotLoading">
            <div class="search-hots-title">热门搜索</div>
            <span
              class="search-hots-item"
              v-for="(item, index) in hots"
              :key="index"
            >{{ item.first }}</span>
          </div>

          <div class="search-history">
            <div class="search-history-title">历史搜索</div>
            <div class="search-history-item">
              <i slot="suffix" class="history-item-icon el-icon-time"></i>
              <span class="history-item-title">周杰伦</span>
              <i slot="prefix" class="history-item-icon el-icon-close"></i>
            </div>
            <div class="search-history-item">
              <i slot="suffix" class="history-item-icon el-icon-time"></i>
              <span class="history-item-title">张靓颖</span>
              <i slot="prefix" class="history-item-icon el-icon-close"></i>
            </div>
            <div class="search-history-item">
              <i slot="suffix" class="history-item-icon el-icon-time"></i>
              <span class="history-item-title">林俊杰</span>
              <i slot="prefix" class="history-item-icon el-icon-close"></i>
            </div>
            <div class="search-history-item">
              <i slot="suffix" class="history-item-icon el-icon-time"></i>
              <span class="history-item-title">林俊杰</span>
              <i slot="prefix" class="history-item-icon el-icon-close"></i>
            </div>
            <div class="search-history-item">
              <i slot="suffix" class="history-item-icon el-icon-time"></i>
              <span class="history-item-title">林俊杰</span>
              <i slot="prefix" class="history-item-icon el-icon-close"></i>
            </div>
            <div class="search-history-item">
              <i slot="suffix" class="history-item-icon el-icon-time"></i>
              <span class="history-item-title">林俊杰</span>
              <i slot="prefix" class="history-item-icon el-icon-close"></i>
            </div>
            <div class="search-history-item">
              <i slot="suffix" class="history-item-icon el-icon-time"></i>
              <span class="history-item-title">林俊杰</span>
              <i slot="prefix" class="history-item-icon el-icon-close"></i>
            </div>
            <div class="search-history-item">
              <i slot="suffix" class="history-item-icon el-icon-time"></i>
              <span class="history-item-title">林俊杰</span>
              <i slot="prefix" class="history-item-icon el-icon-close"></i>
            </div>
            <div class="search-history-item">
              <i slot="suffix" class="history-item-icon el-icon-time"></i>
              <span class="history-item-title">林俊杰</span>
              <i slot="prefix" class="history-item-icon el-icon-close"></i>
            </div>
            <div class="search-history-item">
              <i slot="suffix" class="history-item-icon el-icon-time"></i>
              <span class="history-item-title">林俊杰</span>
              <i slot="prefix" class="history-item-icon el-icon-close"></i>
            </div>
            <div class="search-history-item">
              <i slot="suffix" class="history-item-icon el-icon-time"></i>
              <span class="history-item-title">林俊杰</span>
              <i slot="prefix" class="history-item-icon el-icon-close"></i>
            </div>
            <div class="search-history-item">
              <i slot="suffix" class="history-item-icon el-icon-time"></i>
              <span class="history-item-title">林俊杰</span>
              <i slot="prefix" class="history-item-icon el-icon-close"></i>
            </div>
          </div>
        </div>

        <div class="music-search-result" v-else>
          <div class="search-result-item" v-if="singers.length > 0">
            <div class="search-result-item-title">歌手</div>
            <div class="search-result-item-singer" v-for="singer in singers" :key="singer.id">
              <el-avatar
                class="result-singer-avatar"
                shape="square"
                :size="50"
                :src="singer.picUrl"
              ></el-avatar>
              <div class="result-singer-info">
                <p class="result-singer-name">{{ '歌手: ' + singer.name }}</p>
              </div>
            </div>
          </div>

          <div class="search-result-item" v-if="playlists.length > 0">
            <div class="search-result-item-title">歌单</div>
            <div class="search-result-item-playlist" v-for="list in playlists" :key="list.id">
              <el-avatar
                class="result-playlist-avatar"
                shape="square"
                :size="50"
                :src="list.coverImgUrl"
              ></el-avatar>
              <div class="result-playlist-info">
                <p class="result-playlist-name">{{ '歌单: ' + list.name }}</p>
              </div>
            </div>
          </div>

          <div class="search-result-item" v-if="songs.length > 0">
            <div class="search-result-item-title">歌曲</div>
            <div class="search-result-item-song" v-for="song in songs" :key="song.id">
              <div class="result-song-info">
                <span class="result-song-name">{{ song.name }}</span>
                <span class="result-song-atrister">{{ song.artists[0].name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/common/scroll";
import { getHots, getSearchByKeyWords, getAlbumInfo } from "@/api/search-page";
import { isNil } from "ramda";
import defaultAlbumImg from "@/assets/defualt_album.jpg";

let timer = null; // 设置计时器防抖

export default {
  name: "MusicSearchBox",
  props: {},
  components: {
    Scroll
  },
  data() {
    return {
      pullup: true,
      searchWords: "", // 搜索关键词
      cancelShow: false, // 是否显示取消字段
      hots: [], // 热门搜索
      searchHotLoading: false, // 热门搜索loading效果
      searchResultLoading: false, // 搜索结果loading效果
      avatarUrl:
        "http://p2.music.126.net/973EEWcaSOhZFWgBWzUXxg==/109951163894057459.jpg",
      singers: [],
      playlists: [],
      songs: []
    };
  },
  created() {
    this.getHotSearchInfo();
    // this.getAlbumImageUrl()
  },
  // 每次进入该页面的时候触发 activated()
  activated() {
    this.searchWords = ""; // 清空搜索内容
  },
  computed: {},
  watch: {
    async searchWords(value) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (value != "" || !isNil(value)) {
          this.getSearchResult();
        }
      }, 1500);
    }
  },
  async mounted() {
    // await this.$nextTick()
    // this.$refs.searchScroll
  },
  methods: {
    // 当点击搜索框搜索图标时
    onClickSearchMusic() {
      this.getSearchResult();
    },
    // 当点击搜索框清空图标时
    onClickClearWords() {
      this.searchWords = "";
    },
    // 当搜索框聚焦时
    onFocus() {
      this.cancelShow = true;
    },
    // 当搜索框失焦时
    onBlur() {
      this.cancelShow = false;
    },
    // 获取热门搜索
    async getHotSearchInfo() {
      try {
        const { status, payload } = await getHots();
        if (status == 200) {
          this.hots = payload.result.hots;
        }
      } catch (e) {
        console.log("热门搜索获取失败: " + e);
      }
    },
    // 获取关键词搜索结果
    async getSearchResult() {
      const params = { keywords: this.searchWords };
      try {
        const { status, payload } = await getSearchByKeyWords(params);
        if (status == 200) {
          this.singers = payload.result.artists ? payload.result.artists : [];
          this.playlists = payload.result.playlists
            ? payload.result.playlists
            : [];
          this.songs = payload.result.songs ? payload.result.songs : [];
          this.refreshScroll();
        }
      } catch (e) {
        console.log("相关搜索结果获取失败: " + e);
      }
    },
    async refreshScroll() {
      await this.$nextTick(() => {
        this.$refs.searchScroll.refresh();
      });
    },
    // 获取专辑图片
    async getAlbumImageUrl() {
      let imgUrl = defaultAlbumImg;
      try {
        const { status, payload } = await getAlbumInfo({ id: 19316 });
        if (status == 200) {
          imgUrl = payload.album.picUrl;
          console.log(img);
        }
      } catch (e) {
        console.log("专辑图片获取失败:" + e);
      }
      return img;
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.music-app-search-container {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  background-color: #ffffff; // #22d59c
  .music-search-box {
    background-color: #22d59c;
    display: flex;
    align-items: center;
    .music-back {
      font-size: 20px;
      margin: 0 10px;
    }
    .search-input {
      flex: 1;
      margin: 10px 10px 10px 0;
      .el-input__inner {
        border-radius: 40px;
        color: #ffffff;
        border: 1px solid #fff;
        background-color: #22d59c;
      }
    }
    input::-webkit-input-placeholder {
      color: #fff;
    }
    input::-moz-input-placeholder {
      color: #fff;
    }
    input::-ms-input-placeholder {
      color: #fff;
    }
  }

  .music-search-scroll {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .music-search-info {
      display: flex;
      flex-direction: column;
      width: 100%;
      // height: 100%;
      // overflow: hidden;
      .search-hots {
        .search-hots-title {
          margin: 10px;
          font-size: 16px;
          line-height: 16px;
          color: #666;
        }
        .search-hots-item {
          display: inline-block;
          border: 1px solid #e3e3e3;
          border-radius: 32px;
          height: 32px;
          margin-left: 10px;
          margin-bottom: 10px;
          padding: 0 14px;
          font-size: 14px;
          line-height: 32px;
          color: #333;
        }
      }

      .search-history {
        .search-history-title {
          margin: 10px;
          font-size: 16px;
          line-height: 16px;
          color: #666;
        }
        .search-history-item {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid #e3e3e3;
          .history-item-icon {
            margin: auto 10px;
            color: #d1d2d3;
          }
          .history-item-title {
            font-size: 15px;
            flex: 1;
          }
        }
      }
    }

    .music-search-result {
      display: flex;
      flex-direction: column;
      width: 100%;
      // position: relative;
      // top: 0;
      // bottom: 0;
      // width: 100%;
      .search-result-item {
        // display: flex;
        // flex-direction: column;
        // width: 100%;
        .search-result-item-title {
          padding-left: 20px;
          color: #22d59c;
          font-size: 14px;
          line-height: 30px;
          background-color: #f1f1f1;
        }

        .search-result-item-singer {
          display: flex;
          height: 50px;
          padding: 5px 20px;
          border-bottom: 1px solid #e3e3e3;
          .result-singer-info {
            margin-left: 15px;
            flex: 1;
            display: flex;
            height: 50px;
            overflow: hidden;
            .result-singer-name {
              margin: auto 0;
              font-size: 15px;
            }
          }
        }

        .search-result-item-playlist {
          display: flex;
          height: 50px;
          padding: 5px 20px;
          border-bottom: 1px solid #e3e3e3;
          .result-playlist-info {
            margin-left: 15px;
            flex: 1;
            display: flex;
            height: 50px;
            overflow: hidden;
            .result-playlist-name {
              margin: auto 0;
              font-size: 15px;
            }
          }
        }

        .search-result-item-song {
          display: flex;
          height: 40px;
          padding: 5px 20px;
          border-bottom: 1px solid #e3e3e3;
          .result-song-info {
            display: flex;
            flex-direction: column;
            .result-song-name {
              font-size: 16px;
              color: #2e3030;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .result-song-atrister {
              font-size: 12px;
              color: #757575;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
      /*
      .search-result-title {
        margin-left: 20px;
        color: #22d59c;
        font-size: 14px;
        line-height: 35px;
      }
      .search-result-item {
        display: flex;
        height: 100%;
        padding: 5px 20px;
        border-bottom: 1px solid #e3e3e3;
        // justify-content: flex-start;
        .result-item-avatar {
        }
        .singer-item-info {
          margin-left: 15px;
          .singer-item-name {
            line-height: 50px;
            font-size: 15px;
          }
        }

        .playlists-item-info {
          margin-left: 15px;
          display: flex;
          height: 50px;
          overflow: hidden;
          flex: 1;
          box-sizing: border-box;
          flex-direction: column;
          justify-content: space-around;
          .playlists-item-name {
            font-size: 15px;
          }
          .playlists-item-atrister {
            font-size: 14px;
            color: #e3e3e3;
          }
        }

        .songs-item-info {
          display: flex;
          flex-direction: column;
          .songs-item-name {
            font-size: 16px;
            color: #2e3030;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .songs-item-atrister {
            font-size: 12px;
            color: #757575;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      */
    }
  }
}
</style>