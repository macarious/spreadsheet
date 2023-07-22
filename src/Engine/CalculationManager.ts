/**
 *  This class is responsible for managing the dependencies in the sheet
 * 
 *  A cell has a property called dependsOn which is a list of cells that the cell depends on
 * 
 * This class exports the following functions
 * 
 * 0. addCellDependency(cellLabel: string, newDependsOn: string, sheetMemory: SheetMemory): boolean 
 *    - add a cell dependency to a cell, if the new dependency introduces a circular dependency, then return false
 * 1. getComputationOrder(sheetMemory: SheetMemory): string[]
 *   - get the computation order for the sheet this way the FormulaEvaluator can compute the cells in the correct order
 * 
 * Internal routines marked private
 * 
 * 1. updateDependencies(sheetMemory: SheetMemory): void
 *  - update the dependencies for all cells in the sheet
 * 2. updateComputationOrder(sheetMemory: SheetMemory): string[]
 * - update the computation order for the sheet
 * 3. expandDependencies(cellLabel: string, sheetMemory: SheetMemory): [boolean, string[]]
 * - expand the dependencies of a cell recursively 
 * 
 */

import SheetMemory from "./SheetMemory";
import Cell from "./Cell";
import FormulaEvaluator from "./FormulaEvaluator";
import { ErrorMessages } from "./GlobalDefinitions";



export default class CalculationManager {

    // Update the dependency graph of the sheet
    // get the computation order
    // compute the cells in the computation order
    // update the cells in the sheet memory
    public evaluateSheet(sheetMemory: SheetMemory): void {
            
        // update the dependencies
        this.updateDependencies(sheetMemory);

        // get the computation order
        const computationOrder = this.updateComputationOrder(sheetMemory);

        // compute the cells in the computation order
        this.computeCells(computationOrder, sheetMemory);

        // update the cells in the sheet memory
        this.updateCells(sheetMemory);
    }



    /**
     *  checck to see if it is ok to add a cell to the formula in the current cell.
     * 
     * @param {string} currentCellLabel - The label of the cell
     * @param {SheetMemory} sheetMemory - The sheet memory
     * */
    public okToAddNewDependency(currentCellLabel: string, newDependsOnCell: string, sheetMemory: SheetMemory): boolean {
        const visited: Set<string> = new Set();
    
        const isCircular = (cellLabel: string): boolean => {
            if (!visited.has(cellLabel)) {
                visited.add(cellLabel);
                const cell = sheetMemory.getCellByLabel(cellLabel);
                const dependsOn = cell.getDependsOn();
    
                if (dependsOn.includes(currentCellLabel)) {
                    return true;
                }
    
                for (const dependsOnCell of dependsOn) {
                    if (isCircular(dependsOnCell)) {
                        return true;
                    }
                }
            }
            return false;
        };
    
        return !isCircular(newDependsOnCell);
    }
    



    /**
     * use the formulas to extract the dependencies for each cell
     * */
    public updateDependencies(sheetMemory: SheetMemory) {
        // for each cell in the sheet
        // get the formula
        // get the dependencies
        // set the dependencies for the cell

        for (let row = 0; row < sheetMemory.getNumRows(); row++) {
            for (let column = 0; column < sheetMemory.getNumColumns(); column++) {
                const cell = sheetMemory.getCellByCoordinates(column, row);
                const formula = cell.getFormula();
                const dependencies = this.getDependencies(formula);
                cell.setDependsOn(dependencies);
            }
        }
    }

    /**
     * get the computation order for the sheet
     * @param {SheetMemory} sheetMemory - The sheet memory
     * @returns {string[]} - The computation order 
     * topological sort (hint)
     * 
     * */
    public updateComputationOrder(sheetMemory: SheetMemory): string[] {
        const computationOrder: string[] = [];
        const visited: string[] = [];
    
        for (let row = 0; row < sheetMemory.getNumRows(); row++) {
            for (let column = 0; column < sheetMemory.getNumColumns(); column++) {
                const cellLabel = this.getLabelFromCoordinates(column, row);
                if (!visited.includes(cellLabel)) {
                    this.expandDependencies(cellLabel, sheetMemory, computationOrder, visited);
                }
            }
        }
    
        // Sort the computationOrder array based on the number of dependencies for each cell
        computationOrder.sort((cellA, cellB) => {
            const cellADependencies = sheetMemory.getCellByLabel(cellA).getDependsOn().length;
            const cellBDependencies = sheetMemory.getCellByLabel(cellB).getDependsOn().length;
            return cellADependencies - cellBDependencies;
        });
    
        return computationOrder;
    }
    
    

