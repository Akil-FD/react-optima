import React from "react";
import "./MobileNumber.css";

export interface CountryOption {
    code: string;
    label: string;
    flag: string;
}

interface MobileNumberInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    countries: CountryOption[];
    selectedCountry: string;
    onCountryChange: (code: string) => void;
}

const MobileNumber = React.forwardRef<
    HTMLInputElement,
    MobileNumberInputProps
>(
    (
        {
            label,
            error,
            countries,
            selectedCountry,
            onCountryChange,
            className = "",
            ...props
        },
        ref
    ) => {
        const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            e.target.value = e.target.value.replace(/\D/g, "");
            props.onChange?.(e);
        };

        return (
            <div className="mobile-wrapper">
                <label
                    className={`input-label ${error ? "label-error" : ""} ${className}`}>
                    {label}
                    {props.required && <span className="required">*</span>}
                </label>

                <div className={`mobile-container ${error ? "error" : ""}`}>
                    <select
                        className="country-select"
                        value={selectedCountry}
                        onChange={(e) => onCountryChange(e.target.value)}
                    >
                        {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                                {country.flag} ({country.code})
                            </option>
                        ))}
                    </select>

                    <input
                        ref={ref}
                        type="tel"
                        maxLength={10}
                        className={`mobile-input ${className}`}
                        onChange={handleInput}
                        {...props}
                    />
                </div>

                {error && <p className="mobile-error">{error}</p>}
            </div>
        );
    }
);

export default MobileNumber;
