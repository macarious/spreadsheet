/**
 * This file contains the database class for the spreadsheet application. The provided methods are used by the backend to update the spreadsheet state.
 */
class SpreadsheetDatabase {
    // The current version of the spreadsheet
    // Used for fast check if the spreadsheet has been updated by another user
    state = {
        version: 0,
    };

    // The current cell editing status key is the cell label and value is the user name
    cellEditingStatus: { [key: string]: string } = {};
    // The current sheet state key is the cell label and value is the formula array
    sheetState: { [key: string]: string[] } = {};

    // lock a cell for editing
    lockCell(cellLabel: string, userName: string): string | null {
        if (this.cellEditingStatus[cellLabel] && this.cellEditingStatus[cellLabel] !== userName) {
            // Cell is already being edited by someone
            return this.cellEditingStatus[cellLabel];
        }
        this.cellEditingStatus[cellLabel] = userName;
        return null;
    }

    unlockCell(cellLabel: string, userName: string): boolean {
        if (this.cellEditingStatus[cellLabel] !== userName) {
            return false;
        }
        delete this.cellEditingStatus[cellLabel];
        return true;
    }

    updateCell(cellLabel: string, formula: string[]): boolean {
        if (this.cellEditingStatus[cellLabel]) {
            this.sheetState[cellLabel] = formula;
            this.state.version += 1;
            return true;
        }
        return false;
    }

    getEditingStatus(cellLabel: string): string | null {
        return this.cellEditingStatus[cellLabel] || null;
    }
}

export default new SpreadsheetDatabase(); // Singleton instance
