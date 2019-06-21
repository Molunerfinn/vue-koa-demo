
export class GameEvent{

  // type 返回当前 Event 对象表示的事件的名称。
  // target 返回触发此事件的元素（事件的目标节点）。
  constructor( target){
    this.target = target
  }
}


export class GameStartEvent extends GameEvent{
  // 必须设置 eventname，babel处理后 函数名为 'e'， 所有name 为 'e'
  static ename = 'GameStartEvent'
  constructor( target){
    super( target)
  }
}

export class GameEndEvent extends GameEvent{
  static ename = 'GameEndEvent'
  constructor( target){
    super( target)
  }
}

// 得分事件
export class GameScoreChangedEvent extends GameEvent{
  static ename = 'GameScoreChangedEvent'
  constructor( target, changedScore){
    super( target)
    this.changedScore = changedScore
  }
}

// 游戏背景音乐加载
export class GameBackgroundMusicLoadEvent extends GameEvent{
  static ename = 'GameBackgroundMusicLoadEvent'
  constructor( target){
    super( target)
  }
}
