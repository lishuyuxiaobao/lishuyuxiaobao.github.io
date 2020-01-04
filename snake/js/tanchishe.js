window.onload = function(){
	//贪吃蛇所在的地图
	var snakeMap = document.getElementById("snakeMap");
	var score = document.getElementById("score");
	//为了灵活的创建地图，将地图的行数he列数存储到变量中
	var rowNumber = 24;//存储行数
	var colNumber = 16;//存储列数
	var smallDivW = 20;//每个小方格的宽高
	//地图实际大小
	snakeMap.style.width = smallDivW * colNumber + "px";
	snakeMap.style.height = smallDivW * rowNumber + "px";
	
	var divsSnake = [];//二维数组  存储地图上所有位置的表格（为了获取div位置）
	var rowArr;
	
	
	
	//使用双层for循环
	for(var i = 0;i < rowNumber; i++){
		//创建行所在的div，每行的div插入到该行的div
		var rowDiv = document.createElement("div");
		rowDiv.style.height = smallDivW + "px";
		snakeMap.appendChild(rowDiv);	
		//创建一个数组，用来存储每一行的所有表格
		rowArr = [];
		for(var j = 0; j < colNumber;j++){
			//创建每行的小div
			var colDiv = document.createElement("div");
			colDiv.style.width = smallDivW + "px";
			colDiv.style.height = smallDivW + "px";
			colDiv.className = "col";
			// 将该行的div插入到rowDiv中
			rowDiv.appendChild(colDiv);	
			//将该行的表格添加到数组中
			rowArr.push(colDiv);
			
		}
		//将行数组中的div全部添加到二维数组中
		divsSnake.push(rowArr);
	}
	console.log(divsSnake);
	//创建数组存储蛇身所占的div，默认前三个是蛇身体
	var snakeBodys = [];
	for(var i = 0;i < 3;i++){
		snakeBodys.push(divsSnake[0][i]);
		// 设置蛇身颜色
		divsSnake[0][i].className = "col moveSnake";
	}
	//设置一个变量，存储蛇移动的方向
	// 假设 left right top bottom分别代表四个方向
	var directionSnake = "right";
	//添加键盘事件，通过按键的方向上下左右，控制蛇移动的方向
	document.onkeydown = function(e){
		var event1 = window.event || e;
		//判断几个特殊情况，为了合理性，蛇头和蛇尾不能交换方向
		//例如： 蛇向右移动不能点击左按钮
		if(directionSnake == "right" && event1.keyCode == 37){
			return;//提前终止函数
		}else if(directionSnake == "left" && event1.keyCode == 39){
			return;//提前终止函数
		}else if(directionSnake == "top" && event1.keyCode == 40){
			return;//提前终止函数
		}else if(directionSnake == "bottom" && event1.keyCode == 38){
			return;//提前终止函数
		}
		
		//点击不同的按键，重新设置蛇移动的方向
		switch(event1.keyCode){
			case 37:{//左
				directionSnake = "left";
				break;
			}
			case 38:{//上
				directionSnake = "top";
				break;
			}
			case 39:{//右
				directionSnake = "right";				
				break;
			}
			case 40:{//下
				directionSnake = "bottom";
				break;
			}
			default:
				return;
		}
		console.log(directionSnake);		
	}
	
	//移动端的轻扫手势
	touch.on(document,"touchstart",function(e){
		var event1 = window.event || e;
		event1.preventDefault();
		
	})
	//右轻扫
	touch.on(document,"swiperight",function(){
		if(directionSnake == "left"){
			return;
		}
		directionSnake = "right"		
	})
	//左轻扫
	touch.on(document,"swipeleft",function(){
		if(directionSnake == "right"){
			return;
		}
		directionSnake = "left"		
	})
	//上轻扫
	touch.on(document,"swipeup",function(){
		if(directionSnake == "bottom"){
			return;
		}
		directionSnake = "top"		
	})
	//下轻扫
	touch.on(document,"swipedown",function(){
		if(directionSnake == "top"){
			return;
		}
		directionSnake = "bottom"		
	})
	
	
	
	
	
	//存储蛇头所在的位置坐标   --- 默认第一行第三个单元格
	var x = 2;//记录蛇头所在位置
	var y = 0;
	var foodX = 0;//随机食物所在的位置
	var foodY = 0;
	
	//处理蛇的移动
	var scoreNum = 0;//存储得分
	var speed = 400;//蛇速度
	var timerMove;
	move(speed);
	function move(speed){
		timerMove = setInterval(function(){
			//判断蛇移动的方向，从而设置移动的位置
			switch(directionSnake){
				case "left":{//左移动
					x--;
					break;
				}
				case "right":{//右移动
					x++;
					break;
				}
				case "top":{//上移动
					y--;
					break;
				}
				case "bottom":{//下移动
					y++;
					break;
				}
				default:
					return;
			}
			//为了合理性，判断蛇碰到墙壁gameover
			if(x < 0 || y < 0 || x >= colNumber || y >= rowNumber){
				//清除蛇移动的定时器
				clearInterval(timerMove);
				alert("游戏结束")
				return;//终止
			}
			//如果蛇即将移动的位置div是蛇之前的身体所在的div游戏结束
			for(var i = 0;i<snakeBodys.length;i++){
				//蛇身体div和移动的div对比
				if(snakeBodys[i] == divsSnake[y][x]){
					clearInterval(timerMove);
					alert("游戏结束")
					return;
				}
			}
			//设置蛇身长度移动的过程 
			//如果蛇吃到食物，则蛇头和食物位置一致
			if(foodX == x && foodY == y){//吃到食物
				divsSnake[y][x].className = "col moveSnake";
				// 蛇头所在的div添加到数组
				snakeBodys.push(divsSnake[y][x]);
				//继续随机食物
				randomFoods();
				scoreNum++;
				score.innerHTML = scoreNum;
				var num = 400-scoreNum * 10;
				if(num <= 100){
					num = 100;
				}
				clearInterval(timerMove);
				move(num);
				
				
			}else{
				snakeBodys[0].className = "col";//设置蛇尾颜色
				// 删除蛇尾div
				snakeBodys.shift();
				//改变蛇头div
				divsSnake[y][x].className = "col moveSnake";
				// 蛇头所在的div添加到数组
				snakeBodys.push(divsSnake[y][x]);
				
			}
		
		},speed);

	}
	
	
		
	
	//随机食物
	function random(m,n){
		return Math.floor(Math.random() * (n - m + 1) + m);
	}
	function randomFoods(){
		//随机行所在下标和列所在下标
		foodY = random(0,rowNumber-1);
		foodX = random(0,colNumber-1);
		//随机的食物位置此时是蛇身体所在位置
		if (divsSnake[foodY][foodX].className == "col moveSnake") {
			randomFoods();//重新随机食物 调自己
		} else{
			//设置食物所在位置div颜色
			divsSnake[foodY][foodX].className = "col food"
		}	
	}
	randomFoods();
}