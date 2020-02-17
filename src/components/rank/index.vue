<template>
  <div class="music-app-rank-container">
    <scroll class="music-rank-scroll" ref="rankScroll">
      <div class="music-rank-list">
        <div class="music-rank-list-item" v-for="item in rankList" :key="getKey(item)" @click="onClickRankItem(item)">
          <el-avatar
            class="music-rank-item-avatar"
            shape="square"
            :size="100"
            :src="item.coverImgUrl"
          ></el-avatar>
          <div class="music-rank-item-info">
            <div class="music-rank-item-title" v-for="(track, index) in item.tracks" :key="getKey(index)">
              <span>{{ (index + 1) + '. ' 
                + (track.first ? track.first : track.name) + ' - '
                + (track.second ? track.second : track.ar.map(a => {return a.name}).join("/")) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <router-view :musicListInfo="playListInfo" :loading="loading"></router-view>
  </div>
</template>

<script>
import { getTopRank, getTopRanks } from "@/api/rank-page";
import Scroll from "@/common/scroll";

export default {
  name: "MusicRank",
  components: {
    Scroll
  },
  data() {
    return {
      rankList: [],
      loading: false,
      playListInfo: {}
    };
  },
  created() {
    this.getTopRanksInfo();
  },
  computed: {},
  methods: {
    // 获取rank歌单数据
    async getTopRanksInfo() {
      try {
        const { status, payload } = await getTopRanks();
        if (status == 200) {
          // 该接口请求到的rank榜只有前四条有歌曲数据, 故多加载了两个
          this.rankList = payload.list.slice(0, 4);

          this.getTopRankInfo({ idx: 17 });
          this.getTopRankInfo({ idx: 23 });
        }
      } catch (e) {
        console.error("排行榜获取失败: " + e);
      }
    },
    async getTopRankInfo(params) {
      try {
        const { status, payload } = await getTopRank(params);
        if (status == 200) {
          // 该接口请求到的rank榜只有前四条有歌曲数据
          let list = payload.playlist;
          list.tracks = list.tracks.slice(0, 3);
          this.rankList.push(list);
        }
      } catch (e) {
        console.error("排行榜获取失败: " + e);
      }
    },
    async onClickRankItem(item) {
      this.playListInfo = { name: item.name, playCount: item.playCount, picUrl: item.coverImgUrl } // 点击的歌单详情
      this.loading = true // 给歌单添加加载效果
      this.$router.push({ path: `/rank/${item.id}` }); // 跳转至歌单详情界面
      await this.$store.dispatch("musicLists/loadMusicList", { id: item.id }); // await 等待函数执行完成
      this.loading = false // 无论函数执行成功或失败, 都显示loading状态
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
.music-app-rank-container {
  position: fixed;
  width: 100%;
  bottom: 0;
  top: 82px;
  .music-rank-scroll {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .music-rank-list {
      display: flex;
      width: 100%;
      flex-direction: column;
      .music-rank-list-item {
        display: flex;
        padding: 5px 10px;
        border-bottom: 1px solid #f6f6f6;
        .music-rank-item-avatar {
        }
        .music-rank-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .music-rank-item-title {
            margin: 0;
            font-size: 14px;
            font-weight: 400;
            vertical-align: baseline;
          }
        }
      }
    }
  }
}
</style>