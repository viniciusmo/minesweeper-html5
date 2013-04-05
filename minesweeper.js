var SOURCE_IMAGES = "images/";
var contextElement = document.getElementById("game");
var context = contextElement.getContext("2d");

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
	this.totalBombs;

	this.bombs =  function (total){
		this.totalBombs = total;
	}

	this.onclick  =  function (){


	}
	
	this.changeImage =  function (){
		if (clickable){
			clickable = false;
			if (bomb){
				this.html.setAttribute('src',SOURCE_IMAGES+'bomb.jpg');
			}else if (this.totalBombs > 0){
				this.html.setAttribute('src',SOURCE_IMAGES+this.totalBombs+'.png');
			}else{
				this.html.setAttribute('src',SOURCE_IMAGES+'clear.png');
			}
		}
	}
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
		var boardGame = createBoardGame();
		boardGame = countBombsAroundBlocks(boardGame);
		return boardGame;
	}

	var createBoardGame =  function (){
		var boardGame = new Array();
		var countBoardItem = 0;
		for (var i = 0; i < LINES; i++) {
			boardGame[i] = new Array();
			for (var j = 0; j < COLS; j++) {
				var block  = new Block (true,new Position(i,j),this.mat[countBoardItem++])
				boardGame[i][j] = block;
			}
		}
		return boardGame;
	}

	var countBombsAroundBlocks = function (boardGame){
		for (var i = 0; i < LINES ; i++) {
			for (var j = 0; j < COLS; j++) {
				var block = boardGame[i][j];
				block.bombs ( countBombsAroundOfBlock(boardGame,i,j) );
			};
		};
		return boardGame;
	}

	var countBombsAroundOfBlock = function (boardGame,i,j){
		var total = 0;
		total += isBombPosition(boardGame,i-1,j-1);
		total += isBombPosition(boardGame,i-1,j);
		total += isBombPosition(boardGame,i-1,j+1);
		total += isBombPosition(boardGame,i,j-1);
		total += isBombPosition(boardGame,i,j+1);
		total += isBombPosition(boardGame,i+1,j-1);
		total += isBombPosition(boardGame,i+1,j);
		total += isBombPosition(boardGame,i+1,j+1);
		return total;
	}

	var isBombPosition =  function (boardGame,i,j){
		if (boardGame[i]!= undefined && boardGame[i][j] != undefined){
			if (boardGame[i][j].bomb)
				return 1;
		}
		return 0;
	}

	this.buildBoardGame =  function(){
		createArrayWithShuffle();
		return getBoardGame();
	}
}	

function Game (boardGame) {
	this.boardGame = boardGame;

	this.show =  function (){
		for (var i = 0; i < this.boardGame.length; i++) {
			for (var j = 0; j < this.boardGame[i].length; j++) {
				createImageElementAndAddOnclick(boardGame[i][j]);
			}
			addBreakLine();
		}
	}

	this.onclick  =  function (x,y){
		alert(x+y);
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
					showBlocksAroundPosition(block);
				}
			}
		}(block);
	}

	var isValidPosition =  function (i,j){
		return boardGame[i][j] != null;
	}

	var changeImageOfBoardGameIfPositionIsValid = function (i,j){
		if (isValidPosition(i,j)){
			boardGame[i][j].changeImage();
		}
	}

	var showBlocksAroundPosition =  function (block){
		var i = block.position.i;
		var j = block.position.j;
		changeImageOfBoardGameIfPositionIsValid(i-1,j-1);
		changeImageOfBoardGameIfPositionIsValid(i-1,j);
		changeImageOfBoardGameIfPositionIsValid(i-1,j+1);
		changeImageOfBoardGameIfPositionIsValid(i,j-1);
		changeImageOfBoardGameIfPositionIsValid(i,j+1);
		changeImageOfBoardGameIfPositionIsValid(i+1,j-1);
		changeImageOfBoardGameIfPositionIsValid(i+1,j);
		changeImageOfBoardGameIfPositionIsValid(i+1,j+1);
	}
}
function GameController (){

}

var LEVEL_EASY = 0.15;
var LEVEL_MEDIUM = 0.50;
var LEVEL_HARD = 1.0;

GameController.createGame  =  function (level){
	this.boardGame =  new CreatorGame(level).buildBoardGame()
	this.game =  new Game(this.boardGame);
	this.game.show();
}

GameController.onclick  =  function (event){
	var x = event.pageX-contextElement.offsetLeft;
	var y = event.pageY-contextElement.offsetTop;
	this.game.onclick(x,y);
}
