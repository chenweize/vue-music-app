import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from '@/components/recommend'

Vue.use(Router)

export default new Router({
  routes: [
    {
      // 默认跳转到 recommend (推荐页)
      path: '/',
      redirect: '/recommend'
      // component: () => import('@/components/recommend')
    },
    {
      // 推荐页
      path: '/recommend',
      component: () => import('@/components/recommend'),
      children: [
        {
          path: ':id',
          component: () => import('@/components/musicList')
        }
      ]
    },
    {
      // 歌曲排行榜页
      path: '/rank',
      component: () => import('@/components/rank'),
      children: [
        {
          path: ':id',
          component: () => import('@/components/musicList')
        }
      ]
    },
    {
      // 歌手页
      path: '/singer',
      component: () => import('@/components/singer'),
      children: [
        {
          path: ':id',
          component: () => import('@/components/musicList')
        }
      ]
    },
    {
      // 搜索页
      path: '/search',
      component: () => import('@/components/search'),
      children: [
        {
          path: ':id',
          component: () => import('@/components/musicList')
        }
      ]
    },
    {
      // 个人页
      path: '/user',
      component: () => import('@/components/user')
    }
  ]
})
