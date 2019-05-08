<template>

<div id="gameImgWrap" @touchstart.stop.prevent="handleTouchStart" @touchend.stop.prevent="handleTouchEnd" @touchmove.stop.prevent="handletouchMove" @touchcancel.stop.prevent="handleTouchCancel">
  <div v-for="(piece, index) in pieces" :id="'puzzle-'+index" class="puzzle" :data-index="piece" :style="getPieceStyle(index)"  >
  </div>
</div>

</template>

<script>
import HdGame from '@/lib/hdgame'
import query from '@/lib/query'
import { GameEndEvent } from '@/lib/GameEvent'
import GameArg from './GameArg'
var _gameOver = false;
//var firstFlag = true;
//var toggleFlag = true;

export default {
  name: 'game',
  props:{
    // hg, 保存游戏的所有资源，图片，音乐，时间，分数
    hg: Object,
    // 游戏初始化的状态
    command: {
      type: [String, Number],
      default: 0
    },
    imgUrl: String,
    x: {
      type: Number, // 猜图横向
      default: 3
    },
    y: {
      type: Number,  // 猜图纵向
      default: 4
    },
    width: {
      type: Number,  // 猜图总宽度
    },
    height: {
      type: Number,  // 猜图总宽度
    }
  },
  data () {
    return {
      pieces:[], //完整的图片切成一个个小图
      //this.img = img;
      w: 0,     //总宽度
      h: 0,     //总高度
      sizeW: 0, //每一块宽度
      sizeH: 0, //每一块高度
      size:0 , //x*y
      step: 0,
      lastTarget: null,
      currentTarget: null,
      wrapSelector: '#gameImgWrap'
    }
  },
  mounted(){
  },
  methods:{
    initGame(){
      //在 wrap 显示之后， clientWidth， clientHeight才有正确的值，然后初始化游戏
      //this.wrap = $(this.wrapSelector)

      this.img = this.imgUrl
      //let style = query(this.wrap).get( ['clientWidth', 'clientHeight'] )
      console.log( "initGame", " this.wrap", this.width, this.height)
      this.w = this.width
      this.h = this.height
      this.sizeW = Math.ceil(this.w / this.x);
      this.sizeH = Math.ceil(this.h / this.y);
      this.w = this.sizeW * this.x;
      this.h = this.sizeH * this.y;
      this.size = this.x * this.y;
      this.step = 0;
      this.lastTarget = null;
      this.currentTarget = null;
      this.create();
    },
    getPieceStyle( index){
      // 取得第index块图片的信息
      let piece = this.pieces[index]
      let currentPosition = this.getXY( index )
      let originPosition = this.getXY( piece )
console.log( "getPieceStyle", "piece=", piece, "xy=",originPosition)
      let style = {
        width: this.sizeW +'px',
        height: this.sizeH + 'px',
        left: currentPosition.x * this.sizeW+'px',
        top: currentPosition.y * this.sizeH + 'px',
        'background-image': `url('${this.img}')`,
        'background-size': `${this.w}px ${this.h}px`,
        'background-position': `${(-originPosition.x * this.sizeW)}px ${(-originPosition.y * this.sizeH)}px`
      }
      console.log( "piece style "+index, style)
      return style
    },
    create() {
      this.setPuzzle();
      if (this.step > this.size / 2) {
        this.setPuzzle();
      }
    },
    setPuzzle() { //分割拼图
      var arr = [];
      for (var i = 0; i < this.size; i++) {
        arr.push(i);
      }
      HdGame.shuffle(arr);
      for (let i = 0; i < this.y; i++) {
        for (let j = 0; j < this.x; j++) {
          var index = i * this.x + j;
          if (index == arr[index]) { //计算完成度
            this.step++;
          }
        }
      }
      this.pieces = arr
    },
    handleTouchStart(event){
      console.log( "handleTouchStart" )
      let that = this
      event.preventDefault();
      event.stopPropagation();
      if (_gameOver || that.currentTarget) {
        return;
      }
      console.log("handleTouchStart", "event = ", event)
      let target = event.target
      var touch = event.targetTouches[0];
      that.currentTarget = target;
      that.lastTarget = target;
      query(target).addClass('target');
      that.originalx = touch.pageX;
      that.originaly = touch.pageY;
      that.ox = parseFloat(event.target.style.left);
      that.oy = parseFloat(event.target.style.top);
      that.CD = 0;
      query(target).set({'z-index': '10'});
    },
    handletouchMove(event){
      event.preventDefault();
      event.stopPropagation();
      let that = this
      let target = event.target
      if (_gameOver || that.currentTarget !== target) {
        return;
      }
      if (that.CD++ < 2) return;
      that.CD = 0;
      var touch = event.targetTouches[0];
      var left = that.ox + touch.pageX - that.originalx;
      var top = that.oy + touch.pageY - that.originaly;
      if (left > 0 && left + that.sizeW < that.w) {
        target.style.left = left + 'px';
      }
      if (top > 0 && top + that.sizeH < that.h) {
        target.style.top = top + 'px';
      }
      var el = that.getTarget(target.style);
      console.log( "handletouchMove", "el=", el, "lastTarget=", that.lastTarget)
      if (el !== target && el !== that.lastTarget) {
        query(that.lastTarget).removeClass('checked');
        query(el).addClass('checked');
        that.lastTarget = el;
      }
    },
    handleTouchEnd(event){
      event.preventDefault();
      event.stopPropagation();
      let target = event.target
      if (_gameOver || this.currentTarget !== target) {
        return;
      }
      this.touchendFn();
    },
    handleTouchCancel(event){
      event.preventDefault();
      event.stopPropagation();
      let target = event.target
      if (_gameOver || this.currentTarget !== target) {
        return;
      }
      this.touchendFn();
    },
    touchendFn() {
      let that = this

      if (!that.currentTarget) {
        return;
      }
      query(that.currentTarget).set({ 'z-index': '0'})
      query(that.currentTarget).removeClass('target');
      query(that.lastTarget).removeClass('checked');
      var index1 = that.getIndexByOff(that.currentTarget.style);
      var index2 = that.getIndexById(that.currentTarget.id);
      console.log( "touchendFn", "that.currentTarget", that.currentTarget)
      that.swap(index1, index2);
      if (that.setStep()) {
         GameArg.eventBus.$emit( GameEndEvent.name, that)
      }
      that.currentTarget = null;
    },
    getTarget(off) {
      var index = this.getIndexByOff(off);
      return query('#puzzle-' + index).ele();
    },
    getIndex(x, y) {
      return y * this.x + x;
    },
    getXY(index) {
      return {
        x: index % this.x,
        y: ~~(index / this.x),
      };
    },
    getIndexByOff(off) {
      var x = ~~((parseFloat(off.left) + this.sizeW / 2) / this.sizeW);
      var y = ~~((parseFloat(off.top) + this.sizeH / 2) / this.sizeH);
      console.log( "getIndexByOff", "off=", off, `x=${x} y=${y}`, "index=", this.getIndex(x, y))
      return this.getIndex(x, y);
    },
    getIndexById(id) {
      return id.split('-')[1];
    },
    swap(index1, index2) {
      var el1 = query('#puzzle-' + index1).ele();
      var el2 = query('#puzzle-' + index2).ele();
      console.log( "swap"+index1 +index2, "el1=", el1, "el2=", el2 )
      this.setOffset(el1, index2);
      this.setOffset(el2, index1);
      el1.id = 'puzzle-' + index2;
      el2.id = 'puzzle-' + index1;
    },
    setOffset(el, index) {
      let xy = this.getXY(index);
      let pos = { 'left': (xy.x * this.sizeW)+'px', 'top': (xy.y * this.sizeH)+'px' }
      console.log("setOffset","index=",index, "xy=",xy, "pos=", pos, "el=",el )
      query(el).set(pos)
    },
    setStep() { //检测完成度
      var el, index;
      this.step = 0;
      for (var i = 0; i < this.size; i++) {
        el = query('#puzzle-' + i).ele();
        index = query(el).data('index');
        if (i == index) {
          this.step++;
        }
      }
      return this.step === this.size;
    }

  }
}

