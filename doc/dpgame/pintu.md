## 项目文件说明

-   管理端API，创建游戏

    server/controllers/api/dpgame/pintu

-   游戏过程api，如取得游戏基本信息， 包括大屏端和管理端

    server/controllers/gapi/dpgame/pintu

-   游戏socketio, 实现游戏与服务器的实时双向通信

    server/sockets/dpgame/pintu

-   游戏使用 db

    server/schema/dpgame/pintu

-   游戏运行控制，根据游戏进程调整游戏状态

    server/models/dpgame/pintu/runner

## url
control
http://localhost:8080/pintu-control.html?number=xxx
play
http://localhost:8080/pintu-play.html

## 规则
# 手机端
0. 游戏首页可以查看游戏规则
1. 玩家拼出图片，实时显示玩家成绩。
2. 玩家关闭游戏，重新进入，如果游戏结束，显示玩家成绩。
   如果游戏没有结束，同时玩家上次已经拼出图片，显示玩家成绩。
   如果游戏没有结束，同时玩家上次没有拼出图片，玩家重新开始。
#大屏端
1. 游戏未开始，用户可以扫二维码签到
2. 游戏开始后，用户扫二维码也无法加入游戏
3. 游戏结束后，用户进入时，直接显示成绩页面，如果没有注册过，也不走注册流程。
