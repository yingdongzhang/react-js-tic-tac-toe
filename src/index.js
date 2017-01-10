import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function Square(props) {
  // if this cell is one of the winning row, highlight it
  if (props.highlight) {
    return (
      <button
        className="square"
        onClick={() => props.onClick()}
        style={{color: "red"}}
        >
        {props.value}
      </button>
    );
  } else {
    return (
      <button
        className="square"
        onClick={() => props.onClick()}>
        {props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    let won = false;
    if (this.props.winnerPosition
    && this.props.winnerPosition.indexOf(i) >= 0) {
      won = true;
    }
    return <Square
      key={i}
      value={this.props.squares[i]}
      highlight={won}
      onClick={() => this.props.onClick(i)} />;
  }
  render() {
    // Use two loops to make the squares
    const board = [];
    for (let row = 0; row < 3; row++) {
      const line = [];
      for (let col = 3*row; col <= 3*row+2; col++) {
        line.push(this.renderSquare(col));
      }
      board.push(<div className="board-row" key={row}>{line}</div>)
    }
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      asc: true,
    };
  }
  handleOnClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // if the cell is filled or there is a winner, return
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext, // toggle the next move
      stepNumber: history.length,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }
  /*
  * Start over
  */
  startOver() {
    this.setState({
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      asc: true,
    });
  }
  /*
  * Toggle move list order
  */
  toggleSort() {
    const asc = this.state.asc;
    this.setState({
      asc: !asc,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const asc = this.state.asc;

    let status;
    let winnerPosition;
    if (winner) {
      status = 'Winner: ' + winner;
      winnerPosition = getWinningPosition(current.squares);
    } else if (!isNotFullFilled(current.squares)) {
      status = 'Tie'; // no space left, it's a tie
    } else {
      status = 'Next Player:' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </a>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerPosition={winnerPosition}
            onClick={(i) => this.handleOnClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleSort()}>
            Order
          </button>
          {(() => {
            return asc === true? <ol>{moves}</ol> : <ol>{moves.reverse()}</ol>
          })()}
          <button onClick={() => this.startOver()}>
            Start Over
          </button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

function calculateWinner(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

/*
* Get the winning position array
*/
function getWinningPosition(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

function isNotFullFilled(squares) {
  let emptyBox = false;
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      emptyBox = true;
    }
  }
  return emptyBox;
}
