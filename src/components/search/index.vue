<template>
  <transition name="searchMusic">
    <div class="music-app-search-container">
      <div class="music-search-box">
        <!-- <router-link tag="div" class="music-back" to="/"> -->
        <i class="music-back el-icon-back" @click="onClickBack"></i>
        <!-- </router-link> -->
        <el-input class="search-input" ref="searchInput" placeholder="请输入内容" v-model="searchWords">
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
            <div class="search-hots">
              <div class="search-hots-title">热门搜索</div>
              <span
                class="search-hots-item"
                v-for="(item, index) in hots"
                :key="index + parseInt(Math.random(0,1)*100000)"
                @click="onClickHotItem(item.first)"
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
                :key="index + parseInt(Math.random(0,1) * 1000000)"
                @click="onClickSearchRerords(item)"
              >
                <i slot="suffix" class="history-item-icon el-icon-time"></i>
                <span class="history-item-title">{{ item }}</span>
                <i
                  slot="prefix"
                  class="history-item-icon el-icon-close"
                  @click="onClearSearchRerords(item)"
                ></i>
              </div>
            </div>
          </div>

          <div
            class="music-search-result"
            v-else
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
          >
            <div class="search-result-item" v-if="singers.length > 0">
              <div class="search-result-item-title">歌手</div>
              <div
                class="search-result-item-singer"
                v-for="singer in singers"
                :key="singer.id + parseInt(Math.random(0,1)*100000)"
                @click="onClickSearchSingers(singer)"
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
                :key="list.id + parseInt(Math.random(0,1)*100000)"
                @click="onClickSearchList(list)"
              >
                <el-avatar
                  class="result-playlist-avatar"
                  shape="square"
                  :size="50"
                  :src="list.artist.picUrl"
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
                :key="song.id + parseInt(Math.random(0,1)*100000)"
                @click="onClickSearchSongs(song)"
              >
                <div class="result-song-info">
                  <span class="result-song-name">{{ song.name }}</span>
                  <span class="result-song-atrister">{{ song.artists[0].name }}</span>
                </div>
              </div>
            </div>
            <!-- 用来解决迷你播放器挡住最后一个搜索结果 -->
            <div class="search-result-item-bottom" v-if="playlists.length&&singers.length&&songs.length"></div>

            <div v-if="isNullResult || isErrResult" class="search-result-item error-search">
              <span v-if="isNullResult">暂时没找到相关搜索结果</span>
              <span v-if="isErrResult">搜索异常, 请稍后重试</span>
            </div>
          </div>
        </div>
      </scroll>
      <router-view :musicListInfo="musicListInfo" :loading="musicListLoading"></router-view>
    </div>
  </transition>
</template>

