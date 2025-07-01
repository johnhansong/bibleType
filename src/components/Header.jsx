import React from "react"
import AccountCircle from "./AccountCircle"

const Header = () => {

  return (
    <div className="header">
      <a className="logo" href="/">
        <img
          src="/bible_icon.png"
          alt="Bible Icon"
          style={{
            width: "70px",
            height: "70px",
          }}
        />
        <div className="logo-text">
          Bible Type
        </div>
      </a>

      <div className="user-icon">
        <AccountCircle />
      </div>
    </div>
  );
};

export default Header
