/** SheetMemory Class
 * 
 * This class is used to maintain an 2d array of CellClass objects.
 * 
 * The SheetMemory class is used to store the formulas and values of the cells in the spreadsheet.
 * 
 * The SheetMemory class is used by the Sheet class to store the formulas and values of the cells in the spreadsheet.
 * 
 * The array of cells is private and can only be accessed through the SheetMemory class.
 * 
 * This class provides a way to get and set the cells in the array.
 * 
 * This class calculates a dependency graph of the cells in the spreadsheet.
 * 
 * This class provides a way to evaluate the formulas in the cells.
 * 
 * This class provides a way to get the formulas and values of the cells in the spreadsheet.
 * 
 * This Class provides a way to get and set the current cell.
 * 
 * This class provides a way to evaluate the formula for the current cell. It uses Recalc.ts to evaluate the formula.
 * 
 * See Sheet.test.ts for examples of how to use this class.
 * 
 * 
 * 
 */

import Cell from "./Cell";

export class SheetMemory {
    private _cells: Cell[][];
    private _numRows: number;
    private _numColumns = 8;

    private _currentRow = 0;
    private _currentColumn = 0;


    constructor(columns: number, rows: number) {

        this._numColumns = columns;
        this._numRows = rows;

        this._cells = [];

    }


}


export default SheetMemory;