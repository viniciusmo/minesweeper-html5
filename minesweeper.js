		var SOURCE_IMAGES = "images/";
		var contextElement = document.getElementById("game");
		contextElement.width = 600;
		contextElement.height = 600;
		var context = contextElement.getContext("2d");
		var WIDTH_SQUARE = 30;
		var HEIGHT_SQUARE = 30;
		var CINZA_CLARO = 'rgb(240,240,240)';
		var CINZA_ESCURO = 'rgb(80,80,80)';
		var IMAGE_MINE = new Image();
		IMAGE_MINE.src = SOURCE_IMAGES + "mine.png";


		function CollectionUtils(){}
		CollectionUtils.shuffle  =  function (o){
			for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
				return o;
		}
		function  CanvasUtils (){

		}

		CanvasUtils.writeBorderBlack =  function (i,j){
			context.strokeStyle = "#000";
			context.lineWidth   = 0.5;
			context.strokeRect(i,j, WIDTH_SQUARE,HEIGHT_SQUARE);
		}

		function Block (clickable,position,bomb){
			this.clickable = clickable;
			this.position = position;
			this.bomb = bomb;
			this.totalBombs;

			this.bombs =  function (total){
				this.totalBombs = total;
			}

			var getColorOfTotalBombs =  function (bombs){
				var cor;
				switch (bombs){
					case 1:
						cor = 'rgb(0,0,255)';
					break;
					case 2:
						cor = 'rgb(0,255,0)';
					break;
					case 3:
						cor = 'rgb(255,0,0)';
					break;
					case 4:
						cor = 'rgb(0,0,127)';
					break;
					case 5:
						cor = 'rgb(0,127,0)';
					break;
					case 6:
						cor = 'rgb(127,0,0)';
					break;
					case 7:
						cor = 'rgb(0,127,127)';
					break;
					case 8:
						cor = 'rgb(127,127,0)';
					break;
				}
				return cor;
			}

			this.changeImage =  function (){
				var i = position.j*WIDTH_SQUARE;
				var j = position.i*HEIGHT_SQUARE;
				console.info(this.clickable);
				if (this.clickable){
					this.clickable = false;
					if (bomb){
						context.fillStyle = "#FF0000";
						context.fillRect(i,j,WIDTH_SQUARE,HEIGHT_SQUARE);
						context.drawImage(IMAGE_MINE,i,j,WIDTH_SQUARE,HEIGHT_SQUARE);
						CanvasUtils.writeBorderBlack(i,j);
					}else if (this.totalBombs > 0){
						context.fillStyle = CINZA_ESCURO;
						context.fillRect(i,j,WIDTH_SQUARE,HEIGHT_SQUARE);
						context.fillStyle = getColorOfTotalBombs(this.totalBombs);
						context.font = '40px Calibri';
						context.fillText(this.totalBombs,i+5,j+27);
						CanvasUtils.writeBorderBlack(i,j);
					}else{
						context.fillStyle = CINZA_ESCURO;
						context.fillRect(i,j,WIDTH_SQUARE,HEIGHT_SQUARE);
						CanvasUtils.writeBorderBlack(i,j);
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
			this.lost = false;
			this.win = false;
			var totalBombs = 0;

			this.show =  function (){		
				for (var i = 0; i < this.boardGame.length; i++) {
					for (var j = 0; j < this.boardGame[i].length; j++) {
						context.beginPath();
						context.rect(i*WIDTH_SQUARE,j*HEIGHT_SQUARE,WIDTH_SQUARE,HEIGHT_SQUARE);
						context.fillStyle = CINZA_CLARO;
						context.fill();
						context.lineWidth = 0.1;
						context.strokeStyle = 'black';
						context.stroke();
					}
				}
			}

			this.onclick  =  function (x,y){
				var i = Math.floor(x/WIDTH_SQUARE);
				var j = Math.floor(y/HEIGHT_SQUARE);
				var block = this.boardGame[j][i];

				if (block.clickable && !this.lost && !this.win){
					block.changeImage();
					if (block.bomb){
						this.lost = true
						alert("Voce perdeu!");
						new Ranking().readAndSave(totalBombs);
					}else{
						showBlocksAroundPosition(block);
					}
					if (this.isWin()){
						this.win = true;
						alert("Voce ganhou!");
						new Ranking().readAndSave(totalBombs);
					}
				}
				document.getElementById('body_controls').innerHTML = totalBombs;
				
			}

			this.isWin =  function (){
				for (var i = 0; i < this.boardGame.length; i++) {
					for (var j = 0; j < this.boardGame[i].length; j++){
						if (this.boardGame[i][j].bomb && this.boardGame[i][j].clickable){
							return false;
						}
					}
				}
				return true;
			}
			var isValidPosition =  function (i,j){
				return boardGame[i] !=  undefined && boardGame[i][j] != undefined;
			}

			var changeImageOfBoardGameIfPositionIsValid = function (i,j){
				if (isValidPosition(i,j)){
					boardGame[i][j].changeImage();
					if (boardGame[i][j].bomb){
						totalBombs++;
					}
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
			document.getElementById('body_controls').style["display"] = "block";
			document.getElementById('score').style["display"] = "none";
			document.getElementById('body_controls').innerHTML = "0";
			alert("Jogo iniciado");
		}

		GameController.onclick  =  function (event){
			var x = event.pageX-contextElement.offsetLeft-1;
			var y = event.pageY-contextElement.offsetTop-1;
			document.getElementById('body_controls').style["display"] = "block";
			document.getElementById('score').style["display"] = "none";
			this.game.onclick(x,y);
		}


function Score (user,score){
	this.user = user;
	this.score = score;
}

function Ranking (){
	var KEY_RANKING = "ranking_score__	";

	this.readAndSave =  function (bombs){
		var name = prompt("Informe seu nickname : ", "");
		if (name == null || name.length <  3){
			alert("Seu nickname necessita 3 caracteres!")
			this.readAndSave(bombs);
			return;
		}
		verifyRankingIsNull();
		var retrievedRanking = localStorage.getItem(KEY_RANKING);
		retrievedRanking = JSON.parse(retrievedRanking);
		retrievedRanking.push(new Score(name,bombs));
		localStorage.setItem(KEY_RANKING, JSON.stringify(retrievedRanking));
		console.info (retrievedRanking);
	}

	var verifyRankingIsNull = function () {
		if (localStorage.getItem(KEY_RANKING) == null){
			var ranking =  new Array();
			localStorage.setItem(KEY_RANKING, JSON.stringify(ranking));
		}
	}

	this.show =  function (){
		verifyRankingIsNull();
		var score = document.getElementById('score');
		score.innerHTML = "";
		var innerHTML = "";
		innerHTML += "<table id='tfhover' class='tftable' border='1'>";
		innerHTML += "<tr><th>Name</th><th>Score</th><th>Posicao</th></tr>";
		var retrievedRanking = localStorage.getItem(KEY_RANKING);
		retrievedRanking = JSON.parse(retrievedRanking);
		retrievedRanking.sort  (function (a,b) {
			return b.score - a.score;
		});

		for (var i = 0 ;  i < retrievedRanking.length ; i++){
			   var user  = retrievedRanking[i];
				innerHTML += "<tr><td>"+user.user+"</td><td>"+user.score+"</td><td>"+(i+1)+"</td></tr>";
		}
		innerHTML += "</table>"
		document.getElementById('body_controls').style["display"] = "none";
		document.getElementById('score').style["display"] = "block";
		score.innerHTML  = innerHTML;
	}
}
