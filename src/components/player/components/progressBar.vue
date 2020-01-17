<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  data() {
    return {
      newPercent: 0
    };
  },
  props: {
      // 进度
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {};
  },
  watch: {
      // 监听进度, 并实时更新
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const offsetWidth = newPercent * barWidth;
        this._offset(offsetWidth);
      }
    }
  },
  methods: {
    progressClick(e) {
      // 这个有 bug
      // this._offset(e.offsetX)
      const rect = this.$refs.progressBar.getBoundingClientRect();
      // rect.left 元素距离左边的距离
      // e.pageX 点击距离左边的距离
      const offsetWidth = e.pageX - rect.left;
      // console.log(rect, e.pageX)
      this._offset(offsetWidth);
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("percentChangeEnd", percent);
    },
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      this._triggerPercent();
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        Math.min(
          this.$refs.progressBar.clientWidth - progressBtnWidth,
          Math.max(0, this.touch.left + deltaX)
        )
      );
      this._offset(offsetWidth);
    },
    progressTouchEnd(e) {
      this.touch.initiated = false;
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("percentChangeEnd", percent);
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("percentChange", percent);
    },
    // 填充进度条
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
    }
  }
};
</script>

<style lang="scss">
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: rgb(212, 68, 57);
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 5px solid rgb(241, 241, 241);
        border-radius: 50%;
        background: rgb(212, 68, 57);
      }
    }
  }
}
</style>