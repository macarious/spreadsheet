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
    private _needsRecalc = false;

    constructor(columns: number, rows: number, serverData: { [label: string]: string[] } = {}) {
        this._numColumns = columns;
        this._numRows = rows;
        this._cells = [];
        this.initEmptySheet();
        this.initSheetFromServerData(serverData); 
    }

    initEmptySheet(): void {
        for (let row = 0; row < this._numRows; row++) {
            this._cells[row] = [];
            for (let column = 0; column < this._numColumns; column++) {
                this._cells[row][column] = new Cell();
                this._cells[row][column].setLabel(this.getLabelFromCoordinates(column, row));
            }
        }
    }

    static arraysHaveSameStrings(arr1: string[], arr2: string[]): boolean {
        if (arr1.length !== arr2.length) return false;
    
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
    
        return true;
    }
    
    initSheetFromServerData(serverData: { [label: string]: string[] }): void {
        for (const label in serverData) {
            const cell = this.getCellByLabel(label);
            const formula = serverData[label];
            if (!SheetMemory.arraysHaveSameStrings(formula, cell.getFormula())){
                cell.setFormula(formula); 
                this._needsRecalc = true;
            }
        }
        // evaluateAllCells should be called from spreadsheet controller
    }

    needsRecalc(): boolean {
        return this._needsRecalc;
    }
    resetRecalc(): void {
        this._needsRecalc = false;
    }

    getNumRows(): number {
        return this._numRows;
    }

    getNumColumns(): number {
        return this._numColumns;
    }

    getCellByLabel(label: string): Cell {
        const coordinates = this.getCoordinatesFromLabel(label);
        return this.getCellByCoordinates(coordinates[0], coordinates[1]);
    }

    getCoordinatesFromLabel(label: string): number[] {
        const column = label.charAt(0).toUpperCase();
        const row = parseInt(label.substring(1));
        const columnNumber = column.charCodeAt(0) - 65;
        const rowNumber = row - 1;
        return [columnNumber, rowNumber];
    }

    getLabelFromCoordinates(column: number, row: number): string {
        const columnLabel = String.fromCharCode(column + 65);
        const rowLabel = row + 1;
        return columnLabel + rowLabel;
    }

    getCellByCoordinates(column: number, row: number): Cell {
        return this._cells[row][column];
    }

    getCurrentCell(): Cell {
        return this._cells[this._currentRow][this._currentColumn];
    }

    getWorkingCellByCoordinates(): number[] {
        return [this._currentColumn, this._currentRow];
    }

    getCurrentCellFormula(): string[] {
        return this._cells[this._currentRow][this._currentColumn].getFormula();
    }

    getSheetDisplayStrings(): string[][] {
        const displayString: string[][] = [];
        for (let row = 0; row < this._numRows; row++) {
            displayString[row] = [];
            for (let column = 0; column < this._numColumns; column++) {
                displayString[row][column] = this._cells[row][column].getDisplayString();
            }
        }
        return displayString;
    }

    setCurrentCell(cell: Cell): void {
        this._cells[this._currentRow][this._currentColumn] = cell;
    }

    setCurrentCellValue(value: number): void {
        this._cells[this._currentRow][this._currentColumn].setValue(value);
    }

    setCurrentCellFormula(formula: string[]): void {
        if (formula.length === 0) {
            this._cells[this._currentRow][this._currentColumn].setFormula([]);
            return;
        }
        this._cells[this._currentRow][this._currentColumn].setFormula(formula);
    }

    setWorkingCellByCoordinates(column: number, row: number): void {
        this._currentColumn = column;
        this._currentRow = row;
    }

    setWorkingCellByLabel(label: string): void {
        const coordinates = this.getCoordinatesFromLabel(label);
        this._currentColumn = coordinates[0];
        this._currentRow = coordinates[1];
    }
}


export default SheetMemory;