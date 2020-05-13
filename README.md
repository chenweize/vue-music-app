<h2 align="center"><a href="https://github.com/chenweize/vue-music-app" target="_blank">QQ音乐app</a></h2>

<p align="center"> 基于vue全家桶 + axios + better-scroll等开发一款移动端音乐app, 其中vuex的管理用了一个插件<a href="https://github.com/davestewart/vuex-pathify">vuex-pathify</a>, UI页面参考了安卓版的QQ音乐与网易云音乐的页面利用flex布局完成。</p>

#### <p align="center">首先感谢 Binaryify 大神对[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi/)的不断更新与维护，为本项目提供稳定可靠的后端支持</p>

#### 技术栈

**前端**

* `Vue`：用于构建用户界面的 MVVM 框架
* `vue-router`：为单页面应用提供的路由系统，使用了 `Lazy Loading Routes` 技术来实现异步加载优化性能
* `vuex`：Vue 集中状态管理，在多个组件共享某些状态时非常便捷
* `better-scroll`：解决移动端各种滚动场景需求的插件，使移动端滑动体验更加流畅
* `vuex-pathify`：一个强大的vuex管理工具
* `pinyin`：转换中文字符为拼音，用于实现歌手类表的根据歌手名称首字母快速定位功能
* `SCSS`：css 预编译处理器
* `ES6`：ECMAScript 新一代语法，模块化、解构赋值、Promise、Class 等方法非常好用

**后端**

* `Node.js`：利用 Express 搭建的本地测试服务器
* `vue-axios`：用来请求后端 API 音乐数据
* `NeteaseCloudMusicApi`：网易云音乐 NodeJS 版 API，提供音乐数据

**其他工具**

* `vue-cli`：Vue 脚手架工具，快速初始化项目代码
* `iconfont` ：阿里巴巴图标库，谁用谁知道

### 页面预览
1. 首页推荐页、个人页<br/>
![首页推荐页](https://s1.ax1x.com/2020/04/29/J71ZSH.png)
![个人页](https://s1.ax1x.com/2020/04/29/J71eld.png)
2. 播放器页<br/>
![播放器页](https://s1.ax1x.com/2020/04/29/J71m6A.png)
![歌词页](https://s1.ax1x.com/2020/04/29/J71iTK.png)
3. 歌手页、排行榜页<br/>
![歌手页](https://s1.ax1x.com/2020/04/29/J71AYD.png)
![排行榜页](https://s1.ax1x.com/2020/04/29/J71Cex.png)
4. 搜索页、歌曲列表页<br/>
![搜索页](https://s1.ax1x.com/2020/04/29/J71Efe.png)
![歌曲列表页](https://s1.ax1x.com/2020/04/29/J71Pw6.png)

### 实现的功能
1. 音乐播放、暂停、上一曲、下一曲（基于H5的<audio>标签实现）
2. 播放列表、添加到播放列表、做为下一首播放（播放歌曲列表，存于store的播放列表'playList'中，便于管理）
3. 搜索单曲、歌手、专辑（通过调用NeteaseCloudMusicApi提供的接口获取对应数据实现）
4. 查看歌手页面、专辑页面（通过调用NeteaseCloudMusicApi提供的接口获取对应数据实现）
5. 热门搜索（通过调用NeteaseCloudMusicApi提供的接口获取对应数据实现）
6. 搜索历史记录（基于localStorage实现，有对其进行简单的封装于utils中，已全局注册localStorage）
7. 排行榜（基于NeteaseCloudMusicApi提供的后台数据实现）
8. 切换播放模式（将播放模式playMode存于store，单曲循环则是循环播放当前序列号currentIndex的歌曲，随机播放则是打乱播放列表playList的顺序来实现）
9. 歌词（通过调用NeteaseCloudMusicApi提供的接口获取对应数据实现，利用获取到的歌词'[00:33:21] 我和你心连心同住地球村...'，通过截取成数组，在对应的时间让对应的歌词高亮，实现歌词的实时跟踪）
10. 歌手列表（通过调用NeteaseCloudMusicApi提供的接口获取对应数据实现，其中右侧悬浮的首字母快速定位框基于 hotoo 提供的 [pinyin](https://github.com/hotoo/pinyin)插件来处理每个歌手对应的首字母，点击字母时利用better-scroll的scrollToElement()方法快速定位到对应位置来实现）
11. 我喜欢（基于localStorage实现，有对其进行简单的封装于utils中，已全局注册localStorage，通过点击对应歌曲的我喜欢按钮，把我喜欢的歌曲更新到仓库中，并同时存入localStorage）
12. 最近播放（原理同'我喜欢'功能）

### 未实现的功能
*   MV播放（已了解过相关技术，可以尝试利用 [video.js](https://github.com/videojs/video.js) 来实现）
*   下载（已了解过相关技术，可以尝试利用 <a> 标签的 download 功能来实现）

## Build Setup
克隆代码到本地之后，需要运行 [NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=neteasecloudmusicapi)，来起一个音乐的 API 接口。

如果需要在服务器上搭建的话就需要将 API 放到自己的服务器上面。

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## 注意: 本项目仅用于学习、参考，不可作为商业用途

