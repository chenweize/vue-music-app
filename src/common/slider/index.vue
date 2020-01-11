<template>
  <div class="slider-wrapper" ref="sliderWrapper">
    <div class="slider-ul" ref="sliderUl">
      <div class="slider-li" v-for="(item,index) in imgDatas" :key="index">
        <a :href="item.url">
          <img :src="item.picUrl" />
        </a>
      </div>
    </div>
    <div class="dots">
      <span
        :key="'b'+index"
        v-for="(item,index) in imgDatas"
        :class="{'dot-active' : currentPageIndex == index}"
        @click="linkToPage(index)"
      ></span>
    </div>
    <div class="arrow left-arrow" @click="scrollbtnEvent('left')">
      <i class="el-icon-arrow-left"></i>
    </div>
    <div class="arrow right-arrow" @click="scrollbtnEvent('right')">
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  props: {
    // 是否循环播放
    loop: {
      type: Boolean,
      default: true
    },
    // 是否自动播放
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 轮播图片的时间
    interVal: {
      type: Number,
      default: 3000
    },
    // 传入的图片数据
    imgDatas: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      currentPageIndex: 0 // 记录当前轮播图图片序号，下标从0开始，即第一张
    };
  },
  mounted() {
    // 加载初始化
    setTimeout(() => {
      this._setUlWidth();
      this._initSlider();
      this._setAutoplay();
    }, 20);
    // 实时监听轮播器, 使其可以自适应当前屏幕宽度
    window.addEventListener("resize", () => {
      if (!this.slider) {
        return;
      }
      this._setUlWidth();
    });
  },
  methods: {
    // 初始化wrapper的宽度
    _setUlWidth() {
      this.children = this.$refs.sliderUl.children;
      let childrenLength = this.loop
        ? this.children.length + 2
        : this.children.length;
      this.$refs.sliderUl.style.width = childrenLength * 100 + "%";
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].style.width = 100 / childrenLength + "%";
      }
    },
    // 播放
    _setAutoplay() {
      let goToIndex = this.currentPageIndex + 1;
      let childrenLength = this.loop
        ? this.children.length - 2
        : this.children.length;
      if (goToIndex >= childrenLength) {
        goToIndex = 0;
      }
      this.timer = setInterval(() => {
        this.slider.goToPage(goToIndex, 0, 400);
      }, this.interVal);
    },
    // 初始化better-scroll
    _initSlider() {
      let that = this;
      this.slider = new BScroll(this.$refs.sliderWrapper, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        probeType: 2
      });
      // 监听scroll结束的时候，赋值更新currentPageIndex
      this.slider.on("scrollEnd", () => {
        clearInterval(that.timer);
        that.currentPageIndex = that.slider.getCurrentPage().pageX;
        let childrenLength = this.loop
          ? this.children.length - 2
          : this.children.length;
        that._setAutoplay();
      });
      let childrenLength = this.loop
        ? this.children.length - 2
        : this.children.length;
      // 左滑到最左还想轮播
      this.checkScroll(childrenLength, this.$refs.sliderWrapper.offsetWidth);
    },
    // 监听滑事件
    checkScroll(childrenLength, itemWidth) {
      let that = this;
      this.slider.on("scroll", () => {
        clearInterval(that.timer);
        let leftScroll = parseInt(
          that.$refs.sliderUl.style["transform"].substring(10, 15)
        );
        let left = -1 * itemWidth;
        let right = left * childrenLength;
        if (leftScroll > left) {
          that.slider.goToPage(childrenLength, 0, 400);
        } else if (leftScroll < right) {
          that.slider.goToPage(1, 0, 400);
        }
      });
    },
    // 向左向右
    scrollbtnEvent(type) {
      clearInterval(this.timer);
      let childrenLength = this.loop
        ? this.children.length - 2
        : this.children.length;
      let goIndex =
        type == "left" ? this.currentPageIndex - 1 : this.currentPageIndex + 1;
      if (type == "left") {
        if (goIndex < 0) {
          goIndex = childrenLength - 1;
        }
      } else {
        if (goIndex >= childrenLength) {
          goIndex = 0;
        }
      }
      this.slider.goToPage(goIndex, 0, 400);
    },
    // 按小圆圈切换
    linkToPage(index) {
      this.slider.goToPage(index, 0, 400);
    }
  }
};
</script>

<style>
.slider-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 1px;
  overflow: hidden;
}
.dots {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0.1rem;
  display: flex;
  flex-direction: row;
}
.dots span {
  cursor: pointer;
  display: block;
  width: 0.5rem; /* 0.1rem */
  height: 0.5rem;
  border-radius: 0.25rem; /* 0.05rem */
  background: #cccccc;
  margin-right: 0.25rem;
}
.dot-active {
  width: 0.5rem !important; /* 0.1rem */
  background: #fff !important;
}
.arrow {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  cursor: pointer;
  color: #333;
  opacity: 0.4;
  font-size: 1.5rem; /* 0.3 */
  width: 3.5rem; /* 0.7 */
  height: 100%;
}
.arrow:hover {
  opacity: 1;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.5) 0,
    rgba(0, 0, 0, 0.0001) 100%
  );
  color: #fff;
}
.left-arrow {
  left: 0;
}
.left-arrow i {
  margin-left: 1rem; /* 0.2 */
}
.right-arrow {
  justify-content: flex-end;
  right: 0;
}
.right-arrow i {
  margin-right: 1rem; /* 0.2 */
}

.slider-ul {
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  height: 100%;
}
.slider-li {
  /* width: 20%; */
  height: 100%;
  float: left;
  box-sizing: border-box;
  overflow: hidden;
}
.slider-li a {
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: block;
}
.slider-li img {
  width: 100%;
  height: 100%;
  display: block;
}
@media screen and (max-width: 500px) {
  .arrow {
    display: none;
  }
}
</style>