<template>
  <div id="app">
    <Header></Header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- <player></player> -->
  </div>
</template>

<script>
import Header from '@/components/header'
import Player from '@/components/player'

export default {
  name: 'App',
  components: {
    Header,
    Player
  }
}
</script>

<style>
#app {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
