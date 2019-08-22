<template>
  <div
    class="waterfall-silde"
    :style="_style"
    ref="waterfallSilde"
    :class="{show: init}"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'waterfallSilde',
  inject: ['parent'],
  props: {
    // 需要预加载的图片数组
    imgs: {
      type: Array,
      default: () => []
    },
    // 是否需要预加载
    prefetch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      height: 0,
      top: 0,
      left: 0,
      resize: false,
      init: false
    }
  },
  computed: {
    _style() {
      let { width } = this.parent
      if (!this.init) {
        return {
          width: width + 'px'
        }
      }
      let style = {
        top: this.top + 'px',
        left: this.left + 'px'
      }
      if (width) {
        Object.assign(style, {
          width: width + 'px'
        })
      }
      return style
    },
    hide() {
      return !this.parent.init
    }
  },
  methods: {
    // 通知父组件添加子实例
    notificationParent() {
      this.parent.allChildren.push(this)
      this.parent.childrens.push(this)
    },
    // 刷新高度
    async getHeight(i) {
      await this.imgLoad()
      this.height = this.$refs.waterfallSilde.offsetHeight
    },
    // 图片不定高的时候预加载
    async imgLoad(img) {
      if (!this.prefetch) return 'imgLoadJump';
      if (!this.imgs.length) return 'imgLoadJump'
      return await Promise.all(this.imgs.map(item => this.everyImgLoad(item)))
    },
    // 单张图片预加载
    everyImgLoad(imgSrc) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.src = imgSrc
        img.onload = () => {
          resolve('imgLoadFinish')
        }
        img.onerror = () => {
          resolve('imgLoadError')
        }
      })
    }
  },
  mounted() {
    this.notificationParent()
  }
}
</script>

<style lang="css" scoped>
.waterfall-silde {
  position: absolute;
  transition: left 0.5s, top 0.5s;
  visibility: hidden;
}
.show {
  visibility: visible;
  animation: show-card 0.5s;
}
@keyframes show-card {
  0% {
    transform: translateY(50px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
