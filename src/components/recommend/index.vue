<template>
  <div class="music-app-recmmend-container">
    这是推荐页<br/>
    下面有轮播图
  </div>
</template>

<script>
import { getBanner } from "@/api/main-page";

export default {
  name: "MusicRecommend",
  data() {
    return {
    };
  },
  created() {
    this.loadMusicRecommend();
  },
  computed: {},
  methods: {
   
    // 获取QQ音乐当前热门推荐
    async loadMusicRecommend() {
      try {
        const { status, payload } = await getBanner()
        if (status === 200) {
          console.log(payload.banners)
        }
      } catch (e) {
        console.log('首页推荐轮播图加载失败: ' + e)
      }      
    }
  }
};
</script>

<style lang="scss">
.music-app-recmmend-container {
  width: 100%;
  height: 100%;
  display: flex; 
}
</style>