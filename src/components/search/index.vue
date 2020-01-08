<template>
  <div class="music-app-search-container">
    <div class="music-search-box">
      <router-link tag="div" class="music-back" to="/">
        <icon class="el-icon-back"></icon>
      </router-link>
      <el-input
        class="search-input"
        placeholder="请输入内容"
        v-model="searchWords"
        @blur="onBlur"
        @focus="onFocus"
      >
        <i slot="suffix" class="el-input__icon el-icon-search" @click="onClickSearchMusic"></i>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: "MusicSearchBox",
  props: {},
  components: {},
  data() {
    return {
      searchWords: "", // 搜索关键词
      cancelShow: false // 是否显示取消字段
    };
  },
  created() {},
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
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.music-app-search-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // background-color: #31c27c; // #22d59c
  .music-search-box {
    // background: #eee;
    border-radius: 5px;
    margin: 10px;
    display: flex;
    flex: 1;
    align-items: center;
    .music-back {
        font-size: 20px;
        margin-right: 5px;
    }
    .search-input {
      flex: 1;
      .el-input__inner {
        border-radius: 40px;
      }
    }
  }
}
</style>