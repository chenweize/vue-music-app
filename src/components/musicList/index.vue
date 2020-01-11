<template>
  <transition name="musicList" mode="out-in">
    <div class="music-list-container">default blank</div>
  </transition>
</template>

<script>
export default {
  name: "DefaultName",
  props: {},
  components: {},
  data() {
    return {};
  },
  created() {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
  destroyed() {}
};
</script>

<style lang="scss">
.music-list-container {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  background-color: #ffffff; // #22d59c
}

// 进入页面动画效果
.musicList-enter-active, .musicList-leave-active {
  transition: all 0.2s;
}
.musicList-enter, .musicList-leave-to {
  transform: translate3d(30%, 0, 0);
  opacity: 0;
}
</style>