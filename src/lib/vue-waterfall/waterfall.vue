<template>
  <div
    class="waterfall"
    :class="{resize, 'loading-show': (loading && !mount) || finished}"
    :style="waterfallStyle"
    ref="waterfall"
  >
    <slot></slot>
    <div
      class="loading-warp"
      v-show="!mount"
      v-if="loading"
    >
      <span
        class="loading"
        :style="{color: this.loadingColor}"
      >
        <i
          v-for="(item, index) in 12"
          :key="index"
        ></i>
      </span>
    </div>
    <div
      class="finished"
      v-if="finished"
    >{{ finishedTxt }}</div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
export default {
  name: 'waterfall',
  provide() {
    return {
      parent: this
    }
  },
  props: {
    // 起始top值
    top: {
      type: Number,
      default: 0
    },
    // 上下间隔
    topInterval: {
      type: Number,
      default: 0
    },
    // 左右间隔
    leftInterval: {
      type: Number,
      default: 0
    },
    // 瀑布流宽度
    width: {
      type: Number
    },
    // 加载的颜色
    loadingColor: {
      type: String,
      default: '#969799'
    },
    // 是否需要菊花加载图
    loading: {
      type: Boolean,
      default: false
    },
    // 滚动条距离底部小于 offset 时触发 load 事件
    offset: {
      type: Number,
      default: 200
    },
    // 是否处于加载状态，加载过程中不触发 load 事件
    finished: {
      type: Boolean,
      default: false
    },
    // 全部加载完成文本
    finishedTxt: {
      type: String,
      default: '没有更多了~'
    }
  },
  data() {
    return {
      // 瀑布流外包裹高度
      waterfallBoxHeight: 0,
      // 触发滚动的最小高度
      scrollMinHeight: 0,
      // 瀑布流没列个数
      rowNumber: 0,
      // 初始数据
      initData: null,
      // 子元素
      childrens: [],
      // 已经有位置的子元素
      allChildren: [],
      // 瀑布流每个的宽度
      slideWidth: 0,
      // 是否更新视口
      resize: false,
      // 起始 left 值
      left: 0,
      // 是否挂载完成
      mount: false
    }
  },
  methods: {
    // 获取初始 left 值
    getLeftValue() {
      this.left =
        (this.$refs.waterfall.clientWidth -
          this.slideWidth * this.rowNumber -
          (this.rowNumber - 1) * this.leftInterval) /
        2
    },
    // 获取瀑布流没列个数
    getRowNumber() {
      this.rowNumber = Math.floor(
        this.$refs.waterfall.clientWidth / (this.slideWidth + this.leftInterval)
      )
      console.log( "this.rowNumber =", this.rowNumber,this.$refs.waterfall.clientWidth, this.slideWidth)
    },
    // 获取silde宽度
    getSildeWidth() {
      if (this.width) {
        this.slideWidth = this.width
      }
      if (this.allChildren.length) {
        //this.slideWidth = this.allChildren[0].$el.offsetWidth
        let computedWidth = window.getComputedStyle(this.allChildren[0].$el, null).getPropertyValue('width')
        this.slideWidth = parseFloat( computedWidth )

      }

    },
    // 初始数据
    getInitData() {
      this.initData = Array.from({ length: this.rowNumber }).map(
        (item, index) => {
          return {
            top: this.top,
            left: this.left + (this.slideWidth + this.leftInterval) * index
          }
        }
      )
    },
    // 计算瀑布流dom位置
    async waterFall(children) {
      for (let i = 0; i < children.length; i++) {
        await children[i].getHeight(i)
      }
      console.log( " this.initData ", this.initData, children )
      children.forEach((item, index) => {
        item.top = this.initData[0].top
        item.left = this.initData[0].left
        this.initData[0].top += item.height + this.topInterval
        item.init = true
        this.initData.sort((a, b) => {
          return a.top - b.top
        })
      })
      this.childrens = []
      this.waterfallBoxHeight = [...this.initData].pop().top
      this.scrollMinHeight = [...this.initData].shift().top
      this.mount = true
    },
    // 更新布局
    _refreshWaterfall() {
      this.getSildeWidth()
      this.getRowNumber()
      this.getLeftValue()
      this.getInitData()
      this.waterFall(this.allChildren)
    },
    // 初始化
    _initWaterfall() {
      this.getSildeWidth()
      this.getRowNumber()
      this.getLeftValue()
      this.getInitData()
    },
    // 滚动判断，加载更多
    handleScroll() {
      console.log( "handleScroll。。。")

      let waterfall = this.$refs.waterfall
      if (!waterfall || !this.mount || this.finished) return
      let scrollTop = document.scrollingElement.scrollTop
      let waterfallButtom =
        waterfall.offsetTop + this.scrollMinHeight - this.offset - innerHeight
      if (scrollTop > waterfallButtom) {
        this.$emit('load')
        this.mount = false
      }
    }
  },
  computed: {
    // 视口变化
    resizeBindFn() {
      return debounce(this._refreshWaterfall, 100)
    },
    // 滚动
    scrollBindFn() {
      return throttle(this.handleScroll, 200)
    },
    // 获取瀑布流主体高度
    waterfallStyle() {
      return { height: this.waterfallBoxHeight + 'px' }
    }
  },
  watch: {
    // 监听瀑布流子级变化
    childrens(val) {
      if (!val.length) return
      if (!this.initData) {
        this._initWaterfall()
      }
      this.mount = false
      this.waterFall(val)
    },
    // 监听是否加载完成
    finished(val) {
      if (val) {
        window.removeEventListener('scroll', this.scrollBindFn)
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeBindFn)
    window.addEventListener('scroll', this.scrollBindFn)
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeBindFn)
    window.removeEventListener('scroll', this.scrollBindFn)
  }
}
</script>

<style lang="css" scoped>
.waterfall {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.loading-show {
  padding-bottom: 100px;
}
.loading-warp {
  width: 30px;
  height: 30px;
  position: absolute;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
}
.loading {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  animation: loading-rotate 0.8s linear infinite;
  animation-timing-function: steps(12);
  position: relative;
  display: inline-block;
  i {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    &::before {
      width: 2px;
      height: 25%;
      content: ' ';
      display: block;
      margin: 0 auto;
      border-radius: 40%;
      background-color: currentColor;
    }
  }
}
.finished {
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #969799;
  line-height: 50px;
  position: absolute;
  bottom: 20px;
}

@keyframes loading-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
/*
.generate-spinner(@n, @i: 1) when (@i =< @n) {
  .loading i:nth-of-type(@{i}) {
    opacity: 1 - (0.75 / 12) * (@i - 1);
    transform: rotate(@i * 30deg);
  }
  .generate-spinner(@n, (@i + 1));
}
.generate-spinner(12);
*/
</style>