    /**
     * expand the dependencies of a cell recursively
     * @param {string} cellLabel - The label of the cell
     * @param {SheetMemory} sheetMemory - The sheet memory
     * @param {string[]} computationOrder - The computation order
     * @param {string[]} visited - The visited cells
     * @returns {void}
     * */
    public expandDependencies(
        cellLabel: string,
        sheetMemory: SheetMemory,
        computationOrder: string[],
        visited: string[]
    ) {
        const cell = sheetMemory.getCellByLabel(cellLabel);
        const dependsOn = cell.getDependsOn();
    
        // If the cell is not in the visited array,
        // add the cell to the visited array
        // for each cell that the cell depends on
        // expand the dependencies of the cell
        // add the cell to the computation order
    
        if (!visited.includes(cellLabel)) {
            visited.push(cellLabel);
            for (let dependsOnCell of dependsOn) {
                this.expandDependencies(dependsOnCell, sheetMemory, computationOrder, visited);
            }
            computationOrder.push(cellLabel);
        }
    }
    

    /**
     * compute the cells in the computation order
     * @param {string[]} computationOrder - The computation order
     * @param {SheetMemory} sheetMemory - The sheet memory
     * */
    public computeCells(computationOrder: string[], sheetMemory: SheetMemory) {
        // for each cell in the computation order
        // get the formula
        // evaluate the formula
        // set the value of the cell to the result of the evaluation

        for (let cellLabel of computationOrder) {
            const cell = sheetMemory.getCellByLabel(cellLabel);
            const dependsOn = cell.getDependsOn();
            let emptyCell = false;
            
            // If any of the cells it depends on is empty, set the value to 0 and set the error to invalidCell
            // Otherwise evaluate the formula and set the value and the error for the cell
            for (let dependsOnCell of dependsOn) {
                const cell = sheetMemory.getCellByLabel(dependsOnCell);
                if (cell.getValue() === 0) {
                    emptyCell = true;
                    break;
                }
            }
            if (emptyCell) {
                cell.setValue(0);
                cell.setError(ErrorMessages.invalidCell);
            } else {
                cell.setError("");
                const formula = cell.getFormula();
                const formulaEvaluator = new FormulaEvaluator(sheetMemory);
                formulaEvaluator.evaluate(formula);
                cell.setValue(formulaEvaluator.result);
                cell.setError(formulaEvaluator.error);
            }
        }
    }



    /**
     * get the dependencies for a formula
     * @param {string[]} formula - The formula
     * @returns {string[]} - The dependencies
     * */
    public getDependencies(formula: string[]): string[] {
        let resultingDependencies: string[] = [];

        // for each token in the formula
        // if the token is a cell reference
        // add the cell reference to the dependencies

        for (let token of formula) {
            if (this.isCellReference(token)) {
                resultingDependencies.push(token);
            }
        }

        return resultingDependencies;
    }    

    /**
     * check to see if a token is a cell reference
     * @param {string} token - The token
     * @returns {boolean} - true if the token is a cell reference
     * */
    private isCellReference(token: string): boolean {
        return Cell.isValidCellLabel(token);
    }

    /**
     * get the label of a cell from the coordinates
     * @param {number} column - The column
     * @param {number} row - The row
     * @returns {string} - The label
     * */
    private getLabelFromCoordinates(column: number, row: number): string {
        return String.fromCharCode(column + 65) + (row + 1);
    }

    /**
     * update the cells in the sheet memory
     * @param {SheetMemory} sheetMemory - The sheet memory
     * */
    private updateCells(sheetMemory: SheetMemory) {
        // for each cell in the sheet
        // get the value
        // get the error
        // set the value and the error for the cell

        for (let row = 0; row < sheetMemory.getNumRows(); row++) {
            for (let column = 0; column < sheetMemory.getNumColumns(); column++) {
                const cell = sheetMemory.getCellByCoordinates(column, row);
                const value = cell.getValue();
                const error = cell.getError();
                cell.setValue(value);
                cell.setError(error);
            }
        }
    }
}
