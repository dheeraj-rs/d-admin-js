import { classNames } from "@/utils";
import React, { useContext, useEffect, useState } from "react";
import { LayoutContext } from "./context/layoutcontext";

const AppConfig = () => {
  const [scales] = useState([12, 13, 14, 15, 16]);
  const { layoutConfig, setLayoutConfig } = useContext(LayoutContext);

  const changeMenuMode = (value) => {
    setLayoutConfig((prevState) => ({
      ...prevState,
      menuMode: value,
    }));
  };

  const changeNavbarMode = (value) => {
    setLayoutConfig((prevState) => ({
      ...prevState,
      navbarMode: value,
    }));
  };

  const changeTheme = (theme, colorScheme) => {
    const themeLink = document.getElementById("theme-css");
    const newHref = `/themes/${theme}/theme.css`;
    replaceLink(themeLink, newHref);
    setLayoutConfig((prevState) => ({ ...prevState, theme, colorScheme }));
  };

  const replaceLink = (linkElement, href, callback) => {
    if (isIE()) {
      linkElement.setAttribute("href", href);
      if (callback) {
        callback();
      }
    } else {
      const id = linkElement.getAttribute("id");
      const cloneLinkElement = linkElement.cloneNode(true);
      cloneLinkElement.setAttribute("href", href);
      cloneLinkElement.setAttribute("id", id + "-clone");
      linkElement.parentNode.insertBefore(
        cloneLinkElement,
        linkElement.nextSibling
      );
      cloneLinkElement.addEventListener("load", () => {
        linkElement.remove();
        cloneLinkElement.setAttribute("id", id);
        if (callback) {
          callback();
        }
      });
    }
  };

  const isIE = () => {
    return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
  };

  const adjustScale = (increment) => {
    setLayoutConfig((prevState) => ({
      ...prevState,
      scale: prevState.scale + increment,
    }));
  };

  useEffect(() => {
    document.documentElement.style.fontSize = layoutConfig.scale + "px";
  }, [layoutConfig.scale]);

  const themes = [
    {
      category: "PrimeOne Design",
      theme: "lara-light-indigo",
      label: "Lara Light Indigo",
      scheme: "light",
      image: "/layout/images/themes/lara-light-indigo.png",
    },
    {
      category: "PrimeOne Design",
      theme: "lara-dark-indigo",
      label: "Lara Dark Indigo",
      scheme: "dark",
      image: "/layout/images/themes/lara-dark-indigo.png",
    },
    {
      category: "PrimeOne Design",
      theme: "lara-light-teal",
      label: "Lara Light Teal",
      scheme: "light",
      image: "/layout/images/themes/lara-light-teal.png",
    },
    {
      category: "PrimeOne Design",
      theme: "lara-dark-teal",
      label: "Lara Dark Teal",
      scheme: "dark",
      image: "/layout/images/themes/lara-dark-teal.png",
    },
  ];

  return (
    <div className="config-container">
      <h3>Sidebar</h3>
      <div className="button-group">
        {["auto", "static", "overlay"].map((type) => (
          <button
            key={type}
            className={layoutConfig?.menuMode === type ? "active" : ""}
            onClick={() => changeMenuMode(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <h3>Navbar</h3>
      <div className="button-group">
        {["static", "overlay"].map((type) => (
          <button
            key={type}
            className={layoutConfig?.navbarMode === type ? "active" : ""}
            onClick={() => changeNavbarMode(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <h3>Scale</h3>
      <div className="config-scale">
        <button
          className="layout-config-button"
          onClick={() => adjustScale(-1)}
          disabled={layoutConfig.scale === scales[0]}
        >
          <i className="pi pi-minus"></i>
        </button>
        <div className="config-scale-indicators">
          {scales.map((item) => (
            <i
              className={`scale-indicator ${
                item === layoutConfig.scale ? "scale-active" : "scale-inactive"
              }`}
              key={item}
            ></i>
          ))}
        </div>
        <button
          className="layout-config-button"
          onClick={() => adjustScale(1)}
          disabled={layoutConfig.scale === scales[scales.length - 1]}
        >
          <i className="pi pi-plus"></i>
        </button>
      </div>

      <h3>Theme</h3>
      <div className="theme-toggle">
        <div className="config-theme-options">
          {themes.map(({ theme, label, scheme }) => (
            <button
              key={theme}
              className={`theme-btn ${theme}`}
              onClick={() => changeTheme(theme, scheme)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppConfig;
