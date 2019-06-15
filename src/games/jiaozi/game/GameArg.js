import {  EventBus } from '@/lib/EventBus'

var g_rem = window.g_rem;


// 对游戏的配置
var GameArg = {
  createTime : 0.8,
  touchLimit : 1*g_rem,
  first      : true,  
  layer : null,
  firstTouch: true, // 是不是第一次点击开始, 是否需要初始化游戏
  gameFirstTouch: true, // 是不是第一次点击游戏界面，游戏是否开始
  eventBus: EventBus
};

//HdGame.initCallBack(hg, ["startGame", "beforeStartGame", "startGamehead", "home", "again", "jsFootEnd", "showResult", "changeBottomBar", "showPoup", "hidePoup", "timeChange", "beforeDraw", "updateRankList", "afterDraw", "editBackground", "luckDrawErr", "scrollEvent", "beforeStartGiftEvent"]);
//hg.register(["setGameType", "hpInit", "hgLoadEnd", "save", "changeShow", "showTabByStyle", "changeAwardNum", "changeAwardImg", "changeContactImg", "isLimit", "changeTopBar", "advertisingSetting", "bannerNumberChange", "questionNumSet"]);

export { GameArg, g_rem }
