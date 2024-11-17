import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

const ToolButton = ({ children, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={clsx(
        "p-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",
        isActive && "bg-black text-white"
      )}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );
};

ToolButton.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};


export default ToolButton;
