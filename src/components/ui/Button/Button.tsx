import React from "react";
import "./Button.css";

type ButtonVariant = "filled" | "outline";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "filled",
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
