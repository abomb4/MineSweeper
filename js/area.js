/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template filchoose Tools | Templates
 * and open the template in the editor.
 */
// 棋盘啊我擦

var MineSweeper = (function (element) {

    // 游戏状态全局变量
    var state = {
        ended: false,
        started: false
    };

    // 构造函数
    function Area(height, width, bombs) {
        return {
            height: height,
            width: width,
            bombs: bombs,
            board: new Array()
        };
    }

    // 棋盘数据
    var area = Area(9, 9, 10);
    // 棋盘点元素
    var areaElements = new Array();

    function getElement(i, j) {
        return area.board[i][j].element;
    }

    // Alert something
    function myAlert(text) {
        alert(text);
    }

    // 打印棋盘
    function write() {
        state.ended = false;
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
                var point = (area.board[i][j] = newPoint(i, j)).element;

                board.append(point);
            }
            board.append(document.createElement('br'));
        }
    };
    function placeBombs(x, y) {
        area.board[x][y].bomb = true;
        var bombs = area.bombs;
        while (bombs--) {
            var tempx;
            var tempy;
            do {
                tempx = parseInt(Math.random() * area.width);
                tempy = parseInt(Math.random() * area.height);
                // myAlert(tempx + " " + tempy);
            } while (area.board[tempx][tempy].bomb);
            area.board[tempx][tempy].bomb = true;
        }
        area.board[x][y].bomb = false;
    };

    function newPoint(i, j) {
        var element = document.createElement('div');
        element.className = 'point';
        element.onclick = (function (x, y) {
            return function () {
                pointClick(x, y, true)
            };
        })(i, j);
        element.oncontextmenu = (function (x, y) {
            return function () {
                pointFlag(x, y)
            };
        })(i, j);

        return {
            bomb: false,
            clicked: false,
            flag: false,
            surround: 0,
            element: element
        };
    };

    function pointClick(x, y) {
        // 结束不可点击
        if (state.ended) return;
        // 首次点击放炸弹
        if (!state.started) {
            placeBombs(x, y);
            state.started = true;
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
        var p = getElement(x, y);
        p.style.cssText = "background-color:#0f0";
        if (area.board[x][y].bomb) {
            p.style.cssText = "background-color:#f00";
            showBombs(false);
            myAlert("BOOOOOOOOOOOOOOOOOOOMMMMMMMMMMMMMMM");
            state.ended = true;
            state.started = false;
        } else {
            checkSurrond(x, y);
            if (area.board[x][y].surround !== 0) {
                p.style.cssText = "background-color:#ff0";
                p.innerHTML = "<p>" + area.board[x][y].surround + "</p>";
            }
        }
        if (!state.ended && judge()) {
            myAlert("WIN!!!");
        }
    }

    function checkSurrond(x, y) {
        var i;
        var j;
        var temp = new Array();
        var k = 0;
        for (i = x - 1; i <= x + 1; i++) {
            if (i < 0 || i >= area.width) {
                continue;
            }
            for (j = y - 1; j <= y + 1; j++) {
                if (j < 0 || j >= area.height)
                    continue;
                if (area.board[i][j].bomb) {
                    area.board[x][y].surround++;
                }
                temp[k] = {
                    x: 0,
                    y: 0
                };
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
        if (!state.started)
            return;
        // 不能对已打开的区域插旗
        if (area.board[x][y].clicked)
            return;

        area.board[x][y].flag = !area.board[x][y].flag;
        var p = getElement(x, y);
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
        state.ended = true;
        state.started = false;
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
                    var p = getElement(i, j);
                    p.style.cssText = color;
                }
                if (!area.board[i][j].bomb && area.board[i][j].flag) {
                    var p = getElement(i, j);
                    p.innerHTML = "<p>X</p>";
                }
            }
        }
    }

    return {
        state: state,
        write: write
    };
});
