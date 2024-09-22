"use client";
import React, { createContext } from "react";

export const LayoutContext = createContext({});
export const LayoutProvider = ({ children }) => {
  const value = {};
  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};
