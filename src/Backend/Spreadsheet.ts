class Spreadsheet {
    state: { version: number };
    cellEditingStatus: { [key: string]: string };
    sheetState: { [key: string]: string[] };

    constructor() {
        this.state = {
            version: 0,
        };
        this.cellEditingStatus = {};
        this.sheetState = {};
    }

    lockCell(cellLabel: string, userName: string): string | null {
        if (this.cellEditingStatus[cellLabel] && this.cellEditingStatus[cellLabel] !== userName) {
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

export default Spreadsheet;
