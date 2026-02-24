import React, { useRef, useState, useEffect } from "react";

interface OTPInputProps {
    length?: number;
    value?: string;
    error?: string;
    onChange: (otp: string) => void;
    disabled?: boolean;
}

const OTPInputComponent: React.FC<OTPInputProps> = ({
    length = 6,
    value = "",
    error,
    onChange,
    disabled = false,
}) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        const newOtp = value.split("").concat(Array(length).fill("")).slice(0, length);
        setOtp(newOtp);
    }, [value, length]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value.replace(/\D/g, "");
        if (!val) return;

        const newOtp = [...otp];
        newOtp[index] = val.slice(-1);
        setOtp(newOtp);
        onChange(newOtp.join(""));

        if (index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
                onChange(newOtp.join(""));
            } else if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        const newOtp = pasted.split("").concat(Array(length).fill("")).slice(0, length);
        setOtp(newOtp);
        onChange(newOtp.join(""));
        inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
    };

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    return (
        <div>
            <div className="otp-container">
                {Array.from({ length }).map((_, i) => (
                    <input
                        key={i}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={1}
                        value={otp[i]}
                        ref={(el) => { inputsRef.current[i] = el; }}
                        onChange={(e) => handleChange(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        onPaste={handlePaste}
                        disabled={disabled}
                        className={`input-field otp-input  ${error ? "otp-error" : ""}`}
                    />
                ))}
            </div>
            {error && <p className="error-text">{error}</p>}
        </div>
    );
};

const OTPInput = React.memo(OTPInputComponent, (prevProps, nextProps) => {
    return (
        prevProps.value === nextProps.value &&
        prevProps.error === nextProps.error &&
        prevProps.disabled === nextProps.disabled &&
        prevProps.length === nextProps.length
    );
});

export default OTPInput;
