import React from "react";

import Cell from "../Engine/Cell";

import "./SheetComponent.css";

// a component that will render a two dimensional array of cells
// the cells will be rendered in a table
// the cells will be rendered in rows
// a click handler will be passed in

interface SheetComponentProps {
  cellsValues: Array<Array<string>>;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  currentCell: string;
  currentlyEditingUsernames: {[key: string]: string} ;
} // interface SheetComponentProps

//Cell.columnRowToCell(colIndex, rowIndex) will return the cell label
// you can use this to set the value of the button


function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i: number): string {
  const c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
  return "00000".substring(0, 6 - c.length) + c;
}

function getUsernameColor(username: string): string {
  return "#" + intToRGB(stringToHash(username));
}

function SheetComponent({
  cellsValues,
  onClick,
  currentCell,
  currentlyEditingUsernames,
}: SheetComponentProps) {
  /**
   *
   * @param cell
   * @returns the class name for the cell
   *
   * if the cell is the current cell and the sheet is in edit mode
   * then the cell will be rendered with the class name "cell-editing"
   *
   * if the cell is the current cell and the sheet is not in edit mode
   * then the cell will be rendered with the class name "cell-selected"
   *
   * otherwise the cell will be rendered with the class name "cell"
   */
  function getCellClass(cell: string) {
    //check if cuurentlyEditingUsernames is undefined
    if (currentlyEditingUsernames === undefined){
      return {
        className: "cell",
        style: {}
      };
    }
    const currentlyEditingUsername = currentlyEditingUsernames[cell] || "";
    if (cell === currentCell && currentlyEditingUsername) {
      
      return {
        className: "cell-editing",
        style: { borderColor: getUsernameColor(currentlyEditingUsername), borderWidth: "2px", borderStyle: "solid"}
      };
    }else if (currentlyEditingUsername){
      return {
        className: "cell",
        style: { borderColor: getUsernameColor(currentlyEditingUsername), borderWidth: "2px", borderStyle: "solid"}
      };
    }else if (cell === currentCell) {
      return {
        className: "cell-selected",
        style: {}
      };

    }
    return {
      className: "cell",
      style: {}
    };
  }

  /**
   *
   * @param column
   * @returns the letter for the column
   *
   * 0 -> A
   * 1 -> B
   * etc.
   */
  function columnToLetter(column: number): string {
    let temp: number;
    let letter: string = "";
    while (column >= 0) {
      temp = column % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      column = column / 26 - 1;
    }
    return letter;
  }

  return (
    <table className="sheet">
      <tbody>
        <tr>
          <td></td>
          {cellsValues[0].map((cell, colIndex) => (
            <td key={colIndex}>{columnToLetter(colIndex)}</td>
          ))}
        </tr>
        {cellsValues.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td className="row-number">{rowIndex + 1}</td>
            {row.map((cell, colIndex) => {
              const cellLabel = Cell.columnRowToCell(colIndex, rowIndex);
              const { className, style } = getCellClass(cellLabel);
              return (
                <td key={colIndex}>
                  <button
                    className={className}
                    style={style}
                    onClick={onClick}
                    cell-label={cellLabel}
                    data-testid={cellLabel}
                  >
                    {cell}
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
  
} // SheetComponent

export default SheetComponent;
