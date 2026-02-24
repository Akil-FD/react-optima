import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {label && (
          <label
            className={`input-label ${error ? "label-error" : ""} ${className}`}>
            {label}
            {props.required && <span className="required">*</span>}
          </label>
        )}

        <input
          ref={ref}
          autoComplete="off"
          className={`input-field ${error ? "input-error" : ""} ${className}`}
          {...props}
        />

        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }
);

export default Input;
