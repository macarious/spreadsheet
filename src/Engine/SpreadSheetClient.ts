const hostname = window.location.hostname;
const baseURL = `http://${hostname}:3005`;

export default class SpreadSheetClient {

    static async fetchData(): Promise<{ [label: string]: string[] }> {
        const response = await fetch(baseURL + '/sheetState');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    }

    static async lockCell(cellLabel: string, userName: string): Promise<{ status: string; editingBy?: string }> {
        const response = await fetch(baseURL + '/lockCell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cellLabel, userName })
        });
        return await response.json();
    }

    static async checkCellStatus(cellLabel: string): Promise<{ editingBy: string | null }> {
        const response = await fetch(baseURL + `/cellStatus/${cellLabel}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    }

    static async updateCell(cellLabel: string, formula: string[], userName: string): Promise<{ status: string }> {
        const response = await fetch(baseURL + '/updateCell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cellLabel, formula, userName })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    }
}
