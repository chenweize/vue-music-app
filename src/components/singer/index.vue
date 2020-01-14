<template>
  <div class="music-app-singer-container">
    <scroll
      ref="singerScroll"
      class="music-singer-scroll"
      :listenScroll="listenScroll"
      :probeType="probeType"
      @scroll="onScroll"
    >
      <div>
        <div class="music-singer-list">

        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/common/scroll";

export default {
  name: "MusicSinger",
  components: {
    Scroll
  },
  data() {
    return {
      listenScroll: true,
      probeType: 3
    };
  },
  created() {
    this.loadAllSingers()
  },
  computed: {},
  methods: {
    onScroll() {},
    loadAllSingers() {
      this.$store.dispatch("musicLists/loadSingerList")
    }
  }
};
</script>

<style lang="scss">
.music-app-singer-container {
  position: fixed;
  width: 100%;
  bottom: 0;
  top: 82px;
}
</style>