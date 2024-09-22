"use client";
import React, { createContext } from "react";

export const MenuContext = createContext({});
export const MenuProvider = ({ children }) => {
  const value = {};
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
