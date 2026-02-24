import { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
  options: string[];
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export default function Dropdown({
  options,
  defaultValue = "Select",
  className = "",
  onChange,
}: CustomSelectProps) {
  const [selected, setSelected] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
    if (onChange) onChange(option);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`select-container ${className}`} ref={dropdownRef}>
      <div className="select-header" onClick={() => setOpen(!open)}>
        {selected}
        <span className={`arrow ${open ? "rotate" : ""}`}>▼</span>
      </div>

      {open && (
        <div className="select-dropdown">
          {options.map((option) => (
            <div
              key={option}
              className={`select-option ${selected === option ? "active" : ""}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}