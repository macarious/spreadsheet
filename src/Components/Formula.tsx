import { Card } from "react-bootstrap";

import "../styles/Formula.css";

// FormulaComponentProps
// we pass in value for the formula
// and the value for the current result
type FormulaProps = {
  formulaString: string;
  resultString: string;
}; // interface FormulaProps

const Formula: React.FC<FormulaProps> = ({ formulaString, resultString }) => {
  return (
    <div className="formula-container">
      <Card
        className="d-flex flex-row justify-content-center align-items-center p-2"
        style={{
          backgroundColor: "#96e3ff",
          width: "95%",
          border: "3px solid #5dc7ec",
        }}
      >
        <span className="formula-title" data-testid="FormulaTitle">
          Formula{" "}
        </span>
        <div className="formula">
          <span data-testid="FormulaValue">{formulaString} </span>
        </div>
      </Card>
      <Card
        className="d-flex flex-row justify-content-center align-items-center p-2"
        style={{
          backgroundColor: "#96e3ff",
          width: "95%",
          border: "3px solid #5dc7ec",
        }}
      >
        <span className="formula-title" data-testid="Result">
          Result
        </span>
        <div className="result">
          <span data-testid="FormulaResult">{resultString}</span>
        </div>
      </Card>
    </div>
  );
}; // const Formula

export default Formula;
