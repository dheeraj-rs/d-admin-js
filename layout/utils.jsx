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
