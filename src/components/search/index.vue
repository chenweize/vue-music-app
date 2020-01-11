<template>
<transition name="searchMusic">
  <div class="music-app-search-container">
    <div class="music-search-box">
      <!-- <router-link tag="div" class="music-back" to="/"> -->
      <i style="color: #fff;" class="music-back el-icon-back" @click="onClickBack"></i>
      <!-- </router-link> -->
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
          <div
            class="search-hots"
            v-loading="searchHotLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
          >
            <div class="search-hots-title">热门搜索</div>
            <span
              class="search-hots-item"
              v-for="(item, index) in hots"
              :key="index"
            >{{ item.first }}</span>
          </div>

          <div class="search-history">
            <div class="search-history-title">
              <span>历史搜索</span>
              <i style="float: right;" class="el-icon-delete" @click="onClearSearchRerords()"></i>
            </div>
            <div
              class="search-history-item"
              v-for="(item, index) of searchRecords"
              :key="index"
              @click="onClearSearchRerords(item)"
            >
              <i slot="suffix" class="history-item-icon el-icon-time"></i>
              <span class="history-item-title">{{ item }}</span>
              <i slot="prefix" class="history-item-icon el-icon-close"></i>
            </div>
          </div>
        </div>

        <div
          class="music-search-result"
          v-else
          v-loading="searchResultLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
        >
          <div class="search-result-item" v-if="singers.length > 0">
            <div class="search-result-item-title">歌手</div>
            <div
              class="search-result-item-singer"
              v-for="singer in singers"
              :key="singer.id"
              @click="onClickSearchItem(singer)"
            >
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
            <div
              class="search-result-item-playlist"
              v-for="list in playlists"
              :key="list.id"
              @click="onClickSearchItem(list)"
            >
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
            <div
              class="search-result-item-song"
              v-for="song in songs"
              :key="song.id"
              @click="onClickSearchItem(song)"
            >
              <div class="result-song-info">
                <span class="result-song-name">{{ song.name }}</span>
                <span class="result-song-atrister">{{ song.artists[0].name }}</span>
              </div>
            </div>
          </div>

          <div class="search-result-item error-search">
            <span v-if="isNullResult">暂时没找到相关搜索结果</span>
            <span v-if="isErrResult">搜索异常, 请稍后重试</span>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</transition>
</template>

<script>
import Scroll from "@/common/scroll";
import { getHots, getSearchByKeyWords, getAlbumInfo } from "@/api/search-page";
import { isNil, isEmpty } from "ramda";
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
      singers: [],
      playlists: [],
      songs: [],
      isNullResult: false, // 搜索结果是否为空
      isErrResult: false, // 搜索过程是否出错
      searchRecords: [] // 搜索记录
    };
  },
  created() {
    this.getHotSearchInfo();
    // 获取当前浏览器本地 localStorage 的历史记录
    let searchHistory = this.$storage.getStorageItem("search_history_of_music");
    this.searchRecords = searchHistory ? searchHistory : [];
  },
  // 每次进入该页面的时候触发 activated()
  activated() {
    this.searchWords = ""; // 清空搜索内容
  },
  computed: {},
  watch: {
    async searchWords(value) {
      this.searchResultLoading = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (value == "" || isNil(value)) {
          this.searchResultLoading = false;
        } else {
          this.getSearchResult();
        }
      }, 1500);
    }
  },
  mounted() {},
  methods: {
    // 返回首页
    onClickBack() {
      // this.$router.push("/");
      if (this.searchWords) {
        this.searchWords = "";
      } else {
        this.$router.back();
      }
    },
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
      this.searchHotLoading = true;
      try {
        const { status, payload } = await getHots();
        if (status == 200) {
          this.hots = payload.result.hots;
        }
        this.searchHotLoading = false;
      } catch (e) {
        this.searchHotLoading = false;
        console.log("热门搜索获取失败: " + e);
      }
    },
    // 获取关键词搜索结果
    async getSearchResult() {
      const params = { keywords: this.searchWords };
      this.isNullResult = false // 重置搜索结果是否为空
      this.isErrResult = false // 重置是否搜索过程出错
      try {
        const { status, payload } = await getSearchByKeyWords(params);
        if (status == 200) {
          this.singers = payload.result.artists ? payload.result.artists : [];
          this.playlists = payload.result.playlists ? payload.result.playlists : [];
          this.songs = payload.result.songs ? payload.result.songs : [];
          // 搜索结果为空时处理
          if (isEmpty(payload.result)) {
            this.isNullResult = true
          }
          // 动态更新滚动条高度
          this.refreshScroll();
        }
        this.searchResultLoading = false;
      } catch (e) {
        this.isErrResult = true;
        this.searchResultLoading = false;
        console.log("相关搜索结果获取失败: " + e);
      }
    },
    async refreshScroll() {
      await this.$nextTick(() => {
        this.$refs.searchScroll.refresh();
      });
    },
    // 点击搜索结果
    onClickSearchItem(item) {
      // 将搜索关键词存进搜索记录中
      if (this.searchRecords.indexOf(this.searchWords) == -1) {
        this.searchRecords.unshift(this.searchWords);
        this.$storage.setStorageItem("search_history_of_music", this.searchRecords);
      }
    },
    // 删除搜索历史记录
    onClearSearchRerords(item = "") {
      // 如果存在item, 即说明是点击删除单个记录
      if (item) {
        this.searchRecords = this.searchRecords.filter(record => record != item)
        this.$storage.setStorageItem("search_history_of_music",this.searchRecords);
      } else {
        // 删除所有记录
        this.searchRecords = []
        this.$storage.removeStorageItem("search_history_of_music")
      }
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
  bottom: 0;
  display: flex;
  flex-direction: column;
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
      // flex: 1;
      margin: 10px 10px 10px 0;
      .el-input__inner {
        height: 30px;
        line-height: 30px;
        border-radius: 30px;
        font-size: 13px;
        border: 1px solid #fff;
        background-color: #22d59c;
      }
      .el-input__icon {
        line-height: 30px;
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
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .music-search-info {
      display: flex;
      flex-direction: column;
      width: 100%;
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
          border-radius: 26px;
          height: 26px;
          margin-left: 6px;
          margin-bottom: 6px;
          padding: 0 14px;
          font-size: 13px;
          line-height: 26px;
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
      .error-search {
        position: relative;
        width: 100%;
        height: 100%;
        margin-top: 70%;
        text-align: center;
      }
      .search-result-item {
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
    }
  }
}
.searchMusic-enter-active, .searchMusic-leave-active {
  transition: all 0.3s;
}
.searchMusic-enter, .searchMusic-leave-to {
  transform: translate3d(50%, 0, 0);
  opacity: 0;
}
</style>