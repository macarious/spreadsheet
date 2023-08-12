import React, { useEffect, useState } from "react";
import Formula from "./Formula";
import Status from "./Status";
import KeyPad from "./KeyPad";
import SpreadSheetController from "../Engine/SpreadSheetController";
import SheetHolder from "./SheetHolder";

import { ButtonNames } from "../Engine/GlobalDefinitions";
import SpreadSheetClient from "../Engine/SpreadSheetClient";

/**
 * the main component for the Spreadsheet.  It is the parent of all the other components
 *
 *
 * */

// make this a variable so we can resize it later (this would necessitate a new machine)
let spreadSheetController: SpreadSheetController = new SpreadSheetController(
  5,
  8
);

function SpreadSheet() {
  const [formulaString, setFormulaString] = useState(
    spreadSheetController.getFormulaString()
  );
  const [resultString, setResultString] = useState(
    spreadSheetController.getResultString()
  );
  const [cells, setCells] = useState(
    spreadSheetController.getSheetDisplayStringsForGUI()
  );
  const [statusString, setStatusString] = useState(
    spreadSheetController.getEditStatusString()
  );
  const [currentCell, setCurrentCell] = useState(
    spreadSheetController.getWorkingCellLabel()
  );
  const [currentlyEditing, setCurrentlyEditing] = useState(
    spreadSheetController.getEditStatus()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [clientVersion, setClientVersion] = useState(0);

  // fetch data from server and initialize controller when the page is loaded
  // the page does not display until the data is fetched
  useEffect(() => {
    async function fetchDataAndInitController() {
      try {
        setLoading(true);
        const serverData = await SpreadSheetClient.fetchData();
        spreadSheetController.initFromServerData(serverData);
        updateDisplayValues();
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDataAndInitController();
  }, []);

  // check for updates from server every 333ms
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const serverVersion = await SpreadSheetClient.getVersion(); 
        const numberServerVersion = Number(serverVersion.version);
        // check if server version is greater than client version
        if (numberServerVersion > clientVersion) {
          const serverData = await SpreadSheetClient.fetchData();
          spreadSheetController.initFromServerData(serverData);
          updateDisplayValues();
          setClientVersion(numberServerVersion);
        }
      } catch (error) {
        console.error("Error fetching version/data:", error);
      }
    }, 333);
    
    // Cleanup interval when component is unmounted
    return () => clearInterval(interval);
}, [clientVersion]);



  async function lockCell(
    cellLabel: string,
    userName: string
  ): Promise<string> {
    try {
      const response = await SpreadSheetClient.lockCell(cellLabel, userName);
      if (response.status === "locked") {
        return "locked";
      } else {
        alert(`Cell is already being edited by ${response.editingBy}`);
        return "alreadyLocked";
      }
    } catch (error) {
      console.error("Error locking cell:", error);
      return "error";
    }
  }

  async function unlockCell(
    cellLabel: string,
    userName: string
  ): Promise<string> {
    try {
      const response = await SpreadSheetClient.unlockCell(cellLabel, userName);
      if (response.status === "unlocked") {
        return "unlocked";
      } else {
        return "error";
      }
    } catch (error) {
      console.error("Error unlocking cell:", error);
      return "error";
    }
  }

  async function updateCell(
    cellLabel: string,
    formula: string[],
    userName: string
  ): Promise<string> {
    try {
      const response = await SpreadSheetClient.updateCell(
        cellLabel,
        formula,
        userName
      );
      if (response.status === "updated") {
        setClientVersion(+response.version);
        return "updated";
      } else {
        return "error";
      }
    } catch (error) {
      console.error("Error updating cell:", error);
      return "error";
    }
  }

  function updateDisplayValues(): void {
    setFormulaString(spreadSheetController.getFormulaString());
    setResultString(spreadSheetController.getResultString());
    setStatusString(spreadSheetController.getEditStatusString());
    setCells(spreadSheetController.getSheetDisplayStringsForGUI());
    setCurrentCell(spreadSheetController.getWorkingCellLabel());
    setCurrentlyEditing(spreadSheetController.getEditStatus());
  }

  /**
   *
   * @param event
   *
   * This function is the call back for the command buttons
   *
   * It will call the machine to process the command button
   *
   * the buttons done, edit, clear, all clear, and restart do not require asynchronous processing
   *
   * the other buttons do require asynchronous processing and so the function is marked async
   */
  async function onCommandButtonClick(text: string): Promise<void> {
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    if (username === "") {
      alert("Please enter a username");
      return;
    }
    const cellLabel = spreadSheetController.getWorkingCellLabel();

    switch (text) {
      case ButtonNames.edit_toggle:
        if (spreadSheetController.getEditStatus()) {
          await updateCell(
            cellLabel,
            spreadSheetController.getFormula(),
            username
          );
          await unlockCell(cellLabel, username);
          spreadSheetController.setEditStatus(false);
        } else {
          const lockStatus = await lockCell(cellLabel, username);
          if (lockStatus === "locked") {
            spreadSheetController.setEditStatus(true);
          }
        }
        break;
      case ButtonNames.clear:
        if ((await lockCell(cellLabel, username)) === "locked") {
          spreadSheetController.removeToken();
          await updateCell(
            cellLabel,
            spreadSheetController.getFormula(),
            username
          );
          await unlockCell(cellLabel, username);
        }
        break;
      case ButtonNames.allClear:
        if ((await lockCell(cellLabel, username)) === "locked") {
          spreadSheetController.clearFormula();
          await updateCell(
            cellLabel,
            spreadSheetController.getFormula(),
            username
          );
          await unlockCell(cellLabel, username);
        }
        break;
      default:
        break;
    }
    updateDisplayValues();
  }

  /**
   *  This function is the call back for the number buttons and the Parenthesis buttons
   *
   * They all automatically start the editing of the current formula.
   *
   * @param event
   *
   * */
  async function onButtonClick(
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    if (username === "") {
      alert("Please enter a username");
      return;
    }
    const cellLabel = spreadSheetController.getWorkingCellLabel();
    const text = event.currentTarget.textContent;
    let trueText = text ? text : "";

    try {
      const response = await SpreadSheetClient.lockCell(cellLabel, username);
      if (response.status === "locked") {
        spreadSheetController.setEditStatus(true);
        spreadSheetController.addToken(trueText);
        const cellData = spreadSheetController.getFormula();
        await SpreadSheetClient.updateCell(cellLabel, cellData, username);
        updateDisplayValues();
      } else {
        // Handle the scenario where another user has locked the cell
        alert(`Cell is already being edited by ${response.editingBy}`);
      }
    } catch (error) {
      console.error("Error locking cell:", error);
    }
  }

  /**
   *
   * @param event
   *
   * This function is called when a cell is clicked
   * If the edit status is true then it will send the token to the machine.
   * If the edit status is false then it will ask the machine to update the current formula.
   */
  async function onCellClick(
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    const cellLabel = event.currentTarget.getAttribute("cell-label");
    const editStatus = spreadSheetController.getEditStatus();
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;

    let realCellLabel = cellLabel ? cellLabel : "";

    // If the edit status is true, try to lock and then update the cell with the server
    if (editStatus) {
      if (username === "") {
        alert("Please enter a username");
        return;
      }
      if ((await lockCell(spreadSheetController.getWorkingCellLabel(), username)) === "locked") {
        spreadSheetController.addCell(realCellLabel);
        await updateCell(
          spreadSheetController.getWorkingCellLabel(),
          spreadSheetController.getFormula(),
          username
        );
      }
      updateDisplayValues();
    }
    // If the edit status is false then set the current cell to the clicked on cell
    else {
      spreadSheetController.setWorkingCellByLabel(realCellLabel);
      updateDisplayValues();
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div>
      <Formula
        formulaString={formulaString}
        resultString={resultString}
      ></Formula>
      <Status statusString={statusString}></Status>
      {
        <SheetHolder
          cellsValues={cells}
          onClick={onCellClick}
          currentCell={currentCell}
          currentlyEditing={currentlyEditing}
        ></SheetHolder>
      }
      <KeyPad
        onButtonClick={onButtonClick}
        onCommandButtonClick={onCommandButtonClick}
        currentlyEditing={currentlyEditing}
      ></KeyPad>
    </div>
  );
}

export default SpreadSheet;
