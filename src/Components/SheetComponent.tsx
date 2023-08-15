import { Table } from "react-bootstrap";

import Cell from "../Engine/Cell";
import "../styles/SheetComponent.css";

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

function SheetComponent({
  cellsValues,
  onClick,
  currentCell,
  currentlyEditing,
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
    if (cell === currentCell && currentlyEditing) {
      return "cell-editing";
    }
    if (cell === currentCell) {
      return "cell-selected";
    }
    return "cell";
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
            {row.map((cell, colIndex) => (
              <td key={colIndex}>
                <button
                  className={getCellClass(
                    Cell.columnRowToCell(colIndex, rowIndex)
                  )}
                  onClick={onClick}
                  cell-label={Cell.columnRowToCell(colIndex, rowIndex)}
                  data-testid={Cell.columnRowToCell(colIndex, rowIndex)}
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
