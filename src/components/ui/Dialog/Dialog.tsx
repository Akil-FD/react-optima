import React from "react";
import "./Dialog.css";

export default function Dialog({ children, isOpen }: { children: React.ReactNode, isOpen: boolean }) {

    return (
        <>
            {isOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        {children}
                    </div>
                </div>
            )}
        </>
    );
};
