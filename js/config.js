// 游戏相关的配置文件

// 存储地图对象
var gridData = [];

// 行与列
var tr = 30;
var td = 30;

// 蛇的身体大小
var snakeBody = 20;

// 要明确新蛇头与旧蛇头的位置关系  用于做计算用的
var directionNum = {
  left: { x: -1, y: 0, flag: "left" },
  right: { x: 1, y: 0, flag: "right" },
  top: { x: 0, y: -1, flag: "top" },
  bottom: { x: 0, y: 1, flag: "bottom" },
};
// 蛇的信息
var snake = {
  // 蛇一开始移动的方向
  direction: directionNum.right,
  // 蛇初始的位置
  snakePos: [
    { x: 0, y: 0, domContent: "", flag: "body" },
    { x: 1, y: 0, domContent: "", flag: "body" },
    { x: 2, y: 0, domContent: "", flag: "body" },
    { x: 3, y: 0, domContent: "", flag: "head" },
  ],
};

// 食物的信息
var food = {
  x: 0,
  y: 0,
  domContent: "",
};

// 游戏分数
var score = 0;

// 计时器
var timerStop;
