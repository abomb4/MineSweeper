/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template filchoose Tools | Templates
 * and open the template in the editor.
 */
// 棋盘啊我擦

var MineSweeper = (function (element) {
    // 游戏状态全局变量
    var ended = false;
    var started = false;
    // 初始值
    var area = {
        height: 9,
        width: 9,
        bombs: 10,
        board: new Array()
    };

    var areaElements = new Array();

    // 构造函数
    function Area(height, width, bombs) {
        return {
            height: height,
            width: width,
            bombs: bombs
            // board: new Array()
        };
    }

    function generateID(x, y) {
        id = x + "_" + y;
        return id;
    }

    // useless
    function test(ev) {
        ev.preventDefault(true);
        return false;
    }

    // 打印棋盘
    area.write = function () {
        ended = false;
        var board = document.createElement('div');
        board.className = 'board';
        element.append(board);
        // 屏蔽右键菜单
        board.oncontextmenu = function (event) {
            if (document.all) window.event.returnValue = false; // for IE
            else event.preventDefault();
        };
        for (var i = 0; i < area.height; i++) {
            area.board[i] = new Array();
            areaElements[i] = new Array();
            for (var j = 0; j < area.width; j++) {
                area.board[i][j] = newPoint();
                areaElements[i][j] = document.createElement('div');
                var point = areaElements[i][j];
                point.className = 'point';
                point.onclick = (function (x, y) {
                    return function () {
                        pointClick(x, y, true)
                    };
                })(i, j);
                point.oncontextmenu = (function (x, y) {
                    return function () {
                        pointFlag(x, y)
                    };
                })(i, j);

                board.append(point);
            }
            board.append(document.createElement('br'));
        }
    };

    area.placeBombs = function (x, y) {
        area.board[x][y].bomb = true;
        var bombs = area.bombs;
        while (bombs--) {
            var tempx;
            var tempy;
            do {
                tempx = parseInt(Math.random() * area.width);
                tempy = parseInt(Math.random() * area.height);
                // alert(tempx + " " + tempy);
            } while (area.board[tempx][tempy].bomb);
            area.board[tempx][tempy].bomb = true;
        }
        area.board[x][y].bomb = false;
    };

    newPoint = function () {
        return {
            bomb: false,
            clicked: false,
            flag: false,
            surround: 0
        };
    };

    function pointClick(x, y) {
        // 结束不可点击
        if (ended) return;
        // 首次点击放炸弹
        if (!started) {
            area.placeBombs(x, y);
            started = true;
        }
        // 已点过的不响应
        if (area.board[x][y].clicked) {
            return;
        }
        // 插旗的不能点击
        if (area.board[x][y].flag) {
            return;
        }
        area.board[x][y].clicked = true;
        var p = areaElements[x][y];
        p.style.cssText = "background-color:#0f0";
        if (area.board[x][y].bomb) {
            p.style.cssText = "background-color:#f00";
            showBombs(false);
            alert("BOOOOOOOOOOOOOOOOOOOMMMMMMMMMMMMMMM");
            ended = true;
            started = false;
        } else {
            checkSurrond(x, y);
            if (area.board[x][y].surround !== 0) {
                p.style.cssText = "background-color:#ff0";
                p.innerHTML = "<p>" + area.board[x][y].surround + "</p>";
            }
        }
        if (!ended && judge()) {
            alert("WIN!!!");
        }
    }

    function r() {
        return {
            x: 0,
            y: 0
        };
    }

    function checkSurrond(x, y) {
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
            while (--k + 1) {
                pointClick(temp[k].x, temp[k].y);
            }
        }
    }

    function pointFlag(x, y) {
        // 游戏未开始插旗无效
        if (!started)
            return;
        // 不能对已打开的区域插旗
        if (area.board[x][y].clicked)
            return;

        area.board[x][y].flag = !area.board[x][y].flag;
        var p = areaElements[x][y];
        if (area.board[x][y].flag) {
            p.innerHTML = "<p>F</p>";
        } else {
            p.innerHTML = "";
        }
    }

    function judge() {
        var i, j;
        for (i = 0; i < area.width; i++) {
            for (j = 0; j < area.height; j++) {
                // 有非炸弹的地方没点击则不算
                if (!area.board[i][j].bomb && !area.board[i][j].clicked)
                    return false;
            }
        }
        ended = true;
        started = false;
        showBombs(true);
        return true;
    }

    function showBombs(win) {
        var color;
        if (!win) {
            color = "background-color:#f22";
        } else {
            color = "background-color:#2bf";
        }

        var i, j;
        for (i = 0; i < area.width; i++) {
            for (j = 0; j < area.height; j++) {
                if (area.board[i][j].bomb) {
                    var p = areaElements[i][j];
                    p.style.cssText = color;
                }
                if (!area.board[i][j].bomb && area.board[i][j].flag) {
                    var p = areaElements[i][j];
                    p.innerHTML = "<p>X</p>";
                }
            }
        }
    }

    return area;
});
