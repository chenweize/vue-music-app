import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from '@/components/recommend'

Vue.use(Router)

export default new Router({
  routes: [
    {
      // 默认跳转到 recommend
      path: '/',
      // component: Recommend
      component: () => import('@/components/recommend')
    },
    {
      // 推荐页
      path: '/recommend',
      component: () => import('@/components/recommend')
    },
    {
      // 歌曲排行榜页
      path: '/rank',
      component: () => import('@/components/rank')
    },
    {
      // 歌手页
      path: '/singer',
      component: () => import('@/components/singer')
    },
    {
      // 搜索页
      path: '/search',
      component: () => import('@/components/search')
    },
    {
      // 个人页
      path: '/user',
      component: () => import('@/components/user')
    }
  ]
})
