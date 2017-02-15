import React from "react";

/**
 * Created by pc on 2/13/2017.
 */
/*
 This is a Stateless Functional Component.
 It exists purely to return something that requires no state.
 */
function Square(props) {
  return (
    //When clicked, use the onClick() function passed in 'props' from Board.
    <button className="square" onClick={() => props.onClick()}>
      {/*Display the 'value' parameter passed in 'props'.*/}
      {props.value}
    </button>
  );
}

function Row(props) {
  return (
    <div className="board-row">
      <Square id="col-0" value={props.row[0]} onClick={() => props.onClick()}/>
      <Square id="col-1" value={props.row[1]} onClick={() => props.onClick()}/>
      <Square id="col-2" value={props.row[2]} onClick={() => props.onClick()}/>
      <Square id="col-3" value={props.row[3]} onClick={() => props.onClick()}/>
      <Square id="col-4" value={props.row[4]} onClick={() => props.onClick()}/>
    </div>
  )
}

class Board extends React.Component {

  render() {
    return (
      <div className="board">
        <Row id="row-0" row={this.props.field[0]} onClick={this.props.onClick()}/>
        <Row id="row-1" row={this.props.field[1]} onClick={this.props.onClick()}/>
        <Row id="row-2" row={this.props.field[2]} onClick={this.props.onClick()}/>
        <Row id="row-3" row={this.props.field[3]} onClick={this.props.onClick()}/>
        <Row id="row-4" row={this.props.field[4]} onClick={this.props.onClick()}/>
      </div>
    )
  }
}

export class Game extends React.Component {
  constructor() {
    super();
    let fullField = this.generateMineField(5, 4);
    this.state = {
      field: fullField,
    };
  }

  generateMineField(fieldSize, numberOfMines) {
    let fullField = this.generateField(fieldSize); //Create an empty field.
    let mineCoordinates = this.getMineCoords(numberOfMines); //Get random mine locations.
    fullField = this.insertMines(fullField, mineCoordinates); //Insert mines into the field.
    fullField = this.addMineIndicators(fullField, mineCoordinates); //Add mine indicators to field.
    return fullField;
  }

  generateField(fieldSize) {
    let baseArr = new Array(fieldSize).fill(null);
    baseArr.forEach(function (row, index, array) {
      array[index] = new Array(fieldSize).fill(null);
    });
    return baseArr;
  }

  /*
   Pick the coordinates for the number of mines given.
   */
  getMineCoords(numOfMines) {
    let randPicks = Array(numOfMines).fill(null); //Create empty array the size of the number of mines.
    let picked = 0;
    let xy = "";
    while (picked < randPicks.length) {
      xy = (Math.floor(Math.random() * 5)) + "," + (Math.floor(Math.random() * 5));
      if (!randPicks.includes(xy)) { //Make sure the random number hasn't already been picked.
        randPicks[picked] = xy; //Add random number to array of random numbers picked.
        picked++;
      }
    }
    return randPicks;
  }

  insertMines(fullField, mineCoordinates) {
    mineCoordinates.forEach(function (entry, index, array) {
      let xyCoordinates = entry.split(",");
      fullField[xyCoordinates[0]][xyCoordinates[1]] = "X";
    });
    return fullField;
  }

  addMineIndicators(fullField, mineCoordinates) {
    for (let i = 0; i < mineCoordinates.length; i++) {
      let mineIndicators = [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)];
      //Grab the first set of coordinates.
      let xyCoordinates = mineCoordinates[i].split(",");
      let x = parseInt(xyCoordinates[0]);
      let y = parseInt(xyCoordinates[1]);
      let rowColEnd = fullField.length - 1;

      //Do the arithmetic for each of the 8 squares around a mine.
      mineIndicators[0] = [x - 1, y - 1];
      mineIndicators[1] = [x - 1, y];
      mineIndicators[2] = [x - 1, y + 1];
      mineIndicators[3] = [x, y + 1];
      mineIndicators[4] = [x + 1, y + 1];
      mineIndicators[5] = [x + 1, y];
      mineIndicators[6] = [x + 1, y - 1];
      mineIndicators[7] = [x, y - 1];

      //Only check the 8 surrounding squares if X or Y are on the edge.
      if (x === 0 || x === rowColEnd || y === 0 || y === rowColEnd) {
        //Remove possible locales if they're out of the bounds of the grid.
        mineIndicators.forEach(function (locale, index, array) {
          if (locale[0] < 0) {
            array[index] = null;
          } else if (locale[0] > rowColEnd) {
            array[index] = null;
          } else if (locale[1] < 0) {
            array[index] = null;
          } else if (locale[1] > rowColEnd) {
            array[index] = null;
          }
        });
      }

      mineIndicators.forEach(function (entry, index, array) {
        if (entry !== null) {
          let fieldValue = fullField[entry[0]][entry[1]];
          if (fieldValue !== "X") {
            if (fieldValue === null) {
              fullField[entry[0]][entry[1]] = 1;
            } else {
              fullField[entry[0]][entry[1]]++;
            }
          }
        }
      });
    }
    return fullField;
  }

  handleClick(i) {

  }

  render() {
    const field = this.state.field;
    return (
      <div className="game">
        <div className="game-board">
          <Board
            field={field}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
      </div>
    );
  }
}