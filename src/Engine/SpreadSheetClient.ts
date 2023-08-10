
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

    // Add other methods like postData() here in the future
}