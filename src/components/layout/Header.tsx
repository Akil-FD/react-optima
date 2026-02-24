import React, { useState, useRef, useEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import { FaSearch } from "react-icons/fa";
import Button from "../ui/Button/Button";

const Header: React.FC = () => {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const firstNameRaw = user?.name.split(" ")[0] || "";
    const lastNameRaw = user?.name.split(" ")[1] || "";

    const firstName = firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1);
    const lastName = lastNameRaw.charAt(0).toUpperCase() + lastNameRaw.slice(1);


    return (
        <header className="header">
            <div></div>
            <div className="header-left">
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                />
                <button className="search-btn"><FaSearch /></button>
            </div>

            {isAuthenticated &&
                <div className="profile-wrapper" ref={dropdownRef}>
                    <div
                        className="profile-trigger"
                        onClick={() => setOpen(!open)}
                    >
                        <div className="avatar">
                            {firstName.charAt(0).toUpperCase()}
                        </div>
                        <span className="profile-name">{firstName}</span>
                        <span className="arrow">▾</span>
                    </div>

                    {open && (
                        <div className="profile-dropdown">
                            <div className="profile-row">
                                <p>First Name :</p>
                                <p>{firstName}</p>
                            </div>
                            <div className="profile-row">
                                <p>Last Name :</p>
                                <p>{lastName}</p>
                            </div>
                            <div className="profile-row">
                                <p>Email ID :</p>
                                <p>{user?.email}</p>
                            </div>
                            <div className="profile-row">
                                <p>Mobile Number :</p>
                                <p>{user?.mobile}</p>
                            </div>
                            <div className="profile-row">
                                <p>Designation :</p>
                                <p>{user?.role}</p>
                            </div>
                            <div className="profile-row">
                                <p>Organisation :</p>
                                <p>Your Company</p>
                            </div>
                        </div>
                    )}
                </div> ||
                <>
                    <div>
                        <Button className="btn-create-account" variant="filled">Create Your Account</Button>
                    </div>
                </>}
        </header>
    );
};

export default Header;