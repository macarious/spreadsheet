const hostname = window.location.hostname;
const baseURL = `http://${hostname}:3005`;

/**
 * A helper class to communicate with the server. Build requests and parse responses.
 */
export default class SpreadSheetClient {
  
  static async getCreatedDocuments(): Promise<string[]> {
    const response = await fetch(`${baseURL}/createdDocuments`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  }
  
  static async createDocument(
    documentName: string
  ): Promise<{ message: string }> {
    const response = await fetch(
      `${baseURL}/createSpreadsheet/${documentName}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return { message: "Document created" };
  }

  //function that deletes documents given the name
  static async deleteDocument(
    documentName: string
  ): Promise<{ message: string }> {
    const response = await fetch(
      `${baseURL}/deleteSpreadsheet/${documentName}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return { message: "Document deleted" };
  }

  static async fetchData(
    documentName: string
  ): Promise<{ [label: string]: string[] }> {
    const response = await fetch(
      `${baseURL}/documents/${documentName}/sheetState`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  }

  static async lockCell(
    documentName: string,
    cellLabel: string,
    userName: string
  ): Promise<{ status: string; editingBy?: string }> {
    const response = await fetch(
      `${baseURL}/documents/${documentName}/lockCell`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cellLabel, userName }),
      }
    );
    return await response.json();
  }

  static async checkCellStatus(
    documentName: string,
    cellLabel: string
  ): Promise<{ editingBy: string | null }> {
    const response = await fetch(
      `${baseURL}/documents/${documentName}/cellStatus/${cellLabel}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  }

  static async updateCell(
    documentName: string,
    cellLabel: string,
    formula: string[],
    userName: string
  ): Promise<{ status: string; version: string }> {
    const response = await fetch(
      `${baseURL}/documents/${documentName}/updateCell`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cellLabel, formula, userName }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  }

  static async unlockCell(
    documentName: string,
    cellLabel: string,
    userName: string
  ): Promise<{ status: string }> {
    const response = await fetch(
      `${baseURL}/documents/${documentName}/unlockCell`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cellLabel, userName }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  }

  static async getVersion(documentName: string): Promise<{ version: string }> {
    const response = await fetch(
      `${baseURL}/documents/${documentName}/getVersion`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  }
}
