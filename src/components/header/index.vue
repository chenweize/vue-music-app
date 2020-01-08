<template>
  <div class="music-app-header-container">
    <div class="music-header">
      <router-link tag="div" class="music-header-user" to="/user">
        <icon class="el-icon-user"></icon>
      </router-link>
      <div class="music-header-title">
        <span>QQMUSIC</span>
      </div>
      <router-link tag="div" class="music-header-search" to="/search">
        <icon class="el-icon-search"></icon>
      </router-link>
    </div>

    <div class="music-tabs">
      <router-link tag="div" class="music-tab-item" to="/recommend">
        <span class="tab-item-title">推荐</span>
      </router-link>
      <router-link tag="div" class="music-tab-item" to="/rank">
        <span class="tab-item-title">排行</span>
      </router-link>
      <router-link tag="div" class="music-tab-item" to="/singer">
        <span class="tab-item-title">歌手</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "DefaultName",
  props: {},
  components: {},
  data() {
    return {
    };
  },
  created() {
    this.$router.push('/recommend')
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
  },
  destroyed() {}
};
</script>

<style lang="scss">
.music-app-header-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #22d59c; // #31c27c
  .music-header {
    display: flex;
    flex: 1;
    align-items: center;
    flex-direction: row;
    margin: 10px;
    .music-header-user {
      margin-right: 10px;
      font-size: 20px;
      color: #ffffff;
    }
    .music-header-title {
      flex: 1;
      text-align: center;
      font-weight: bold;
      font-size: 20px;
      color: #ffffff;
    }
    .music-header-search {
      font-size: 20px;
      color: #ffffff;
      //   flex: 1;
    }
  }
  .music-tabs {
    flex: 1;
    padding: 5px 10px 10px 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    // background-color: #ffffff;
    .music-tab-item {
      flex: 1;
      text-align: center;
      color: #e9e9e9;
    }
    .router-link-active {
      .tab-item-title {
        color: #fff; // #31c27c
        padding-bottom: 3px;
        border-bottom: 2px solid #fff;
      }
    }
  }
}
</style>