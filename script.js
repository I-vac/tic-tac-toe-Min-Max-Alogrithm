var startBoard;
const HUMAN = 'O';
const AI = 'X';
const winCombinations = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.square');
startGame();

function startGame() {
	document.querySelector(".gameFinish").style.display = "none";
	startBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof startBoard[square.target.id] == 'number') {
		turn(square.target.id, HUMAN)
		if (!checkWin(startBoard, HUMAN) && !checkTie()) turn(bestSpot(), AI);
	}
}

function turn(squareId, player) {
	startBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(startBoard, player)
	if (gameWon) gameOver(gameWon)
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, HUMAN)) {
		return {score: -10};
	} else if (checkWin(newBoard, AI)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == AI) {
			var result = minimax(newBoard, HUMAN);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, AI);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === AI) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombinations.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombinations[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == HUMAN ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == HUMAN ? "You win!" : "You lose.");
}

function declareWinner(who) {
	document.querySelector(".gameFinish").style.display = "block";
	document.querySelector(".gameFinish .text").innerText = who;
}

function emptySquares() {
	return startBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(startBoard, AI).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "yellow";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

