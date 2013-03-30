function CollectionUtils(){}
CollectionUtils.shuffle  =  function (o){
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
}

function Block (clickable,position,bomb){
	this.clickable = clickable;
	this.position = position;
	this.bomb = bomb;
	this.html;
}

function Position (i,j){
	this.i  = i;
	this.j = j;
}

function CreatorGame (percentageOfBombs){
	var COLS  = 20;
	var LINES = 20;
	this.percentageOfBombs = percentageOfBombs;
	this.mat;

	var  getTotalsBombs =  function (){
		return percentageOfBombs * (COLS * LINES);
	}

	var  alreadyGotTheTotalBombs =  function (totalBombs){
		return totalBombs >= getTotalsBombs();
	}

	var createArrayWithShuffle =  function (){
		this.mat =  new Array();
		var totalBombs = 0;
		for (var i = 0 ; i  < LINES * COLS; i++) {
			totalBombs++;
			this.mat[i] =  (alreadyGotTheTotalBombs(totalBombs)) ? 0 : 1;
		}
		CollectionUtils.shuffle(this.mat);
	}

	var getBoardGame =  function (){
		var boardGame = new Array();
		var countBoardItem = 0;

		for (var i = 0; i < LINES; i++) {
			boardGame[i] = new Array();
			for (var j = 0; j < COLS; j++) {
				 boardGame[i][j]  = new Block (false,new Position(i,j),this.mat[countBoardItem++])
			}
		}
		return boardGame;
	}

	this.buildBoardGame =  function(){
		createArrayWithShuffle();
		return getBoardGame();
	}
}	

function Game (boardGame) {
	var SOURCE_IMAGES = 'images/'
	this.boardGame = boardGame;

	this.show =  function (){
		for (var i = 0; i < this.boardGame.length; i++) {
			for (var j = 0; j < this.boardGame[i].length; j++) {
				 createImageElementAndAddOnclick(boardGame[i][j]);
			}
		    addBreakLine();
		}
	}

	var addBreakLine = function (){
		var gameDiv = document.getElementById('game');
		var br = document.createElement('br');
		gameDiv.appendChild(br);
	}

	var createImageElementAndAddOnclick =  function (block){
		var gameDiv = document.getElementById('game');
		var divBoard = document.createElement('img');
		divBoard.setAttribute('src',SOURCE_IMAGES+'init.jpg');
		gameDiv.appendChild(divBoard);
		block.html = divBoard;

		divBoard.onclick= function(block) {
			return function() {
				if (block.bomb){
					block.html.setAttribute('src',SOURCE_IMAGES+'bomb.jpg');
				}else{
					block.html.setAttribute('src',SOURCE_IMAGES+'clear.png');
				}
			}
		}(block);
	}

}

var boardGame = new CreatorGame(0.15).buildBoardGame()
new Game(boardGame).show();