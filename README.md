<h2 align="center"><a href="https://github.com/chenweize/vue-music-app" target="_blank">QQ音乐app</a></h2>

<p align="center"> 基于vue全家桶 + axios + better-scroll等开发一款移动端音乐app, 其中vuex的管理用了一个插件<a href="https://github.com/davestewart/vuex-pathify">vuex-pathify</a>, UI页面参考了安卓版的QQ音乐与网易云音乐的页面利用flex布局完成。</p>

#### <p align="center">首先感谢 Binaryify 大神对[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi/)的不断更新与维护，为本demo提供稳定可靠的后端支持</p>

#### 技术栈

**前端**

* `Vue`：用于构建用户界面的 MVVM 框架
* `vue-router`：为单页面应用提供的路由系统，使用了 `Lazy Loading Routes` 技术来实现异步加载优化性能
* `vuex`：Vue 集中状态管理，在多个组件共享某些状态时非常便捷
* `vue-lazyload`：实现图片懒加载，节省用户流量，优化页面加载速度
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
1. 音乐播放、暂停、上一曲、下一曲
2. 播放列表、添加到播放列表、做为下一首播放
3. 搜索单曲、歌手、专辑
4. 查看歌手页面、专辑页面
5. 热门搜索
6. 搜索历史记录
7. 排行榜
8. 切换播放模式
9. 歌词
10. 我喜欢
11. 最近播放

### 未实现的功能
*   MV播放
*   下载

## Build Setup
## 注意: 本DEMO仅用于学习、参考，不可作为商业用途

