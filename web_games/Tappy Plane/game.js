var gameCanvas = document.getElementById("gameCanvas");
var ctx = gameCanvas.getContext("2d");

gameCanvas.addEventListener("mousedown",mouseClick,false);

var spritesheet = new Image();
spritesheet.src = "assets/spritesheet.png"
spritesheet.onload = startGame;

var gameState = score = backgroundPosition = mouseX = mouseY = 0;
var player = {x: 90,y: 170,gravity: 2};
var rockGrass = {x: 650,y: 241};
var rockGrassDown = {x: 900,y: -50};
var rock = {x: 1150,y: 265};
var mouseIn = false;

function startGame() {
	gameState = "MENU";
	gameLoop();
}	

function gameStateManager() {
	ctx.clearRect(0,0,640,480);
	switch(gameState) {
		case "MENU":
			objectMovement();
			drawMenu();
		break;
		case "PREGAME":
			objectMovement();
			drawGame();
		break;
		case "PLAYING":
			player.gravity += 0.3;
			player.y += player.gravity;
			rockGrass.x -= 3;
			rockGrassDown.x -= 3;
			rock.x -= 3;

			objectMovement();
			drawGame();
			checkForCollision();
		break;
		case "GAMEOVER":
			objectMovement();
			drawGameOverScreen();
		break;
	}	
}

function objectMovement() {
	if (gameState == "MENU" || gameState == "GAMEOVER") {
		backgroundPosition -= 2;
	} else if (gameState == "PLAYING" || gameState == "PREGAME") {
		backgroundPosition -= 3;
	}

	if (backgroundPosition <= -800) {
		backgroundPosition = 0;
	}

	if (rockGrass.x < -108) {
		rockGrass.x = Math.floor(Math.random() * 100) + 660;
	} else 	if (rockGrassDown.x < -108) {
		rockGrassDown.x = Math.floor(Math.random() * 100) + 660;
	} else 	if (rock.x < -108) {
		rock.x = Math.floor(Math.random() * 100) + 660;
	}	
}

function drawMenu() {
	ctx.drawImage(spritesheet,5,279,800,480,backgroundPosition,0,800,480);		// Background
	ctx.drawImage(spritesheet,5,279,800,480,backgroundPosition+800,0,800,480);

	ctx.drawImage(spritesheet,279,172,808,71,backgroundPosition,409,808,71);	// Ground
	ctx.drawImage(spritesheet,279,172,808,71,backgroundPosition+800,409,808,71);

	ctx.drawImage(spritesheet,279,5,147,58,247,205,147,58);	// Play button
	ctx.drawImage(spritesheet,436,5,461,79,90,50,461,79); 	// Game logo

	ctx.font = "40px Aharoni";
	ctx.fillStyle = "white";
	ctx.fillText("CLICK TO FLY",185,380);
}

function drawGame() {
	ctx.drawImage(spritesheet,5,279,800,480,backgroundPosition,0,800,480);		// Background
	ctx.drawImage(spritesheet,5,279,800,480,backgroundPosition+800,0,800,480);

	ctx.drawImage(spritesheet,1097,134,88,73,player.x,player.y,88,73); 	// Plane

	ctx.drawImage(spritesheet,815,253,108,239,rockGrass.x,rockGrass.y,108,239);	// Rocks
	ctx.drawImage(spritesheet,923,253,108,239,rock.x,rock.y,108,239);
	ctx.drawImage(spritesheet,1031,253,108,239,rockGrassDown.x,rockGrassDown.y,108,239);

	ctx.drawImage(spritesheet,279,172,808,71,backgroundPosition,409,808,71);	// Ground
	ctx.drawImage(spritesheet,279,172,808,71,backgroundPosition+800,409,808,71);

	ctx.font = "80px Aharoni";
	ctx.fillStyle = "white";
	ctx.fillText(score,310,60);

	if (gameState == "PREGAME") {
		ctx.font = "40px Aharoni";
		ctx.fillText("CLICK TO FLY",185,380);
	}
}

function drawGameOverScreen() {
	ctx.drawImage(spritesheet,5,279,800,480,backgroundPosition,0,800,480);		// Background
	ctx.drawImage(spritesheet,5,279,800,480,backgroundPosition+800,0,800,480);

	ctx.drawImage(spritesheet,279,172,808,71,backgroundPosition,409,808,71);	// Ground
	ctx.drawImage(spritesheet,279,172,808,71,backgroundPosition+800,409,808,71);

	ctx.drawImage(spritesheet,436,83,412,78,115,50,412,78); 	// Game over text
	ctx.drawImage(spritesheet,5,5,264,264,188,170,264,264);		// UI background
	ctx.drawImage(spritesheet,279,63,147,58,247,345,147,58); 	// Menu button

	if (score < 3) {
		ctx.drawImage(spritesheet,907,5,114,119,263,200,114,119);	// Bronze medal
	} else if (score < 6) {
		ctx.drawImage(spritesheet,1021,5,114,119,263,200,114,119);	// Silver medal
	} else {
		ctx.drawImage(spritesheet,1135,5,114,119,263,200,114,119);	// Gold medal
	}
}

function mouseClick(e) {

   if(e.offsetX) {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
   }
   else if(e.layerX) {
      mouseX = e.layerX;
      mouseY = e.layerY;
   }

   console.log("X:"+mouseX+" Y:"+mouseY)

	if (gameState == "MENU") {
		if (mouseX > 255 && mouseX < 502 && mouseY > 205 && mouseY < 263) {
			gameState = "PREGAME"
		}	
	} else if (gameState == "GAMEOVER") {
		if (mouseX > 255 && mouseX < 502 && mouseY > 345 && mouseY < 403) {
			gameState = "MENU"
			score = 0;
		}
	} else if (gameState == "PREGAME") {
		gameState = "PLAYING";
		player.gravity = -7;
	} else if (gameState == "PLAYING") {
		if (player.y > 0) {
			player.gravity = -7;
		}	
	}
 }

function checkForCollision() {
	if (player.y+73 > 460) {
		resetGame();
	} else if (player.x < (rockGrass.x+65) + 2 && player.x + 88  > (rockGrass.x+65) &&
		player.y  < rockGrass.y + 239 && player.y + 73 > rockGrass.y) {
			resetGame();
	} else 	if (player.x < (rock.x+65) + 2 && player.x + 88  > (rock.x+65) &&
		player.y  < rock.y + 239 && player.y + 73 > rock.y) {
			resetGame();
	} else 	if (player.x < (rockGrassDown.x+65) + 2 && player.x + 88  > (rockGrassDown.x+65) &&
		player.y  < rockGrassDown.y + 239 && player.y + 73 > rockGrassDown.y) {
			resetGame();
		}	

	if ((player.x > (rockGrass.x - 2) && player.x < (rockGrass.x + 2)) || (player.x > (rockGrassDown.x - 2) && player.x < (rockGrassDown.x + 2)) || (player.x > (rock.x - 2) && player.x < (rock.x + 2))) {
		score++
	}
}

function resetGame() {
	player = {x: 90,y: 170,gravity: 2};
	rockGrass = {x: 650,y: 241};
	rockGrassDown = {x: 900,y: -50};
	rock = {x: 1150,y: 265};
	gameState = "GAMEOVER";
}

function gameLoop() {
	gameStateManager();
	requestAnimationFrame(gameLoop);
}