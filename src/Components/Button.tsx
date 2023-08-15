import React from "react";
import "../styles/Button.css";

/**
 * Button component
 */

interface ButtonProps {
  text: string | React.ReactNode;
  isDigit: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  dataTestId: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  isDigit,
  onClick,
  className,
  dataTestId,
}) => {
  return (
    <button
      className={className}
      onClick={onClick}
      data-testid={dataTestId}
      data-is-digit={isDigit}
    >
      {text}
    </button>
  );
};

export default Button;
