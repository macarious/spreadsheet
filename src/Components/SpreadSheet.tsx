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

  // setInterval(async () => {
  //   try {
  //     const serverData = await SpreadSheetClient.fetchData();
  //     spreadSheetController.initFromServerData(serverData);
  //     updateDisplayValues();
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }, 1000);

  async function toggleEditing(cellLabel: string, userName: string) {
    if (!currentlyEditing) { // If transitioning to editing mode
        const response = await SpreadSheetClient.lockCell(cellLabel, userName);
        if (response.status === 'locked') {
          spreadSheetController.setEditStatus(true);
        } else {
          // Handle the scenario where another user has locked the cell
          alert(`Cell is already being edited by ${response.editingBy}`);
        }
    } else { // If transitioning out of editing mode
      spreadSheetController.setEditStatus(false);
      try {
        const cellData = spreadSheetController.getFormula();
        const response = await SpreadSheetClient.updateCell(cellLabel, cellData, userName);
        console.log(response.status); // Handle this response as needed
      } catch (error) {
        console.error("Error updating cell:", error);
      }
    }
    setStatusString(spreadSheetController.getEditStatusString());
    updateDisplayValues();
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
    const username = (document.getElementById("username") as HTMLInputElement).value
    const cellLabel = spreadSheetController.getWorkingCellLabel();
    if (username === "") {
      alert("Please enter a username");
      return;
    }
    switch (text) {
      case ButtonNames.edit_toggle:
        await toggleEditing(cellLabel, username);
        break;
      case ButtonNames.clear:
        spreadSheetController.removeToken();
        break;
      case ButtonNames.allClear:
        spreadSheetController.clearFormula();
        break;

      default:
        break;
    }
    // update the display values
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
  async function onButtonClick(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    const username = (document.getElementById("username") as HTMLInputElement).value;
    if (username === "") {
      alert("Please enter a username");
      return;
    }
    const cellLabel = spreadSheetController.getWorkingCellLabel();
    const text = event.currentTarget.textContent;
    let trueText = text ? text : "";

    try {
        const response = await SpreadSheetClient.lockCell(cellLabel, username);
        if (response.status === 'locked') {
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
  function onCellClick(event: React.MouseEvent<HTMLButtonElement>): void {
    const cellLabel = event.currentTarget.getAttribute("cell-label");
    const editStatus = spreadSheetController.getEditStatus();
    let realCellLabel = cellLabel ? cellLabel : "";

    // if the edit status is true then add the token to the machine
    if (editStatus) {
      spreadSheetController.addCell(realCellLabel); // this will never be ""
      updateDisplayValues();
    }
    // if the edit status is false then set the current cell to the clicked on cell
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
