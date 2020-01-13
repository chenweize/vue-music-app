import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import pathify from './pathify'
// import cache from './plugins/cache'

Vue.use(Vuex)

const modulesFiles = require.context('./modules', false, /\.js$/)

//  自动导入模块
// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  plugins: [pathify.plugin], // cache()
  getters,
  modules
})

window.store = store

export default store