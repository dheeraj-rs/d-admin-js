import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  useContext,
  useMemo,
} from "react";
import { useOutsideAlerter } from "@/hooks/use-outside-clicks";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { menuitem } from "@/public/layout/data";

// Custom classNames
const classNames = (...classes) => {
  const result = new Set();
  const addClass = (item) => {
    if (!item) return;
    if (typeof item === "string" || typeof item === "number") {
      result.add(String(item));
      return;
    }
    if (Array.isArray(item)) {
      item.forEach(addClass);
      return;
    }
    if (item?.constructor === Object) {
      Object.entries(item)
        .filter(([, value]) => value)
        .forEach(([key]) => result.add(key));
    }
  };
  classes.forEach(addClass);
  return [...result].join(" ");
};

// Custom RippleEffect
const Ripple = React.memo(({ isEnabled = true }) => {
  const inkRef = useRef(null);
  const [isRippleActive, setIsRippleActive] = useState(false);

  const createRipple = useCallback(
    (event) => {
      const ripple = inkRef.current;
      const target = ripple?.parentElement;
      if (!ripple || !target || !isEnabled) return;
      ripple.style.animation = "none";
      ripple.offsetHeight;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      Object.assign(ripple.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}px`,
        top: `${y}px`,
        animation: "ripple 0.4s linear",
      });
      setIsRippleActive(true);
    },
    [isEnabled]
  );

  useEffect(() => {
    const target = inkRef.current?.parentElement;
    if (!target || !isEnabled) return;
    target.addEventListener("pointerdown", createRipple);
    return () => target.removeEventListener("pointerdown", createRipple);
  }, [isEnabled, createRipple]);

  const onAnimationEnd = useCallback(() => {
    setIsRippleActive(false);
  }, []);

  return (
    <span
      role="presentation"
      ref={inkRef}
      className={`ripple-ink ${isRippleActive ? "active" : ""}`}
      onAnimationEnd={onAnimationEnd}
    />
  );
});

// Custom Dropdown Outer Animation Box
const DropdownOuterAnimationBox = (props) => {
  const { button, children, animation, className } = props;
  const wrapperRef = React.useRef(null);
  const [openWrapper, setOpenWrapper] = React.useState(false);
  useOutsideAlerter(wrapperRef, setOpenWrapper);

  return (
    <div ref={wrapperRef} className={`dropdown ${className}`}>
      <div
        className="dropdown__button"
        onMouseDown={() => setOpenWrapper(!openWrapper)}
      >
        {button ? (
          button
        ) : (
          <button className={`p-link layout-menu-button layout-topbar-button`}>
            <i className="pi pi-cog" />
          </button>
        )}
      </div>
      <div
        className={`dropdown__content ${animation ? animation : ""} ${
          openWrapper ? "dropdown__content--open" : "dropdown__content--closed"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// Custom Folder structured layout
const FolderLayout = ({ folderItems, ComponentRegistry, layoutHeader }) => {
  const [currentItems, setCurrentItems] = useState([]);

  const handleMenuChange = useCallback(
    (folderKey) => {
      const folder = folderItems.find((f) => f.key === folderKey);
      setCurrentItems(
        folder?.items?.sort((a, b) => a.sortOrder - b.sortOrder) || []
      );
    },
    [folderItems]
  );

  // Initialize with main folder
  React.useEffect(() => {
    handleMenuChange("main");
  }, [handleMenuChange]);

  const renderItem = (item) => {
    // Handle section type
    if (item.type === "section") {
      return <li className="config-menu__section-header">{item.label}</li>;
    }

    // Handle link type
    if (item.type === "link") {
      return (
        <li
          className="config-menu__item"
          onClick={() => handleMenuChange(item.linkedFolderId)}
        >
          <div className="config-menu__item-content">
            {item.icon && <i className={`pi pi-${item.icon}`} />}
            <p className="config-menu__item-label">{item.label}</p>
          </div>
        </li>
      );
    }

    // Handle component type
    if (item.type === "component" && ComponentRegistry[item.componentKey]) {
      return (
        <li className="config-menu__item">
          {React.createElement(ComponentRegistry[item.componentKey])}
        </li>
      );
    }

    return null;
  };

  return (
    <div className="config-box">
      {layoutHeader && (
        <div className="config-box__header">
          <p>{layoutHeader}</p>
        </div>
      )}
      <div className="config-box__content">
        <ul className="config-menu">
          {currentItems.map((item) => (
            <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Custom Searchbar Component
const LayoutSearchbar = memo(({ searchbarRef }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { setLayoutState } = useContext(LayoutContext);

  // Optimized filter function with early returns and simplified logic
  const filterMenuItems = useCallback((items, term) => {
    if (!term || !items?.length) return [];

    const termLower = term.toLowerCase();

    return items.reduce((filtered, item) => {
      // Early return for separators
      if (item.seperator) return [...filtered, item];

      const matchesSearch = item.label?.toLowerCase().includes(termLower);
      const filteredChildren = item.items
        ? filterMenuItems(item.items, term)
        : [];

      // Only process items that match or have matching children
      if (!matchesSearch && !filteredChildren.length) return filtered;

      return [
        ...filtered,
        {
          ...item,
          items: filteredChildren,
        },
      ];
    }, []);
  }, []);

  // Combined effect and memoization for filtered items
  const filteredItems = useMemo(
    () => filterMenuItems(menuitem, searchTerm),
    [searchTerm, filterMenuItems]
  );

  // Update layout state when filtered items change
  useEffect(() => {
    setLayoutState((prev) => ({
      ...prev,
      searchSidebarItems: filteredItems,
    }));
  }, [filteredItems, setLayoutState]);

  const hasResults = filteredItems.length > 0;

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        console.log(searchTerm);
      }
    },
    [searchTerm]
  );

  const handleChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const iconClassName = `pi ${
    searchTerm && !hasResults ? "pi-exclamation-triangle" : "pi-search"
  }`;
  const iconStyle = searchTerm && !hasResults ? { color: "red" } : undefined;

  return (
    <div ref={searchbarRef} className="layout__searchbar">
      <div className="searchbar-container">
        <input
          type="text"
          className="searchbar-input"
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search menu items..."
          spellCheck="false"
        />
        <div className="icon-container">
          <div className="icon">
            <i className={iconClassName} style={iconStyle} />
          </div>
        </div>
      </div>
    </div>
  );
});

export {
  classNames,
  Ripple,
  DropdownOuterAnimationBox,
  FolderLayout,
  LayoutSearchbar,
};
