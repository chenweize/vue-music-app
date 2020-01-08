<template>
  <div class="music-app-search-container">
    <div class="music-search-box">
      <router-link tag="div" class="music-back" to="/">
        <icon style="color: #fff;" class="el-icon-back"></icon>
      </router-link>
      <el-input
        class="search-input"
        placeholder="请输入内容"
        v-model="searchWords"
        @blur="onBlur"
        @focus="onFocus"
      >
        <i
          slot="suffix"
          style="color: #fff;"
          class="el-input__icon el-icon-search"
          @click="onClickSearchMusic"
        ></i>
      </el-input>
    </div>

    <scroll class="music-search-scroll" ref="scroll">
      <div class="music-search-info" v-if="!searchWords">
        <div class="search-hots" v-loading="searchHotLoading">
          <div class="search-hots-title">热门搜索</div>
          <span class="search-hots-item" v-for="(item, index) in hots" :key="index">{{ item.first }}</span>
        </div>

        <div class="search-history">
          <div class="search-history-title">历史搜索</div>
          <div class="search-history-item">
            <icon slot="suffix" style="margin: auto 10px;" class="el-icon-time"></icon>
            <span class="history-item-title">周杰伦</span>
            <icon slot="prefix" style="margin: auto 10px;" class="el-icon-close"></icon>
          </div>
          <div class="search-history-item">
            <icon slot="suffix" style="margin: auto 10px;" class="el-icon-time"></icon>
            <span class="history-item-title">张靓颖</span>
            <icon slot="prefix" style="margin: auto 10px;" class="el-icon-close"></icon>
          </div>
          <div class="search-history-item">
            <icon slot="suffix" style="margin: auto 10px;" class="el-icon-time"></icon>
            <span class="history-item-title">林俊杰</span>
            <icon slot="prefix" style="margin: auto 10px;" class="el-icon-close"></icon>
          </div>
        </div>
      </div>
      <div class="music-search-result" v-else>搜索结果</div>
    </scroll>
  </div>
</template>

<script>
import scroll from "@/common/scroll";
import { getHot } from "@/api/search-page";

export default {
  name: "MusicSearchBox",
  props: {},
  components: {
    scroll
  },
  data() {
    return {
      searchWords: "", // 搜索关键词
      cancelShow: false, // 是否显示取消字段
      hots: [], // 热门搜索
      searchHotLoading: false, // 热门搜索loading效果
      searchResultLoading: false // 搜索结果loading效果
    };
  },
  created() {
    this.getHotSearchInfo();
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    onClickSearchMusic() {
      console.log(this.searchWords);
    },
    // 当搜索框聚焦时
    onFocus() {
      this.cancelShow = true;
    },
    // 当搜索框失焦时
    onBlur() {
      this.cancelShow = false;
    },
    async getHotSearchInfo() {
      try {
        const { status, data } = await getHot();
        if (status == 200) {
          this.hots = data.result.hots;
        }
      } catch (e) {
        console.log("热门搜索获取失败: " + e);
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
  z-index: 100;
  background-color: #ffffff; // #22d59c
  .music-search-box {
    background-color: #22d59c;
    padding: 10px;
    display: flex;
    align-items: center;
    .music-back {
      font-size: 20px;
      margin-right: 5px;
    }
    .search-input {
      flex: 1;
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
          height: 45px;
          line-height: 45px;
          border-bottom: 1px solid #e3e3e3;
          .history-item-title {
            font-size: 16px;
            flex: 1;
          }
        }
      }
    }
  }
}
</style>