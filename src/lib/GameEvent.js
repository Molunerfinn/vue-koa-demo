
export class GameEvent{

  // type 返回当前 Event 对象表示的事件的名称。
  // target 返回触发此事件的元素（事件的目标节点）。
  constructor( target){
    this.target = target
  }
}


export class GameStartEvent extends GameEvent{
  static type = "GameStartEvent"
  constructor( target){
    super( target)
  }
}

export class GameEndEvent extends GameEvent{
  static type = "GameEndEvent"
  constructor( target){
    super( target)
  }
}

// 游戏背景音乐加载
export class GameBackgroundMusicLoadEvent extends GameEvent{
  static type = "GameBackgroundMusicLoadEvent"
  constructor( target){
    super( target)
  }
}
