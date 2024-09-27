import React from "react";
const AppTopbar = () => {
  return (
    <div className="topbar-main">
      <div className="topbar-header">
        <nav className="breadcrumb">
          <span className="breadcrumb-link">Pages</span> / Main Page
        </nav>
        <h1 className="title">Main Page</h1>
      </div>
      <div className="topbar-config">
        <div className="search-bar">
          <input type="text" placeholder="Search..." className="search-input" />
          <span className="search-icon">&#128269;</span>
        </div>
        <div className="icons">
          <button className="icon-button">&#128276;</button>
          <button className="icon-button">&#127769;</button>
        </div>
        <div className="user-profile">🧑🏻‍⚖️</div>
      </div>
    </div>
  );
};

export default AppTopbar;