<script>
import Scroll from "@/common/scroll";
import { getSearchByKeyWords } from "@/api/search-page";
import { getSongInfo } from "@/api/main-page";
import { getSingerInfo } from "@/api/singer-page";
import { isNil, isEmpty } from "ramda";
import { get } from "vuex-pathify";
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
      loading: false, // 搜索结果loading效果
      singers: [],
      playlists: [],
      songs: [],
      musicListInfo: {}, // 歌单内容
      musicListLoading: false, // 歌单loading效果
      singerInfo: {}, // 歌手个人信息
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
    this.$refs.searchInput.focus(); // 将输入框设为聚焦状态
  },
  computed: {
    hots: get("musicLists/hots") // 热门搜索
  },
  watch: {
    async searchWords(value) {
      this.loading = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (value == "" || isNil(value)) {
          this.loading = false;
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
    // 获取热门搜索
    async getHotSearchInfo() {
      this.$store.dispatch("musicLists/loadHots");
    },
    // 点击搜索记录
    onClickSearchRerords(item) {
      this.searchWords = item;
    },
    // 点击热门搜索
    onClickHotItem(hot) {
      this.searchWords = hot
    },
    // 获取关键词搜索结果
    async getSearchResult() {
      const params = { keywords: this.searchWords };
      this.isNullResult = false; // 重置搜索结果是否为空
      this.isErrResult = false; // 重置是否搜索过程出错
      try {
        const { status, payload } = await getSearchByKeyWords(params);
        if (status == 200) {
          this.singers = payload.result.artists ? payload.result.artists : [];
          this.playlists = payload.result.albums
            ? payload.result.albums
            : [];
          this.songs = payload.result.songs ? payload.result.songs : [];
          // 搜索结果为空时处理
          if (isEmpty(payload.result)) {
            this.isNullResult = true;
          }
          // 动态更新滚动条高度
          this.refreshScroll();
        }
        this.loading = false;
      } catch (e) {
        this.isErrResult = true;
        this.loading = false;
        console.error("相关搜索结果获取失败: " + e);
      }
    },
    async refreshScroll() {
      await this.$nextTick(() => {
        this.$refs.searchScroll.refresh();
      });
    },
    // 存储历史记录
    setHistoryRecord() {
      if (this.searchRecords.indexOf(this.searchWords) == -1) {
        this.searchRecords.unshift(this.searchWords);
        this.$storage.setStorageItem(
          "search_history_of_music",
          this.searchRecords
        );
      }
    },
    // 点击歌手搜索结果
    async onClickSearchSingers(item) {
      this.setHistoryRecord(); // 存储历史记录
      this.musicListLoading = true; // 给歌单添加加载效果
      // 点击的歌单详情
      this.loadSingerInfo(item)
      this.$router.push({ path: `/search/${item.id}` }); // 跳转至歌单详情界面
      await this.$store.dispatch("musicLists/loadSingerSongs", { id: item.id }); // await 等待函数执行完成
      this.musicListLoading = false; // 无论函数执行成功或失败, 都显示loading状态
    },
    // 点击歌单搜索结果
    async onClickSearchList(item) {
      this.setHistoryRecord(); // 存储历史记录
      // 点击的歌单详情
      this.musicListInfo = {
        id: item.id,
        name: item.name,
        picUrl: item.artist.picUrl
        // playCount: item.playCount // NeteaseCloudMusicApi 3.25.4 取消了该字段
      };
      this.musicListLoading = true; // 给歌单添加加载效果
      this.$router.push({ path: `/search/${item.id}` }); // 跳转至歌单详情界面
      await this.$store.dispatch("musicLists/loadMusicList", { id: item.id }); // await 等待函数执行完成
      this.musicListLoading = false; // 无论函数执行成功或失败, 都显示loading状态
    },
    // 点击歌曲搜索结果
    async onClickSearchSongs(item) {
      this.setHistoryRecord(); // 存储历史记录
      try {
        const { status, payload } = await getSongInfo({ ids: item.id });
        if (status == 200) {
          this.$store.dispatch("musicPlayer/setPlayList", payload.songs[0]);
          this.$store.dispatch("musicPlayer/setCurrentIndex", 0);
        }
      } catch (e) {
        console.error("歌曲获取失败: " + e);
      }
    },
    // 加载歌手信息
    async loadSingerInfo(singer) {
      try {
        // 获取歌手简介
        const { status, payload } = await getSingerInfo({ id: singer.id })
        if (status === 200) {
          // 处理歌手基本信息
          this.musicListInfo = Object.assign({}, 
            singer, 
            {
              desc: payload.briefDesc.split('。')[0]
            }
          )
        }
      } catch (e) {
        console.error('歌手详情获取失败: ' + e)
      }
    },
    // 删除搜索历史记录
    onClearSearchRerords(item = "") {
      // 如果存在item, 即说明是点击删除单个记录
      if (item) {
        this.searchRecords = this.searchRecords.filter(
          record => record != item
        );
        this.$storage.setStorageItem("search_history_of_music", this.searchRecords);
      } else {
        // 删除所有记录
        this.searchRecords = [];
        this.$storage.removeStorageItem("search_history_of_music");
      }
    }
  }
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
      font-size: 5vw;
      color: #fff;
      margin: 0 1.5vw;
    }
    .search-input {
      // flex: 1;
      margin: 1.5vw 1.5vw 1.5vw 0;
      .el-input__inner {
        height: 8vw;
        line-height: 8vw;
        border-radius: 8vw;
        font-size: 3.5vw;
        color: #fff;
        border: 1px solid #fff;
        background-color: #22d59c;
      }
      .el-input__icon {
        line-height: 8vw;
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
          margin: 2.5vw;
          font-size: 4.2vw;
          line-height: 4.2vw;
          color: #666;
        }
        .search-hots-item {
          display: inline-block;
          border: 1px solid #e3e3e3;
          border-radius: 7vw;
          height: 7vw;
          margin-left: 1.6vw;
          margin-bottom: 1.6vw;
          padding: 0 3.8vw;
          font-size: 3.5vw;
          line-height: 7vw;
          color: #333;
        }
      }
      .search-history {
        .search-history-title {
          margin: 2.7vw;
          font-size: 4.2vw;
          line-height: 4.2vw;
          color: #666;
        }
        .search-history-item {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;
          height: 10.7vw;
          line-height: 10.7vw;
          border-bottom: 1px solid #e3e3e3;
          .history-item-icon {
            margin: auto 2.7vw;
            color: #d1d2d3;
          }
          .history-item-title {
            font-size: 4vw;
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
          padding-left: 5.3vw;
          color: #22d59c;
          font-size: 3.8vw;
          line-height: 8vw;
          background-color: #f1f1f1;
        }
        .search-result-item-singer {
          display: flex;
          height: 13.4vw;
          padding: 1.4vw 5.4vw;
          border-bottom: 1px solid #e3e3e3;
          .result-singer-info {
            margin-left: 4vw;
            flex: 1;
            display: flex;
            height: 13.4vw;
            overflow: hidden;
            .result-singer-name {
              margin: auto 0;
              font-size: 4vw;
            }
          }
        }
        .search-result-item-playlist {
          display: flex;
          height: 13.4vw;
          padding: 1.4vw 5.4vw;
          border-bottom: 1px solid #e3e3e3;
          .result-playlist-info {
            margin-left: 4vw;
            flex: 1;
            display: flex;
            height: 13.4vw;
            overflow: hidden;
            .result-playlist-name {
              margin: auto 0;
              font-size: 4vw;
            }
          }
        }
        .search-result-item-song {
          display: flex;
          height: 10.7vw;
          padding: 1.4vw 5.4vw;
          border-bottom: 1px solid #e3e3e3;
          .result-song-info {
            display: flex;
            flex-direction: column;
            .result-song-name {
              font-size: 4.2vw;
              color: #2e3030;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .result-song-atrister {
              font-size: 3.2vw;
              color: #757575;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
      .search-result-item-bottom {
        position: relative;
        width: 100%;
        height: 16vw;
        text-align: center;
        line-height: 16vw;
        color: #969696;
      }
    }
  }
}
.searchMusic-enter-active,
.searchMusic-leave-active {
  transition: all 0.3s;
}
.searchMusic-enter,
.searchMusic-leave-to {
  transform: translate3d(50%, 0, 0);
  opacity: 0;
}
</style>