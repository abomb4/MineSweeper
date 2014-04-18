/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//棋盘啊我擦

//游戏状态全局变量
ended=false;
started = false;
//初始值
area = {
	height:9,
	width: 9,
	bombs:10,
	board:new Array()
};

//构造函数
function Area(height, width, bombs) {
	return {
		height:height,
		width:width,
		bombs:bombs
		//board: new Array()
	};
}

function GenerateID(x,y) {
	id=x+"_"+y;
	return id;
}

//useless
function test(ev) {
	ev.preventDefault(true);
	return false;
}

//打印棋盘
area.write = function() {
	ended=false;
	document.write("<div id='bombboard'>");
	//屏蔽右键菜单
	document.getElementById("bombboard").oncontextmenu=function(event) {  
		 if (document.all) window.event.returnValue = false;// for IE  
		 else event.preventDefault();  
};  
	for (var i = 0; i < area.height; i++) {
		area.board[i] = new Array();
		for (var j = 0; j < area.width; j++) {
			area.board[i][j] = NewPoint();
			document.write("<div class='point' onclick='PointClick("
				+i+","+j+",true)' id='"+GenerateID(i,j)+
				"'oncontextmenu = 'PointFlag("
				+i+","+j+")'></div>");

		
		}
		document.write("</br>");
	}
	document.write("</div>");
};

area.PlaceBombs = function(x,y) {
	area.board[x][y].bomb=true;
	var bombs=area.bombs;
	while (bombs--) {
		var tempx;
		var tempy;
		do {
			tempx = parseInt(Math.random()*area.width);
			tempy = parseInt(Math.random()*area.height);
			//alert(tempx + " " + tempy);
		} while (area.board[tempx][tempy].bomb);
		area.board[tempx][tempy].bomb=true;
	}
	area.board[x][y].bomb = false;
};

NewPoint = function() {
	return {
		bomb: false,
		clicked: false,
		flag: false,
		surround: 0
	};
};

function PointClick(x,y) {
	//结束不可点击
	if (ended)return;
	//首次点击放炸弹
	if (!started) {
		area.PlaceBombs(x,y);
		started = true;
	}
	//已点过的不响应
	if (area.board[x][y].clicked)
		return;
	//插旗的不能点击
	if (area.board[x][y].flag)
		return;
	area.board[x][y].clicked=true;
	var p = document.getElementById(GenerateID(x,y));
	p.style.cssText="background-color:#0f0";
	if (area.board[x][y].bomb) {
		p.style.cssText="background-color:#f00";
		ShowBombs(false);
		alert("BOOOOOOOOOOOOOOOOOOOMMMMMMMMMMMMMMM");
		ended=true;
		started=false;
	} 
	else {
		CheckSurrond(x,y);
		if (area.board[x][y].surround !== 0) {
			p.style.cssText="background-color:#ff0";
			p.innerHTML = "<p>"+area.board[x][y].surround+"</p>";
		}
	}
	if (Judge())alert("WIN!!!");
}

function r(){
	return {
		x:0,
		y:0
	};
}

function CheckSurrond(x,y) {
	var i;
	var j;
	var temp = new Array();
	var k = 0;
	for (i = x - 1; i <= x + 1; i++) {
		if (i < 0 || i >= area.width)
			continue;
		for (j = y - 1; j <= y + 1; j++) {
			if (j < 0 || j >= area.height)
				continue;
			if (area.board[i][j].bomb) {
				area.board[x][y].surround++;
			}
			temp[k] = r();
			temp[k].x = i;
			temp[k++].y = j;
			
		}
	}
	if (area.board[x][y].surround === 0) {
		while(--k+1)
			PointClick(temp[k].x, temp[k].y);
	}
}

function PointFlag(x,y) {
	//游戏未开始插旗无效
	if (!started)
		return;
	//不能对已打开的区域插旗
	if (area.board[x][y].clicked)
		return;
	
	area.board[x][y].flag = !area.board[x][y].flag;
	var p = document.getElementById(GenerateID(x,y));
	if (area.board[x][y].flag) {
		p.innerHTML = "<p>F</p>";
	} else {
		p.innerHTML = "";
	}
}

function Judge() {
	var i,j;
	for (i = 0; i < area.width; i++) {
		for (j = 0; j < area.height; j++) {
			//有非炸弹的地方没点击则不算
			if (!area.board[i][j].bomb && !area.board[i][j].clicked)
				return false;
		}
	}
	ended=true;
	started=false;
	ShowBombs(true);
	return true;
}

function ShowBombs(win) {
	var color;
	if (!win)
		color = "background-color:#f22";
	else color = "background-color:#2bf";
	var i,j;
	for (i = 0; i < area.width; i++) {
		for (j = 0; j < area.height; j++) {
			if (area.board[i][j].bomb) {
				var p = document.getElementById(GenerateID(i,j));
				p.style.cssText=color;
			}
			if (!area.board[i][j].bomb && area.board[i][j].flag) {
				var p = document.getElementById(GenerateID(i,j));
				p.innerHTML="<p>X</p>";
			}
		}
	}
}