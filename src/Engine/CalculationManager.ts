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
import FormulaBuilder from "./FormulaBuilder";
import FormulaEvaluator from "./FormulaEvaluator";



export default class CalculationManager {



    // Update the dependency graph of the sheet
    // get the computation order
    // compute the cells in the computation order
    // update the cells in the sheet memory
    public evaluateSheet(sheetMemory: SheetMemory): void {

    }



    /**
     *  checck to see if it is ok to add a cell to the formula in the current cell.
     * 
     * @param {string} currentCellLabel - The label of the cell
     * @param {sheetMemory} SheetMemory - The sheet memory
     * */
    public okToAddNewDependency(currentCellLabel: string, newDependsOnCell: string, sheetMemory: SheetMemory): boolean {
        // Use the data in the spreadsheet in the cells to determine if it is ok to insert the new dependency

        return true;
    }



    /**
     * use the formulas to extract the dependencies for each cell
     * */
    public updateDependencies(sheetMemory: SheetMemory) {

    }


    /**
     * get the computation order for the sheet
     * @param {sheetMemory} SheetMemory - The sheet memory
     * @returns {string[]} - The computation order 
     * topological sort (hint)
     * 
     * */
    public updateComputationOrder(sheetMemory: SheetMemory): string[] {
        let resultingComputationOrder: string[] = [];

        return resultingComputationOrder;
    }


}




