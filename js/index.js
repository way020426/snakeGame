/*
    绘制蛇的方法
 */
function drawSnake(snake) {
  for (var i = 0; i < snake.snakePos.length; i++) {
    if (!snake.snakePos[i].domContent) {
      // 第一次创建蛇
      snake.snakePos[i].domContent = document.createElement("div");
      snake.snakePos[i].domContent.style.position = "absolute";
      snake.snakePos[i].domContent.style.width = snakeBody + "px";
      snake.snakePos[i].domContent.style.height = snakeBody + "px";
      snake.snakePos[i].domContent.style.left =
        snake.snakePos[i].x * snakeBody + "px";
      snake.snakePos[i].domContent.style.top =
        snake.snakePos[i].y * snakeBody + "px";
      if (snake.snakePos[i].flag === "head") {
        // 蛇头
        snake.snakePos[i].domContent.style.background =
          'url("../imgs/snake_head.png") center/contain no-repeat';
        // 旋转蛇头
        switch (snake.direction.flag) {
          case "top": {
            snake.snakePos[i].domContent.style.transform = `rotate(-90deg)`;
            break;
          }
          case "bottom": {
            snake.snakePos[i].domContent.style.transform = `rotate(90deg)`;
            break;
          }
          case "right": {
            snake.snakePos[i].domContent.style.transform = `rotate(0deg)`;
            break;
          }
          case "left": {
            snake.snakePos[i].domContent.style.transform = `rotate(180deg)`;
            break;
          }
        }
      } else {
        //  蛇身
        snake.snakePos[i].domContent.style.background = "orange";
        snake.snakePos[i].domContent.style.borderRadius = "50%";
      }
    }
    //  需要把创建的 DOM 元素添加到 container 容器上面。
    document.querySelector(".container").append(snake.snakePos[i].domContent);
  }
}

/*
    绘制食物
*/
function drawFood() {
  // 食物坐标随机
  // 食物生成在container容器内除蛇身上。
  while (true) {
    // 无限生成食物，直到找到一个符合上述条件的食物退出循环
    var isRepeat = false;
    food.x = Math.floor(Math.random() * tr);
    food.y = Math.floor(Math.random() * td);
    // 看当前得到的食物坐标是不是符合要求
    for (var i = 0; i < snake.snakePos.length; i++) {
      if (snake.snakePos[i].x === food.x && snake.snakePos[i].y === food.y) {
        // 当前生成的食物坐标在蛇身上
        isRepeat = true;
        break;
      }
    }
    if (!isRepeat) {
      break;
    }
  }
  if (!food.domContent) {
    food.domContent = document.createElement("div");
    food.domContent.style.width = snakeBody + "px";
    food.domContent.style.height = snakeBody + "px";
    food.domContent.style.position = "absolute";
    food.domContent.style.background =
      'url("../imgs/food.png") center/contain no-repeat';
    document.querySelector(".container").append(food.domContent);
  }
  food.domContent.style.left = food.x * snakeBody + "px";
  food.domContent.style.top = food.y * snakeBody + "px";
}
/*
    初始化游戏方法
    1.初始化地图
    2.绘制蛇
    3.绘制食物
*/
function initGame() {
  // 1.初始化地图
  for (var i = 0; i < tr; i++) {
    for (var j = 0; j < td; j++) {
      gridData.push({
        x: j,
        y: i,
      });
    }
  }
  // console.log(gridData);
  // 2.绘制蛇
  drawSnake(snake);
  // 3.绘制食物
  drawFood();
}

/**
 * 碰撞检测
 */
function isCollide(newHead) {
  var collideCheckInfo = {
    isColl: false,
    isEat: false,
  };
  // 检测是否碰到墙壁
  if (newHead.x < 0 || newHead.x >= td || newHead.y < 0 || newHead.y >= tr) {
    collideCheckInfo.isColl = true;
  }

  // 检测是否碰到身体
  for (var i = 0; i < snake.snakePos.length; i++) {
    if (
      snake.snakePos[i].x === newHead.x &&
      snake.snakePos[i].y === newHead.y
    ) {
      collideCheckInfo.isColl = true;
    }
  }

  // 检测是否吃到食物
  if (newHead.x === food.x && newHead.y === food.y) {
    collideCheckInfo.isEat = true;
    score++;
  }
  return collideCheckInfo;
}

