import Cell from "./Cell"
import SheetMemory from "./SheetMemory"
import { ErrorMessages } from "./GlobalDefinitions";



export class FormulaEvaluator {
  // Define a function called update that takes a string parameter and returns a number
  private _errorOccured: boolean = false;
  private _errorMessage: string = "";
  private _currentFormula: FormulaType = [];
  private _lastResult: number = 0;
  private _sheetMemory: SheetMemory;
  private _result: number = 0;


  constructor(memory: SheetMemory) {
    this._sheetMemory = memory;
  }

  /**
   * evaluate the formula
   * @param formula
   * @returns The value of the expression in the tokenized formula
   * it also provides two properties formulaString and resultString
   * 
   * Uses a recursive descent parser to evaluate the formula
   * 
   * If the formula is empty return an empty string
   * If there is a formula and it is not valid return "error"
   * Otherwise return the value of the formula
   * 
   * The value of the formula is the value of the expression in the formula
   * 
   * The grammar for the formula is:
   * formula = expression
   * expression = term { ("+" | "-") term }
   * term = factor { ("*" | "/") factor }
   * 
   * there will be extra functions added to the project that will add more operators
   * newTerm = factor {"x^2" | "x^3" | "1/x" | "x^(1/2)" | "x^(1/3)}
   * newTriFunctions = factor {"sin" | "cos" | "tan" | "sin^-1" | "cos^-1" | "tan^-1"}
   * newFunctions = factor {"Rand"}
   * newSigns = term {"+/-"}
   * 
   * factor = number | "(" expression ")" | cellReference
   * cellReference = a string of letters followed by a string of digits
   * 
   * adding extra functions for the calculator
   * term = factor { ("*" | "/" | "x^2" | "x^3" | "1/x" | "x^(1/2)" | "x ^(1/3)" | "sin" | "cos" | "tan" | "sin^(-1)" | "cos^(-1)" | "tan^(-1)" | "Rand" | "+/-") factor }
   * 
   * The value of a number is the number
   * The value of a cellReference is the value of the cell
   * The value of an expression is the value of the first term plus or minus the value of the second term
   * The value of a term is the value of the first factor times or divided by the value of the second factor
   * The value of a factor is the value of the number or the value of the expression in the parentheses or the value of the cellReference
   * 
   * Recalc will be called individually for each cell in the spreadsheet.  
   * The assumption is that any cell is dependent on other cells their values are already calculated.
   * This means that recalc can simply read the value from the memory when it encounters a cellReference
   * 
   */

  evaluate(formula: FormulaType) {

    // make a copy of the formula
    //
    // set the currentFormula to the copy of the formula
    // we do this because the parser consumes the value in currentFormula 
    this._currentFormula = [...formula];

    this._lastResult = 0;

    // if the formula is empty return ""
    if (formula.length === 0) {
      this._errorMessage = ErrorMessages.emptyFormula;
      this._result = 0;
      return;
    }
    // set the errorOccured flag
    this._errorOccured = false;

    // clear the error message
    this._errorMessage = "";

    // get the value of the expression in the formula
    let resultValue = this.expression();
    this._result = resultValue;

    // if there are still tokens in the formula set the errorOccured flag
    // if an error has occured then we dont update the error message
    if (this._currentFormula.length > 0 && !this._errorOccured) {
      this._errorOccured = true;
      this._errorMessage = ErrorMessages.invalidFormula;
    }

    // if an error occured  and the message is PARTIAL return the last result
    if (this._errorOccured) {
      this._result = this._lastResult;
    }

  }

  public get error(): string {
    return this._errorMessage
  }

  public get result(): number {
    return this._result;
  }


  /**
   * 
   * @returns The value of the factor in the tokenized formula
   */
  private expression(): number {
    if (this._errorOccured) {
      return this._lastResult;
    }
    let result = this.term();
    while (this._currentFormula.length > 0 && (this._currentFormula[0] === "+" || this._currentFormula[0] === "-")) {
      let operator = this._currentFormula.shift();
      let term = this.term();
      if (operator === "+") {
        result += term;

      } else {
        result -= term;
      }
    }
    // set the lastResult to the result
    this._lastResult = result;
    return result;
  }

