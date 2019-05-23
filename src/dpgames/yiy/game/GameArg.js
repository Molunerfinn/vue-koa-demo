import {  EventBus } from '@/lib/EventBus'

const rem = window.g_rem;


// 对游戏的配置
const GameArg = {
  firstFlag: true,
  toggleFlag: true,
  ptRanks: '3x4',
  rem: rem,
  eventBus: EventBus
};

//HdGame.initCallBack(hg, ["startGame", "beforeStartGame", "startGamehead", "home", "again", "jsFootEnd", "showResult", "changeBottomBar", "showPoup", "hidePoup", "timeChange", "beforeDraw", "updateRankList", "afterDraw", "editBackground", "luckDrawErr", "scrollEvent", "beforeStartGiftEvent"]);
//hg.register(["setGameType", "hpInit", "hgLoadEnd", "save", "changeShow", "showTabByStyle", "changeAwardNum", "changeAwardImg", "changeContactImg", "isLimit", "changeTopBar", "advertisingSetting", "bannerNumberChange", "questionNumSet"]);

export default GameArg
