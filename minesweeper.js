var LEVEL_CHOOSE = {
	EASY : 0,
	MEDIUM : 1,
	HARD : 2
}

function Level{

	var COLS = 20;
	var LINES = 20;

	this.makeMatrizGame =  function (){
		var matriz = new Array(LINES);
		for (var i = 0; i < LINES; i++) {
			matriz[i] = new Array(COLS);
		}
		return matriz;
	}
}

LevelEasy.prototype =  new Level();
LevelEasy.prototype.shuffleMatriz =  function (){

}


LevelMedium.prototype =  new Level();
LevelMedium.prototype.shuffleMatriz =  function (){

}

LevelHard.prototype =  new Level();
LevelHard.prototype.shuffleMatriz =  function (){

}



function LevelFactory (level) {

	this.makeLevel =  function (){
		switch (level){
			case LEVEL_CHOOSE.EASY:


			break;
			case LEVEL_CHOOSE.MEDIUM:

			break;
			case LEVEL_CHOOSE.HARD:

			break;
		}
	}
}