function CollectionUtils(){}
CollectionUtils.shuffle  =  function (o){
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
}


function Block (){
	this.clickable;
	this.position;
	this.bomb;
	this.html;
}

function Game (percentageOfBombs) {
	var SOURCE_IMAGES = 'images/'
	var COLS  = 20;
	var LINES = 20;
	this.gameBoard =  new Array();
	this.percentageOfBombs = percentageOfBombs;

	this.createBoardGame =  function (){
		populategameBoard();
		showMatrizGame();
	}

	var populategameBoard =  function (){
		var totalBombs = 0;
		this.gameBoard = new Array(LINES);
		for (var i = 0 ; i  < LINES * COLS; i++) {
			var block  = new Block();
			block.position = i;
			
			totalBombs++;
			this.gameBoard[i] = (alreadyGotTheTotalBombs(totalBombs)) ? 0 : 1;
		}
		CollectionUtils.shuffle(this.gameBoard);
	}

	var showMatrizGame =  function (){
		var countBreak = 0;
		for (var i = 0 ; i  < LINES * COLS; i++) {
			createImageElementAndAddOnclick(i);
			countBreak++;
			if (countBreak == COLS){
				addBreakLine();
				countBreak = 0;
			}
		}
	}

	var  alreadyGotTheTotalBombs =  function (totalBombs){
		return totalBombs >= getTotalsBombs();
	}

	var  getTotalsBombs =  function (){
		return percentageOfBombs * (COLS * LINES)
	}

	var addBreakLine = function (){
		var gameDiv = document.getElementById('game');
		var br = document.createElement('br');
		gameDiv.appendChild(br);
	}

	var createImageElementAndAddOnclick =  function (i){
		var gameDiv = document.getElementById('game');
		var divBoard = document.createElement('img');
		divBoard.setAttribute('src',SOURCE_IMAGES+'init.jpg');
		gameDiv.appendChild(divBoard);
		divBoard.onclick= function(element,i) {
			return function() {
				if (gameBoard[i] == 0){
					element.setAttribute('src',SOURCE_IMAGES+'clear.png');
				}else{
					element.setAttribute('src',SOURCE_IMAGES+'bomb.jpg');
				}
			}
		}(divBoard,i);
	}

}

new Game(0.15).createBoardGame();