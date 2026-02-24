import React, { type ReactNode } from "react";

export interface Option {
    label: ReactNode;
    value: string;
}

interface CheckboxProps {
    label?: ReactNode;               
    options?: Option[];
    value: boolean | string[];
    onChange: (value: any) => void;
    multiple?: boolean;
    error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    options = [],
    value,
    onChange,
    multiple = false,
    error,
}) => {
    const handleSingleChange = () => {
        onChange(!value);
    };

    const handleMultiChange = (val: string) => {
        const selected = value as string[];

        if (selected.includes(val)) {
            onChange(selected.filter((v) => v !== val));
        } else {
            onChange([...selected, val]);
        }
    };

    return (
        <div className="checkbox-wrapper">
            {!multiple ? (
                <label className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={handleSingleChange}
                    />
                    <span className="custom-checkmark" />
                    <span className="checkbox-label">{label}</span>
                </label>
            ) : (
                <>
                    {label && (
                        <div className="checkbox-group-label">{label}</div>
                    )}

                    {options.map((option) => (
                        <label key={option.value} className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={(value as string[]).includes(option.value)}
                                onChange={() => handleMultiChange(option.value)}
                            />
                            <span className="custom-checkmark" />
                            <span className="checkbox-label">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </>
            )}

            {error && <p className="error-text">{error}</p>}
        </div>
    );
};

export default Checkbox;
