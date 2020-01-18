<template>
  <div class="music-app-recmmend-container">
    <scroll ref="recommendScroll" class="music-recommend-scroll">
      <div>
        <div v-show="banners.length" class="recommend-banner-decorate"></div>
        <div v-if="banners.length" class="recommend-banner-slider">
          <slider :imgDatas="banners"></slider>
        </div>

        <div class="recommend-music-lists">
          <h4 class="music-lists-title">推荐歌单</h4>
          <div class="music-lists-container">
            <div
              class="music-lists-item"
              v-for="item in recommendLists"
              :key="item.id"
              @click="onClickRecommendList(item)"
            >
              <span class="lists-item-hot">
                <i class="el-icon-headset"></i>
                {{ Math.floor(item.playCount / 10000) }}万
              </span>
              <el-image class="lists-item-img" fit="fill" :src="item.picUrl"></el-image>
              <span class="lists-item-title">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <div class="recommend-music-lists">
          <h4 class="music-lists-title">最新音乐</h4>
          <div class="music-lists-container">
            <div
              class="music-lists-item"
              v-for="item in newSongs"
              :key="item.id"
              @click="onClickNewMusic(item)"
            >
              <el-image class="lists-item-img" fit="fill" :src="item.picUrl"></el-image>
              <span
                class="lists-item-title"
              >{{ item.name + '-' + item.song.artists.map(i => {return i.name}).join('/') }}</span>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <router-view :musicListInfo="playListInfo" :loading="loading"></router-view>
  </div>
</template>

<script>
import Scroll from "@/common/scroll";
import {
  getBanner,
  getRecommendLists,
  getRecommendNewSongs
} from "@/api/main-page";
import { getLyric } from "@/api/player-page";
import Slider from "@/common/slider";
import { get } from "vuex-pathify";

export default {
  name: "MusicRecommend",
  components: { Scroll, Slider },
  data() {
    return {
      loading: false,
      playListInfo: {},
      banners: [], // 轮播图数据
      recommendLists: [], // 推荐歌单
      newSongs: [] // 推荐歌曲
    };
  },
  created() {
    this.loadRecommendBanner();
    this.loadRecommendList();
    this.loadRecommendNewSongs();
  },
  computed: {},
  methods: {
    // 加载推荐页轮播图
    async loadRecommendBanner() {
      try {
        const { status, payload } = await getBanner();
        if (status === 200) {
          this.banners = payload.banners;
        }
      } catch (e) {
        console.log("首页推荐轮播图加载失败: " + e);
      }
    },
    // 加载推荐页推荐歌单
    async loadRecommendList() {
      const params = { limit: 6 };
      try {
        const { status, payload } = await getRecommendLists(params);
        if (status === 200) {
          this.recommendLists = payload.result;
        }
      } catch (e) {
        console.log("首页推荐轮播图加载失败: " + e);
      }
    },
    // 加载推荐页推荐歌曲
    async loadRecommendNewSongs() {
      try {
        const { status, payload } = await getRecommendNewSongs();
        if (status === 200) {
          this.newSongs = payload.result.slice(0, 6); // 取前六首
        }
      } catch (e) {
        console.log("首页推荐轮播图加载失败: " + e);
      }
    },
    // 点击歌单
    async onClickRecommendList(item) {
      console.log(item)
      this.playListInfo = item; // 点击的歌单详情
      this.loading = true; // 给歌单添加加载效果
      this.$router.push({ path: `/recommend/${item.id}` }); // 跳转至歌单详情界面
      await this.$store.dispatch("musicLists/loadMusicList", { id: item.id }); // await 等待函数执行完成
      this.loading = false; // 无论函数执行成功或失败, 都显示loading状态
    },
    // 点击新歌
    async onClickNewMusic(item) {
      try {
        const res = await getLyric({ id: item.id })
        console.log(res)
      } catch (e) {
        console.log('歌词获取失败: ' + e)
      }
      // this.$router.push({ path: `/recommend/${item.id}` });
    }
  }
};
</script>

<style lang="scss">
.music-app-recmmend-container {
  position: fixed;
  width: 100%;
  top: 82px;
  bottom: 0;
  z-index: 100;
  .music-recommend-scroll {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .recommend-banner-decorate {
      position: absolute;
      top: 0;
      z-index: -10;
      background-color: #22d59c; // $color-theme
      width: 100%;
      height: 20vh;
      vertical-align: inherit;
    }
    .recommend-banner-slider {
      width: 96%;
      margin: 0 auto;
      border-radius: 5px;
      overflow: hidden;
    }
    .recommend-music-lists {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      // text-align: center;
      // flex-wrap: wrap;
      .music-lists-title {
        margin: 10px;
      }
      .music-lists-container {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .music-lists-item {
          position: relative;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          // width: 7rem;
          // height: 9rem;
          width: 30%;
          overflow: hidden;
          margin-bottom: 5px;
          .lists-item-hot {
            font-size: 12px;
            right: 0.1rem;
            color: #ffffff;
            z-index: 3;
            position: absolute;
          }
          .lists-item-img {
            // width: 7rem;
            // height: 7rem;
            // border-radius: 0.2rem;
            border-radius: 5px;
          }
          .lists-item-title {
            text-overflow: -o-clip-lastline;
            overflow: hidden;
            text-overflow: clip;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>