/** @language chinese
 * <p>开发者常见问题</p>
 * @class Q & A (常见问题)
 */
/** @language english
 * <p>Development FAQ</p>
 * @class Q & A
 */
/** @language japanese
 * <p>開発者よくある質問</p>
 * @class Q & A
 */


/** @language chinese
 * <p>因为新版API还在继续更新，lib文件夹下的文件都属于外部库，还未完全添加到新的api文档中，请先查看旧版API，旧版api地址如下：</p>
 * <p><a href="http://lufylegend.com/lufylegend/oldapi" target="_blank">http://lufylegend.com/lufylegend/oldapi</a></p>
 * @property 1,找不到相关API：为什么有些类和属性API中找不到？
 */
/** @language chinese
 * 引擎提供了自动全屏适配的设置，请参考<a href="全屏设置.html">全屏设置</a>部分。
 * @property 1,自动适配：如何自动适配不同大小的屏幕。
 */
/** @language chinese
 * 一般这个问题，都是因为将游戏的刷新速度当成了FPS来设置了，在引擎初始化函数LInit中设置的速度speed是游戏画面的刷新速度，这个速度speed与FPS之间的关系为FPS=1000/speed。
 * @property 2,FPS很低：游戏画面很简单，但是为什么FPS就是上不去？
 */
/** @language chinese
 * 这个一般是由LBitmap的旋转导致的，LBitmap对象默认是以自身的中心为参考点来进行旋转的，这个旋转会导致碰撞以及鼠标点击事件发生错位，解决的办法就是通过设置rotateCenter的值，取消LBitmap对象的旋转中心。
 * @property 3,碰撞失效：为什么对象进行了旋转之后鼠标点击或者碰撞失效了？
 * @example
 * 	var bitmap = LBitmap(bitmapData);
 * 	bitmap.rotateCenter = false;
 */
/** @language chinese
 * <p>对象旋转一般是指LBitmap和LSprite对象的旋转，如果要改变旋转的中心点，请参考下面这个帖子中介绍的方法。</p>
 * <p><a href="http://lufylegend.com/forum/forum.php?mod=viewthread&tid=17755" target="_blank">关于对象的旋转中心和缩放中心的设置</a></p>
 * @property 4,旋转中心点：关于如何设置旋转中心点的问题。
 */
/** @language chinese
 * 这是因为lufylegend中拦截了触屏事件导致的，可以通过设置LGlobal.preventDefault的值来禁止拦截触屏事件。
 * @property 5,链接,滚屏失效：移动开发中，页面引入lufylegend之后，页面的触屏事件失效了，链接也无法点击了，无法滚动屏幕了。
 * @example
 * 	LGlobal.preventDefault = false;
 */
/** @language chinese
 * 这可能是你音频加载完成之后，没有移除相应的加载事件导致的。
 * @property 6,音频不断重复播放：有些浏览器中音频会不断的重复播放？
 */
/** @language chinese
 * <p>使用LGraphics来绘制图形的时候，每个绘图指令都会以单个元素储存到数组当中，如果不断的添加绘图指令，而又要保留原有的图形，就会使绘图指令不断增加，导致每桢需要执行的绘图指令增加，所以会越来越卡。</p>
 * <p>解决的办法，一个是将绘制的图形及时的转为LBitmapData对象。或者利用LBitmapData的setPixels或者putPixels等函数来绘图。</p>
 * <p>一个持续绘图的例子：<a href="../../../api/Q_and_A/drawEM.html" target="_blank">drawEM demo</a></p>
 * @property 7,持续绘图：不断的绘制图形，导致游戏越来越卡怎么办？
 */