/**
 * 蛇的移动
 */
function snakeMove() {
  var oldHead = snake.snakePos[snake.snakePos.length - 1];
  // 根据方向计算出新的蛇头的坐标
  var newHead = {
    domContent: "",
    x: oldHead.x + snake.direction.x,
    y: oldHead.y + snake.direction.y,
    flag: "head",
  };

  // 做碰撞检测  看新的蛇头有没有碰到食物 墙壁 身体
  var collideCheckResult = isCollide(newHead);
  if (collideCheckResult.isColl) {
    // 游戏结束
    if (
      window.confirm(`
        游戏结束，您当前的得分为${score}分，是否要重新开始游戏？
    `)
    ) {
      // 重新开始游戏
      // window.location.reload();
      document.querySelector(".container").innerHTML = `
            <!-- 开始游戏按钮 -->
            <button class="startBtn" style="display:none"></button>
            <!-- 暂停游戏按钮 -->
            <button class="pauseBtn" style="display:none"></button>
        `;
      score = 0;
      snake = {
        direction: directionNum.right,
        snakePos: [
          { x: 0, y: 0, domContent: "", flag: "body" },
          { x: 1, y: 0, domContent: "", flag: "body" },
          { x: 2, y: 0, domContent: "", flag: "body" },
          { x: 3, y: 0, domContent: "", flag: "head" },
        ],
      };
      food = {
        x: 0,
        y: 0,
        domContent: "",
      };
      initGame();
    } else {
      // 结束游戏
      document.onkeydown = null;
      clearInterval(timerStop);
    }
    return;
  }
  // 将旧的头改为身体
  oldHead.flag = "body";
  oldHead.domContent.style.background = "orange";
  oldHead.domContent.style.borderRadius = "50%";
  snake.snakePos.push(newHead);
  // 判断是否吃到东西了
  if (collideCheckResult.isEat) {
    // 生成新的食物
    drawFood();
  } else {
    // 没吃到食物  移除最后一个
    document
      .querySelector(".container")
      .removeChild(snake.snakePos[0].domContent);
    snake.snakePos.shift();
  }
  // 重新绘制蛇
  drawSnake(snake);
}

/**
 *  计时器自动调用蛇移动的方法
 */
function startGame() {
  timerStop = setInterval(function () {
    snakeMove();
  }, 150);
}

/*
    绑定事件
 */
function bindEvent() {
  // 键盘事件
  document.onkeydown = function (e) {
    if (
      (e.key.toLocaleLowerCase === "w" || e.key === "ArrowUp") &&
      snake.direction.flag !== "bottom"
    ) {
      // 上
      snake.direction = directionNum.top;
    }
    if (
      (e.key.toLocaleLowerCase === "s" || e.key === "ArrowDown") &&
      snake.direction.flag !== "top"
    ) {
      // 下
      snake.direction = directionNum.bottom;
    }
    if (
      (e.key.toLocaleLowerCase === "a" || e.key === "ArrowLeft") &&
      snake.direction.flag !== "right"
    ) {
      // 左
      snake.direction = directionNum.left;
    }
    if (
      (e.key.toLocaleLowerCase === "d" || e.key === "ArrowRight") &&
      snake.direction.flag !== "left"
    ) {
      // 右
      snake.direction = directionNum.right;
    }
    snakeMove();
  };
  // 计时器自动调用蛇移动的方法
  startGame();

  document.querySelector(".container").onclick = function (e) {
    // 事件委托的形式判断点击的是 container 还是 pauseBtn
    if (e.target.className === "container") {
      // 点击 container 暂停
      document.querySelector(".pauseBtn").style.display = "block";
      clearInterval(timerStop);
    } else {
      // 点击暂停按钮继续游戏
      document.querySelector(".pauseBtn").style.display = "none";
      startGame();
    }
  };
}

/*
    游戏的主方法
 */
function main() {
  // 点击开始游戏之后再继续工作
  document.querySelector(".startBtn").onclick = function (e) {
    document.querySelector(".startBtn").style.display = "none";
    e.stopPropagation();
    // 初始化游戏
    initGame();

    // 绑定时间
    bindEvent();
  };
}

main();
