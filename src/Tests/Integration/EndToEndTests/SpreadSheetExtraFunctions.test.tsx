/**
 * @jest-environment jsdom
 */

import React from "react";

import { render, fireEvent, screen, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SpreadSheet from "../../../Components/SpreadSheet";

import KeyPad from "../../../Components/KeyPad";

import SpreadSheetController from "../../../Engine/SpreadSheetController";

import { ErrorMessages } from "../../../Engine/GlobalDefinitions";
import { after } from "node:test";
import { act } from "react-dom/test-utils";

/**
 * test extra functions: x^2 and x^3
 * click the button A1 and enter 25
 * check if x^2 is 625
 * check if x^3 is 15625
 */
describe("SpreadSheet test x^2", () => {
    it("bbb", () => {
    // it("selects A1 enters 25 then presses done then selects A1 clicks on edit then clicks on x^2 and sees 625", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet documentName=""/>
        );
        const statusComponent = getByTestId("StatusComponent");
        const formulaValue = getByTestId("FormulaValue");
        const formulaResult = getByTestId("FormulaResult");
        const A1cell = getByTestId("A1");
        const x2_button = getByTestId("square-button");
        const x3_button = getByTestId("cube-button");
        const done_button = getByTestId("edit-toggle-button");

        fireEvent.click(A1cell);
        expect(statusComponent).toHaveTextContent("current cell: A1");
        fireEvent.click(getByText("2"));
        fireEvent.click(getByText("5"));
        expect(statusComponent).toHaveTextContent("editing: A1");
        expect(formulaValue).toHaveTextContent("25");
        fireEvent.click(done_button);
        expect(statusComponent).toHaveTextContent("current cell: A1");
        fireEvent.click(A1cell);
        expect(statusComponent).toHaveTextContent("current cell: A1");
        fireEvent.click(done_button);
        expect(statusComponent).toHaveTextContent("editing: A1");
        fireEvent.click(x2_button);
        expect(statusComponent).toHaveTextContent("editing: A1");
        expect(formulaValue).toHaveTextContent("x^2");
        expect(formulaResult).toHaveTextContent("625");
        fireEvent.click(done_button);
        expect(statusComponent).toHaveTextContent("current cell: A1");
        fireEvent.click(A1cell);
        expect(statusComponent).toHaveTextContent("current cell: A1");
        fireEvent.click(done_button);
        expect(statusComponent).toHaveTextContent("editing: A1");
        fireEvent.click(x3_button);
        expect(statusComponent).toHaveTextContent("editing: A1");
        expect(formulaValue).toHaveTextContent("x^3");
        expect(formulaResult).toHaveTextContent("15625");
    });
});
