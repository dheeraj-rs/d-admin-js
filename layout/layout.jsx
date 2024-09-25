"use client";
import React, { useState } from "react";
import AppTopbar from "./AppTopbar";
import AppSidebar from "./AppSidebar";
import AppFooter from "./AppFooter";

function Layout({ children }) {
  const [activeClasses, setActiveClasses] = useState({
    "layout-mobile-active": false,
    "layout-overlay": false,
    "layout-overlay-active": false,
    "layout-static": false,
    "layout-topbar-static": false,
    "layout-sidebar-overlay": false,
  });

  // Function to toggle a class
  const toggleClass = (className) => {
    setActiveClasses((prevState) => ({
      ...prevState,
      [className]: !prevState[className],
    }));
  };

  // Dynamically generate the container class string based on activeClasses
  const containerClass = Object.keys(activeClasses)
    .filter((className) => activeClasses[className])
    .join(" ");

  // Style for active and inactive buttons
  const getButtonStyle = (isActive) => ({
    backgroundColor: isActive ? "#4caf50" : "#f0f0f0",
    color: isActive ? "white" : "black",
    padding: "10px 15px",
    margin: "5px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  });

  return (
    <div className={`layout-wrapper ${containerClass}`}>
      <div className="layout-sidebar">
        <AppSidebar />
      </div>
      <div className="layout-topbar">
        <AppTopbar />
      </div>
      <div className="layout-main-container">
        <div className="layout-main">
          {children}
          <div
            style={{
              width: "100%",
              height: "100%",
              flexDirection: "column",
            }}
          >
            <button
              style={getButtonStyle(activeClasses["static-sidebar"])}
              onClick={() => toggleClass("static-sidebar")}
            >
              STATIC SIDEBAR
            </button>
            <button
              style={getButtonStyle(activeClasses["overlay-layout"])}
              onClick={() => toggleClass("overlay-layout")}
            >
              OVERLY LAYOUT
            </button>
            <button
              style={getButtonStyle(activeClasses["toggle-sidebar"])}
              onClick={() => toggleClass("toggle-sidebar")}
            >
              TOOGLE SIDEBAR
            </button>
            <button
              style={getButtonStyle(activeClasses["overlay-topbar"])}
              onClick={() => toggleClass("overlay-topbar")}
            >
              OVERLY TOPBAR
            </button>
          </div>
        </div>
        <AppFooter />
      </div>
      <div className="layout-mask"></div>
    </div>
  );
}

export default Layout;
