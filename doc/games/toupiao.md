#0 游戏入口
# /ztoupiao 在前server无法接收到请求，最后ztoupiao.html返回，所以这里需要以/entry开始。
/ztoupiao/:number/entry
/entry/:code/:number

#1. 页面

首页介绍活动  /
作品页，所有活动参与作品 /works
  最新：按照作品的创建时间排序，时间早，排序前
  最热：按照得票数排序，票高在前

参加页，提交参与活动作品信息 /apply
作品页详情页  /works/:album_id
活动主办者描述 /desc
活动参与者描述 /my

#投票规则
1. 活动期间 n次
2. 周期次数 x天y票,  每 x 天有 y票可以投
   如：7天5票，即游戏开始0-7天内，玩家可以投5票，8-14天内可以投5票
      如果游戏周期为15天，第15天也可投5票

# 图片瀑布流组件
https://www.npmjs.com/package/vue-waterfall-adaptive
