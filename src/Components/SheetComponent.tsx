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
  currentlyEditing: boolean;
} // interface SheetComponentProps


//Cell.columnRowToCell(colIndex, rowIndex) will return the cell label
// you can use this to set the value of the button

function SheetComponent({ cellsValues, onClick, currentCell, currentlyEditing }: SheetComponentProps) {

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
    if (cell === currentCell && currentlyEditing) {
      return "cell-editing";
    }
    if (cell === currentCell) {
      return "cell-selected";
    }
    return "cell";
  }

  return (
    <table className="sheet">
      <tbody>
        {cellsValues.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td key={colIndex}>
                <button
                  className={getCellClass(Cell.columnRowToCell(colIndex, rowIndex))}
                  onClick={onClick}
                  cell-label={Cell.columnRowToCell(colIndex, rowIndex)}
                >
                  {cell}
                </button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
} // SheetComponent






export default SheetComponent;