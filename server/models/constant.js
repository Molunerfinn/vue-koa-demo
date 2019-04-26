module.exports = {
  // created	   0 created	新建
  //		open	     1 open	开始签到
  //		ready	     2 ready	结束签到，准备开始
  //		starting	 3 starting	开始前倒计时中
  //		started	   4 started	游戏已开始
  //		completed	 5 completed	游戏已结束
  //		disabled	 6 disabled	游戏已关闭

  DpGameRoundStates: { created: 0, open: 1, ready:2, starting: 3, started:4, completed: 5, disabled: 6 },
  GameRoundStates: { created: 0, open: 1, ready:2, starting: 3, started:4, completed: 5, disabled: 6 }
}
