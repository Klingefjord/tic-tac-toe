let playerType = "X";
let enemyType = "O";
let chosenType = playerType;

$(".cell").click(function() {

	// setup game if new game
	let board = getBoardInfo();
	if (checkIfEmpty(board)) {
		setupGame();
	}

	$(this).html(playerType);

	if (checkForVictory()) {
		return;
	}
	else if (isFull(board)) {
		draw();
	} else {
		enemyMove();
	}
});

$("button").click(function() {
	chosenType = $(this).html();
});

function draw() {
	updateText("It's A Draw");
	eraseBoard();
}

function weirdEdgeCase(a,b,c, board) {
	if (board[a] === playerType && board[b] === playerType && board[c] === "") {
		placeCell(c);
		return true;
	}
}

function isFull(board) {
	for (var i = 0; i < board.length; i++) {
		if (board[i] === "") {
			return false;
		}
	}
	return true;
}

function checkIfEmpty(board) {
	for (var i = 0; i < board.length; i++) {
		if (board[i] !== "") {
			return false;
		}
	}
	return true;
}

function setupGame() {
	updateText(""); // clears text field
	if (chosenType !== playerType) {
		enemyType = playerType;
		playerType = chosenType;
	}
}

function checkForVictory() {
	if (hasWon(getBoardInfo(), playerType)) {
		win("Player ");
		return true;
	} else if (hasWon(getBoardInfo(), enemyType)) {
		win("The Computer ");
		return true;
	}
	return false;
}

function updateText(input) {
	$("#text").html(input);
}

function win(phrase) {
	updateText(phrase + " Won!");
	eraseBoard();
}

function eraseBoard() {
	// erase board
	for (var i = 1; i < 10; i++) {
		$(`#cell${i}`).html("");
	}
}

function enemyMove() {
	const board = getBoardInfo();
	let scores = [];

	// weird edge-case fix
	if (weirdEdgeCase(3,4,5, board) || weirdEdgeCase(1,4,7, board))  {
		return;
	}

	for (var i = 0; i < board.length; i++) {
		if (board[i] == "") {

			// copy board
			let changeableBoard = board.slice();

			// calculate score for certain move
			let score = minMax(enemyType, changeableBoard, i);
			scores.push(score);
		} else {
			// if move not possible
			scores.push(-100);
		}
	}

	let maxIndex = 0;

	for (var i = 1; i < scores.length; i++) {
		if (scores[maxIndex] < scores[i]) {
			maxIndex = i;
		}
	}
	placeCell(maxIndex);
	if (checkForVictory()) {
		return;
	} else if (isFull(getBoardInfo())) {
		draw();
	}
}

function placeCell(index) {
	let cell = "#cell" + (index + 1);
	$(cell).html(enemyType);
}

function getBoardInfo() {
	let board = [];
	for (var i = 1; i < 10; i++) {
		board.push($(`#cell${i}`).html());
	}
	return board;
}

function minMax(player, board, startSquare) {

	// place marker at startsquare
	board[startSquare] = player;

	// if player has won, return score
	if (hasWon(board, enemyType)) {
		return 10;
	} else if (hasWon(board, playerType)) {
		return -10;
	}

	// if game is draw, return 0
	else if (board.every(x => x)) {
		return 0;
	}

	// Else, loop through remaining open board pieces and start a new minmax
	else {
		let score = [];
		for (var i = 0; i < board.length; i++) {
			if (board[i] == "") {
				let newBoard = board.slice();
				score.push(minMax((player === playerType ? enemyType : playerType), newBoard, i));
			}
		}
		let total = score.reduce(function(a, b) {
			return a + b;
		}, 0);

		return total / score.length;
	}
}

function hasWon(board, marker) {
	for (var i = 0; i < board.length; i++) {
		if (i == 0 || i == 3 || i == 6) {
			if (board[i] == marker && board[i + 1] == marker && board[i + 2] == marker) {
				// horizontal 3 in a row!
				return true;
			}
		}
		if (i == 0 || i == 1 || i == 2) {
			if (board[i] == marker && board[i + 3] == marker && board[i + 6] == marker) {
				// vertical 3 in a row!
				return true;
			}
		}
		if (i == 0 ) {
			if (board[i] == marker && board[i + 4] == marker && board[i + 8] == marker) {
				// diagonal 3 in a row!
				return true;
			}
		}
		if (i == 2) {
			if (board[i] == marker && board[i + 2] == marker && board[i + 4] == marker) {
				// diagonal 3 in a row!
				return true;
			}
		}
	}
	return false;
}
