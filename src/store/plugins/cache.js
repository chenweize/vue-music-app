/**
 * 对VUX进行缓存
 * const store = new Vuex.Store({
  state,
  mutations,
  plugins: [createCachePlugin({
      items:[
          {path:"devicealarm/items",expired:<有效时间>},--->key=zhwx_devicealarm_items
          {path:"deviceevents/bb",expired:<有效时间>}
          {path:"devicestatus/aa",expired:<有效时间>}
      ]
  })]
})
 */