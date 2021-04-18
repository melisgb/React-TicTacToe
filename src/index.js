import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
    return (
        <button className="square" 
            onClick={props.onClick}>
            {props.value}
        </button>
      );
    }
  
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square value={this.props.squares[i]} 
                    onClick = {()=> this.props.onClick(i)}
        />);
    }
  
    render() {
        return (
            <div>
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
            </div>
      );
    }
}
  
class Game extends React.Component {
    constructor(props){
        super(props);
        this.state  = {
            history : [{
                squares : Array(9).fill(null),
                position : {row: 0, col:0}
            }],
            stepNumber : 0,
            xIsNext : true
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history : history.concat([{
                squares: squares,
                position : getRowCol(i + 1)
            }]),
            stepNumber : history.length,
            xIsNext : !this.state.xIsNext
        });
    }

    jumpTo(stepInx) {
        this.setState({
            stepNumber : stepInx,
            xIsNext : (stepInx % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let lastInx = this.state.history.length-1;
        console.log(lastInx);
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move + " - on cell " + step.position.row + ", "+ step.position.col:
            'Start game';
            return (
                <li key ={move}>
                    <button style={ {fontWeight: (move === lastInx ? "bold" : "normal")} } className="moves" onClick={()=> this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status;
        let statusStyle;
        if(winner) {
            status = 'Winner: ' + winner;
            statusStyle = {color: "green", backgroundColor: "powderblue", fontSize: "160%"};
        }
        else {
            if(this.state.stepNumber === 9){
                status = 'Game ends in Tie!';
                statusStyle = {color: "blue", backgroundColor: "yellow"};
            }
            else {
                status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');        
                statusStyle = {color: "black"};
            }
        }

        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares = {current.squares}
                    onClick = {(i) => this.handleClick(i)}/>
            </div>
            <div className="game-info">
                <div className="statusText" style={statusStyle}>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
        );
    }
}
  
  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  


function calculateWinner(squares){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]; //This is the possible combinations (lines) to win

    for (let i = 0; i< lines.length; i++){
        const[a,b,c] = lines[i];
        if(squares[a] === squares[b] && squares[a] === squares[c] && squares[a]){
            return squares[a];
        }
    }
    return null;
}


function getRowCol(i){
    var rowColDict = {
        1 : [1, 1],
        2 : [1, 2],
        3 : [1, 3],
        4 : [2, 1],
        5 : [2, 2],
        6 : [2, 3],
        7 : [3, 1], 
        8 : [3, 2], 
        9 : [3, 3] 
    };
    return {row: rowColDict[i][0], col: rowColDict[i][1] };    
}