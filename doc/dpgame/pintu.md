项目文件说明

1. 管理端API，创建游戏

  server/api/dpgame/pintu

2. 游戏过程api，如取得游戏基本信息， 包括大屏端和管理端

  server/gapi/dpgame/pintu

3. 游戏socketio, 实现游戏与服务器的实时双向通信

  server/sockets/dpgame/pintu

4. 游戏使用 db

  server/schema/dpgame/pintu

5. 游戏运行控制，根据游戏进程调整游戏状态

  server/models/dpgame/pintu/runner