// class Puzzle {
//
//   constructor(el, img, x, y) {
//     var ranks = ptRanks.split('x');
//     this.wrap = el;
//     this.img = img;
//     this.x = x || parseInt(ranks[0]);
//     this.y = y || parseInt(ranks[1]);
//     this.w = this.wrap.width();
//     this.h = this.wrap.height();
//     this.sizeW = Math.ceil(this.w / this.x);
//     this.sizeH = Math.ceil(this.h / this.y);
//     this.w = this.sizeW * this.x;
//     this.h = this.sizeH * this.y;
//     this.size = this.x * this.y;
//     this.step = 0;
//     this.lastTarget = null;
//     this.currentTarget = null;
//     this.create();
//   }
//
//   create() {
//     this.setPuzzle();
//     if (this.step > this.size / 2) {
//       this.setPuzzle();
//     }
//     this.setTapEvent();
//   }
//   setPuzzle() { //分割拼图
//     var arr = [];
//     for (var i = 0; i < this.size; i++) {
//       arr.push(i);
//     }
//     HdGame.shuffle(arr);
//     var str = '';
//     for (let i = 0; i < this.y; i++) {
//       for (let j = 0; j < this.x; j++) {
//         var index = i * this.x + j;
//         var o = this.getXY(arr[index]);
//         str += '<div id="puzzle-' + index + '" class="puzzle" data-index=' + arr[index] + ' style="width:' + this.sizeW + 'px;height:' + this.sizeH + 'px;left:' + j * this.sizeW + 'px;top:' + i * this.sizeH + 'px;background-image:url(' + this.img + ');background-size:' + this.w + 'px ' + this.h + 'px;background-position:' + (-o.x * this.sizeW) + 'px ' + (-o.y * this.sizeH) + 'px;"></div>';
//         if (index == arr[index]) { //计算完成度
//           this.step++;
//         }
//       }
//     }
//     this.wrap.html(str);
//   }
//   setTapEvent() { //绑定事件
//     var that = this;
//
//     this.wrap.off('touchstart').on('touchstart', '.puzzle', function(event) {
//       event.preventDefault();
//       event.stopPropagation();
//       if (_gameOver || that.currentTarget) {
//         return;
//       }
//       var touch = event.originalEvent.targetTouches[0];
//       that.currentTarget = this;
//       that.lastTarget = $(this);
//       $(this).addClass('target');
//       that.originalx = touch.pageX;
//       that.originaly = touch.pageY;
//       that.ox = parseFloat(event.target.style.left);
//       that.oy = parseFloat(event.target.style.top);
//       that.CD = 0;
//       $(this).css('z-index', '10');
//     });
//     this.wrap.off('touchmove').on('touchmove', '.puzzle', function(event) {
//       event.preventDefault();
//       event.stopPropagation();
//       if (_gameOver || that.currentTarget !== this) {
//         return;
//       }
//       if (that.CD++ < 2) return;
//       that.CD = 0;
//       var touch = event.originalEvent.targetTouches[0];
//       var left = that.ox + touch.pageX - that.originalx;
//       var top = that.oy + touch.pageY - that.originaly;
//       if (left > 0 && left + that.sizeW < that.w) {
//         this.style.left = left + 'px';
//       }
//       if (top > 0 && top + that.sizeH < that.h) {
//         this.style.top = top + 'px';
//       }
//       var el = that.getTarget(this.style);
//       if (el[0] !== this && el !== that.lastTarget) {
//         that.lastTarget.removeClass('checked');
//         el.addClass('checked');
//         that.lastTarget = el;
//       }
//     });
//
//     this.wrap.off('touchend').on('touchend', '.puzzle', function(event) {
//       event.preventDefault();
//       event.stopPropagation();
//       if (_gameOver || that.currentTarget !== this) {
//         return;
//       }
//       touchendFn();
//     });
//     this.wrap.on('touchcancel', '.puzzle', function() {
//       event.preventDefault();
//       event.stopPropagation();
//       touchendFn();
//     });
//     var touchendFn = function() {
//       if (!that.currentTarget) {
//         return;
//       }
//       $(that.currentTarget).css('z-index', '0');
//       $(that.currentTarget).removeClass('target');
//       that.lastTarget.removeClass('checked');
//       var index1 = that.getIndexByOff(that.currentTarget.style);
//       var index2 = that.getIndexById(that.currentTarget.id);
//       that.swap(index1, index2);
//       if (that.setStep()) {
//          GameArg.eventBus.$emit( GameEndEvent.name, that)
//       }
//       that.currentTarget = null;
//     };
//   }
//   getTarget(off) {
//     var index = this.getIndexByOff(off);
//     return this.wrap.find('#puzzle-' + index);
//   }
//   getIndex(x, y) {
//     return y * this.x + x;
//   }
//   getXY(index) {
//     return {
//       x: index % this.x,
//       y: ~~(index / this.x),
//     };
//   }
//   getIndexByOff(off) {
//     var x = ~~((parseFloat(off.left) + this.sizeW / 2) / this.sizeW);
//     var y = ~~((parseFloat(off.top) + this.sizeH / 2) / this.sizeH);
//     return this.getIndex(x, y);
//   }
//   getIndexById(id) {
//     return id.split('-')[1];
//   }
//   swap(index1, index2) {
//     var el1 = query('#puzzle-' + index1).ele();
//     var el2 = query('#puzzle-' + index2).ele();
//     this.setOffset(el1, index2);
//     this.setOffset(el2, index1);
//     query(el1).attr({'id': 'puzzle-' + index2});
//     query(el2).attr({'id': 'puzzle-' + index1});
//   }
//   setOffset(el, index) {
//     var xy = this.getXY(index);
//     query(el).set({
//       'left': xy.x * this.sizeW,
//       'top': xy.y * this.sizeH
//     })
//   }
//   setStep() { //检测完成度
//     var el, index;
//     this.step = 0;
//     for (var i = 0; i < this.size; i++) {
//       index = query('#puzzle-' + i).data('index');
//
//       if (i == index) {
//         this.step++;
//       }
//     }
//     return this.step === this.size;
//   }
//
//
//
// }
</script>
