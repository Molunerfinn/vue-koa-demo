import { initializeCallback } from './helpers'

/// 游戏分数
function Grade( initial ){
  this.val = 0
  initializeCallback(this, ["setGrade"]);
  this.set(  initial )
}

Grade.prototype.set = function( val ){
  this.val = val;
  this.val < 0 && (this.val = 0);
  console.log( " Grade->this ", this)
  this.fire("setGrade", this.val);
}

Grade.prototype.inc = function( dv ){
  this.set(  this.val + dv )
}

export default Grade
