var g_rem = 20;

var GameArg = {
  createTime: 0.8,
  clubH: 2.625, //支架高
  lollyH: 3.625, //棒棒糖高
  lollyW: 1, //棒棒糖宽
  lollyY: 3, //棒棒糖离圆心距离
  launchY: 13.625, //棒棒糖发射停止位置
  minRotate: 9, //最小间距角度
  touchLimit: 1 * g_rem,
  first: true,
  firstTouch: true
};

//HdGame.initCallBack(hg, ["startGame", "beforeStartGame", "startGamehead", "home", "again", "jsFootEnd", "showResult", "changeBottomBar", "showPoup", "hidePoup", "timeChange", "beforeDraw", "updateRankList", "afterDraw", "editBackground", "luckDrawErr", "scrollEvent", "beforeStartGiftEvent"]);
//hg.register(["setGameType", "hpInit", "hgLoadEnd", "save", "changeShow", "showTabByStyle", "changeAwardNum", "changeAwardImg", "changeContactImg", "isLimit", "changeTopBar", "advertisingSetting", "bannerNumberChange", "questionNumSet"]);

export { GameArg, g_rem }
