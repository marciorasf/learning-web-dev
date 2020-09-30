import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

function Reset(props) {
	return (
		<button className="reset" onClick={props.onClick}>
			Reset Game
		</button>
	);
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

class Board extends React.Component {
	renderSquare(i) {
		return <Square value={this.props.squares[i]} onClick={() => this.props.handleSquareClick(i)} />;
	}

	renderReset() {
		return <Reset onClick={() => this.props.resetGame()}></Reset>;
	}

	render() {
		return (
			<div>
				<div className="status">{this.props.status}</div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
				<div>{this.renderReset()}</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null)
				}
			],
			xIsNext: true,
			stepNumber: 0
		};
	}

	handleSquareClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) return;

		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([
				{
					squares
				}
			]),
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length
		});
	}

	resetGame() {
		this.setState({
			history: [
				{
					squares: Array(9).fill(null)
				}
			],
			xIsNext: true
		});
	}

	renderBoard(squares, status) {
		return (
			<Board
				squares={squares}
				handleSquareClick={i => this.handleSquareClick(i)}
				resetGame={() => this.resetGame()}
				status={status}
			></Board>
		);
	}
	7;

	goToStep(stepNumber) {
		this.setState({
			stepNumber: stepNumber,
			xIsNext: stepNumber % 2 === 0
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const squares = current.squares.slice();

		const moves = history.map((step, stepNumber) => {
			const desc = stepNumber ? `Go to move #${stepNumber}` : "Go to start";

			return (
				<li key={stepNumber}>
					<button onClick={() => this.goToStep(stepNumber)}>{desc}</button>
				</li>
			);
		});

		const winner = calculateWinner(squares);
		let status;
		if (winner) {
			status = `Winner ${winner}`;
		} else {
			status = `Next player ${this.state.xIsNext ? "X" : "O"}`;
		}

		return (
			<div className="game">
				<div className="game-board">{this.renderBoard(squares, status)}</div>
				<div className="game-info">
					<div></div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
