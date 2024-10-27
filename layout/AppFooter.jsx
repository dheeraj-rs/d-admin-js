import React, { useContext } from "react";
import { LayoutContext } from "./context/layoutcontext";
import Image from "next/image";

function AppFooter() {
  const { layoutConfig } = useContext(LayoutContext);

  return (
    <div className="layout__footer">
      <Image
        src={`/layout/logo-${
          layoutConfig.colorScheme === "light" ? "dark" : "white"
        }.svg`}
        alt="Logo"
        height="20"
        width="20"
        className="mr-2"
      />
      by
      <span className="font-medium ml-2">AppFooter</span>
    </div>
  );
}

export default AppFooter;
