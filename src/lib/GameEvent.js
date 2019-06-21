
export class GameEvent{

  // type 返回当前 Event 对象表示的事件的名称。
  // target 返回触发此事件的元素（事件的目标节点）。
  constructor( target){
    this.target = target
  }
}


export class GameStartEvent extends GameEvent{
  constructor( target){
    super( target)
    // 必须设置 name，babel处理后 name 为 'e'
    this.name = 'GameStartEvent'
  }
}

export class GameEndEvent extends GameEvent{
  constructor( target){
    super( target)
    this.name = 'GameEndEvent'
  }
}

// 得分事件
export class GameScoreChangedEvent extends GameEvent{
  constructor( target, changedScore){
    super( target)
    this.name = 'GameScoreChangedEvent'
    this.changedScore = changedScore
  }
}

// 游戏背景音乐加载
export class GameBackgroundMusicLoadEvent extends GameEvent{
  constructor( target){
    super( target)
    this.name = 'GameBackgroundMusicLoadEvent'
  }
}
