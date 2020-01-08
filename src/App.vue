<template>
  <div id="app">
    <Header></Header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Header from '@/components/header'

export default {
  name: 'App',
  components: {
    Header
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
