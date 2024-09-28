/* eslint-disable react/display-name */
import React, { useState, useEffect, useRef, useCallback } from "react";

// Custom classNames
export function classNames(...classes) {
  return classes
    .filter(Boolean)
    .map((c) => {
      if (typeof c === "string" || typeof c === "number") return String(c);
      if (typeof c === "object") {
        if (Array.isArray(c)) {
          return classNames(...c);
        } else {
          return Object.keys(c)
            .filter((key) => c[key])
            .join(" ");
        }
      }
      return "";
    })
    .join(" ");
}

// Custom RippleEffect function
const rippleStyles = {
  container: {
    overflow: "hidden",
    position: "relative",
  },
  ink: {
    display: "block",
    position: "absolute",
    background: "rgba(255, 255, 255, 0.5)",
    borderRadius: "100%",
    transform: "scale(0)",
    pointerEvents: "none",
  },
  inkActive: {
    animation: "ripple 0.4s linear",
  },
};

const rippleKeyframes = `
  @keyframes ripple {
    100% {
      opacity: 0;
      transform: scale(2.5);
    }
  }
`;

export const Ripple = React.memo(({ isEnabled = true }) => {
  const inkRef = useRef(null);
  const [isRippleActive, setIsRippleActive] = useState(false);

  useEffect(() => {
    const target = inkRef.current?.parentElement;
    if (!target || !isEnabled) return;

    const createRipple = (event) => {
      const ripple = inkRef.current;
      if (!ripple) return;

      ripple.style.animation = "none";
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      ripple.style.animation = "ripple 0.4s linear";
      setIsRippleActive(true);
    };

    const onPointerDown = (event) => {
      if (isEnabled) {
        createRipple(event);
      }
    };

    target.addEventListener("pointerdown", onPointerDown);
    return () => {
      target.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isEnabled]);

  const onAnimationEnd = useCallback(() => {
    setIsRippleActive(false);
  }, []);

  return (
    <>
      <style>{rippleKeyframes}</style>
      <span
        role="presentation"
        ref={inkRef}
        style={{
          ...rippleStyles.ink,
          ...(isRippleActive ? rippleStyles.inkActive : {}),
        }}
        onAnimationEnd={onAnimationEnd}
      />
    </>
  );
});

function useOutsideAlerter(ref, setX) {
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setX(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setX]);
}

export const Dropdown = (props) => {
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
        {button}
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