  /**
   *  
   * @returns The value of the term in the tokenized formula
   *  
   */
  private term(): number {
    if (this._errorOccured) {
      return this._lastResult;
    }
    let result = this.factor();
    while (this._currentFormula.length > 0 && (this._currentFormula[0] === "*" || this._currentFormula[0] === "/" || this._currentFormula[0] === "x^2" || this._currentFormula[0] === "x^3" || this._currentFormula[0] === "1/x" || this._currentFormula[0] === "x^(1/2)" || this._currentFormula[0] === "x^(1/3)" || this._currentFormula[0] === "sin" || this._currentFormula[0] === "cos" || this._currentFormula[0] === "tan" || this._currentFormula[0] === "sin^-1" || this._currentFormula[0] === "cos^-1" || this._currentFormula[0] === "tan^-1" || this._currentFormula[0] === "Rand" || this._currentFormula[0] === "+/-")) {
      let operator = this._currentFormula.shift();
      let factor = this.factor();
      if (operator === "*") {
        result *= factor;
      } else if (operator === "/") {
        // check for divide by zero
        if (factor === 0) {
          this._errorOccured = true;
          this._errorMessage = ErrorMessages.divideByZero;
          this._lastResult = Infinity;
          return Infinity;
        }
        // we are ok, lets divide
        result /= factor;
      } else if (operator === "x^2") {
        result = Math.pow(result, 2);
      } else if(operator === "x^3") {
        result = Math.pow(result, 3);
      } else if (operator === "1/x") {
        if(result === 0){
          this._errorOccured = true;
          this._errorMessage = ErrorMessages.divideByZero;
          this._lastResult = Infinity;
          return Infinity;
        } else{
          result = 1 / result;
        }
      } else if(operator === "x^(1/2)") {
        if(result < 0){
          this._errorOccured = true;
          this._errorMessage = ErrorMessages.negativeRoot;
          this._lastResult = NaN;
          return NaN;
        } else{
          result = Math.sqrt(result);
        }
      } else if (operator === "x^(1/3)") {
        result = Math.cbrt(result);
      } else if(operator === "sin") {
          result = result % 360;
          result = result * (Math.PI / 180);
          if(result === 0){
            result = 0;
          } else if(result === 90){
            result = 1;
          } else if(result === 180){
            result = 0;
          } else if(result === 270){
            result = -1;
          } else{
            result = Math.sin(result);
          }
      } else if(operator === "cos") {
        result = result % 360;
        result = result * (Math.PI / 180);
        if(result === 0){
          result = 1;
        } else if(result === 90){
          result = 0;
        } else if(result === 180){
          result = -1;
        } else if(result === 270){
          result = 0;
        }
        else{
          result = Math.cos(result);
        }
      } else if(operator === "tan") {
        result = result % 360;
        result = result * (Math.PI / 180);
        if(result === 0){
          result = 0;
        } else if(result === 90){
          this._errorOccured = true;
          this._errorMessage = ErrorMessages.tan90;
          this._lastResult = NaN;
          return NaN;
        } else if(result === 180){
          result = 0;
        } else if(result === 270){
          this._errorOccured = true;
          this._errorMessage = ErrorMessages.tan90;
          this._lastResult = NaN;
          return NaN;
        }
        result = Math.tan(result);
      } else if(operator === "sin^-1") {
        if(result < -1 || result > 1){
          this._errorOccured = true;
          this._errorMessage = ErrorMessages.invalidInput;
          this._lastResult = NaN;
          return NaN;
        } else if(result === 0){
          result = 0;
        } else if(result === 1){
          result = 90;
        } else if(result === -1){
          result = -90;
        } else {
          result = Math.asin(result);
        }
      } else if(operator === "cos^-1") {
        if(result < -1 || result > 1){
          this._errorOccured = true;
          this._errorMessage = ErrorMessages.invalidInput;
          this._lastResult = NaN;
          return NaN;
        }else{
          result = Math.acos(result);
        }
      } else if(operator === "tan^-1") {
          result = Math.atan(result);
        } else if(operator === "Rand") {
          result = Math.random();
        }
      else if(operator === "+/-") {
        result = result * -1;
      }
    }
    // set the lastResult to the result
    this._lastResult = result;
    return result;
  }

  /**
   *  
   * @returns The value of the factor in the tokenized formula
   * 
   */
  private factor(): number {
    if (this._errorOccured) {
      return this._lastResult;
    }
    let result = 0;
    // if the formula is empty set errorOccured to true 
    // and set the errorMessage to "PARTIAL"
    // and return 0
    if (this._currentFormula.length === 0) {
      this._errorOccured = true;
      this._errorMessage = ErrorMessages.partial;
      return result;
    }

    // get the first token in the formula
    let token = this._currentFormula.shift();

    // if the token is a number set the result to the number
    // and set the lastResult to the number
    if (this.isNumber(token)) {
      result = Number(token);
      this._lastResult = result;

      // if the token is a "(" get the value of the expression
    } else if (token === "(") {
      result = this.expression();
      if (this._currentFormula.length === 0 || this._currentFormula.shift() !== ")") {
        this._errorOccured = true;
        this._errorMessage = ErrorMessages.missingParentheses;
        this._lastResult = result
      }

      // if the token is a cell reference get the value of the cell
    } else if (this.isCellReference(token)) {
      [result, this._errorMessage] = this.getCellValue(token);

      // if the cell value is a number set the result to the number
      if (this._errorMessage !== "") {
        this._errorOccured = true;
        this._lastResult = result;
      }

      // otherwise set the errorOccured flag to true  
    } else {
      this._errorOccured = true;
      this._errorMessage = ErrorMessages.invalidFormula;
    }
    return result;
  }

  /**
   * 
   * @param token 
   * @returns true if the toke can be parsed to a number
   */
  isNumber(token: TokenType): boolean {
    return !isNaN(Number(token));
  }

  /**
   * 
   * @param token
   * @returns true if the token is a cell reference
   * 
   */
  isCellReference(token: TokenType): boolean {

    return Cell.isValidCellLabel(token);
  }

  /**
   * 
   * @param token
   * @returns [value, ""] if the cell formula is not empty and has no error
   * @returns [0, error] if the cell has an error
   * @returns [0, ErrorMessages.invalidCell] if the cell formula is empty
   * 
   */
  getCellValue(token: TokenType): [number, string] {
    // if the cell formula is empty return [0, ErrorMessages.invalidCell]
    if (token === "") {
      return [0, ErrorMessages.invalidCell];

    // if the cell formula is not empty get the cell value
    } else {
      let cell = this._sheetMemory.getCellByLabel(token);
      let cellValue = cell.getValue();
      let cellError = cell.getError();
      if (cellError !== "") {
        return [0, cellError];
      } else {
        return [cellValue, ""];
      }
    }
  }
}

export default FormulaEvaluator;