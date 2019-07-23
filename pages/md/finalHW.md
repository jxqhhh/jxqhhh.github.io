# 综合实验日志

---

## 游戏的策划和功能

游戏玩法如下：

玩家首先需要选择游戏模式（包括人人对战模式和人机对战模式，人人模式暂未实现），若选择了人机对战模式还需选择游戏难度（简单/中等/困难）后方可正式开始游戏。

开始游戏后，玩家首先需要往己方的10*10棋盘上摆放3架飞机，要求摆放的3架飞机互不冲突，摆放过程中可以随时点击“重新布置”按钮，也可以点击“旋转”按钮改变飞机朝向后再摆放。摆放完成后，点击“放置完毕”即可进入对战状态。

在对战状态，界面上会同时显示己方和敌方棋盘，其中己方棋盘上玩家可以看到己方战机和敌方投掷在我放棋盘上的炸弹，敌方棋盘上会显示己方向其投掷的炸弹（但不会显示敌方未毁灭的飞机，只会显示敌方被我方击沉的战机）。玩家每回合需要在敌方棋盘上投放一个炸弹方可结束本回合（点击己方棋盘下面的确认按钮结束本回合），若投放的炸弹击中敌方机头则会直接击沉敌机，若命中敌机的机身其他部位则敌机生命值减少1（敌方共有3架飞机，己方和敌方的每架飞机初始生命值为5）。己方和敌方投放的炸弹都有三种不同的显示型态，分别对应未命中、命中机头、命中机身其他部位。
己方和敌方在各自回合都可以选择移动飞机（包括上下左右移动、顺时针旋转）（每回合最多移动一次，也可以不移动），初始时双方的可用移动次数都是3，每当一方击沉另一方的某架飞机后可用移动次数都会增加1。注意移动后飞机的位置不可以超出棋盘范围或者和其他飞机冲突，并且只有满血的飞机可以移动，否则移动无效。注意未命中的炸弹始终有效，这意味着如果移动飞机到未爆炸的炸弹位置，会引爆未爆炸的炸弹并改变炸弹形态。

若某一方率先击沉敌方所有战机，屏幕上会弹出一个结算窗口（若己方胜利，需点击己方棋盘下的确认按钮才会跳出结算窗口），该窗口上会显示出胜利方并且有一个重新开始的按钮（点该按钮返回最开始的游戏模式选择界面）。

---

## 界面布局和设计

游戏共有4个界面，分别为初始界面、难度选择界面（人机模式才会显示该界面）、准备界面、对战界面。

---

## 技术实现方案及重点

本作业基于Cocos Creator开发，其assets文件夹下存储有游戏源代码和素材文件。

我们的游戏使用了MVC架构，这也是我们技术实现上的一个重点。
在我们的项目中，assets/scripts/Global.js中定义了一个Global对象，该对象相当于MVC架构中的Model部分。Global对象有myPlanes属性，该属性的值为一个数组，存储了我方的全部飞机的位置、朝向、生命值等信息；Global对象的machinePlanes属性存储了人机模式中敌方飞机的信息；Global对象的myRemains、machineRemains属性分别存储了我方和敌方的剩余飞机数；Global对象的myGameType属性存储了游戏模式，有Global.gameType.renren和Global.gameType.renji两种合法取值。除此之外，assets/scripts/gameSceneScripts/Game.js中定义的组件的properties属性也和Model相关，比如properties中的bombs、enemyBombs对应对战过程中己方投掷的炸弹、敌方投掷的炸弹。

至于Controller部分和View部分，这里仅以gameScene为例（其他场景涉及到的代码量较少，这里就不作介绍）进行说明。

assets/scripts/gameSceneScripts/Game.js相当于对gameScene的controller，其提供的接口包括：
1. createBomb(evt)：该方法相应玩家点击敌方棋盘的事件，该方法首先会判断是否为玩家回合以及是否本回合已经投掷过炸弹以及是否在重复位置投掷炸弹，若为玩家回合、本回合未投掷过炸弹、投掷炸弹的位置之前未投掷过炸弹则修改Model中存储的值并调用其他的一些和View相关的函数来修改View，否则会给出相应的提示信息。
2. isHitPlane(bombPos, planes, bombs, player)：该方法有四个参数，其中bombPos表示投掷炸弹的位置、planes表示相对于投掷炸弹方的敌方的飞机数组、bombs表示投掷炸弹方之前已投掷过的炸弹的数组、player表示是玩家还是机器人投掷了本次炸弹。该方法返回值为一个object，object的hit属性表示投掷的炸弹是否miss还是hit body还是hit head，object的destroyed属性表示这枚炸弹是否击败了敌机，若击沉了则返回的object还会有pos、direction和id属性表示敌机的位置、朝向和id。
3. move(id, planes, bombs, direction, player) ：该方法有四个参数，其中id表示被移动的飞机的id，planes表示本次移动方的所有飞机组成的数组，bombs表示相对于移动方的敌方的炸弹数组，direction表示移动操作的类型（包括上下左右平移一格、顺时针旋转），player表示是玩家还是机器人进行了本次移动操作。该方法会判断移动后的飞机有没有超出边界或和棋盘上其他飞机（包括飞机残骸）相撞，如果是则返回{isMoveLegal: false}；否则判断飞机移动过程有没有撞到棋盘上尚未被引爆的炸弹，如果碰到了炸弹则修改bombs数组的值并返回{bombHit: bombObj, isMoveLegal: true}。
4. initTurn()：初始化玩家一方回合，修改Model中存储的一些属性值，并判断胜负。
5. myTurnFinished()：玩家回合结束时调用该方法，该方法会判断胜负，若为人机模式，该方法还会调用machinePlay()让机器人玩家进行操作。
6. machinePlay()：该方法实现了机器人玩家的操作，通过一些策略给出机器人的操作方式，并根据操作结果调用相应的函数重绘UI。

上面介绍完了gameScene的Controller部分，接下来介绍gameScene的View部分。
View部分主要有四种情况，包括己方投掷炸弹后重新绘制敌方棋盘、己方移动飞机后重新绘制己方棋盘、敌方向我方投掷炸弹后重新绘制己方棋盘、敌方移动后碰到我方炸弹导致坠机后重新绘制UI。具体来说， assets/scripts/gameSceneScripts/enemyBoard.js中的paint方法实现了己方投掷炸弹后重新绘制敌方棋盘，assets/scripts/gameSceneScripts/direction.js中的repaintMyBoardAfterMove方法实现了己方移动飞机后重新绘制己方棋盘，assets/scripts/gameSceneScripts/myBoard.js中的repaintMyBoardAfterEnemyThrowBomb方法实现了敌方向我方投掷炸弹后重新绘制己方棋盘，assets/scripts/gameSceneScripts/enemyBoard.js中的repaintAfterMachineMove方法实现了敌方移动后碰到我方炸弹导致飞机被击毁时重新绘制UI。


