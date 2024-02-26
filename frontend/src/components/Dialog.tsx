
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

/** Dialog component props */
export type DialogProps = {
  children: React.ReactNode;
  /** Handler invoked when a user dismisses the dialog */
  onClose: () => void;
}

/** Presents a modal dialog */
export const Dialog: React.FC<DialogProps> = (props) => {
  const { children, onClose } = props;

  const el = useRef(document.createElement("div"));

  const handleDialogCloseViaEscape = ({ key }: KeyboardEvent) => {
    if (key === "Escape") {
      onClose();
    }
  };

  const handleOverlayClick: React.MouseEventHandler = ({
    currentTarget,
    target,
  }) => {
    if (currentTarget === target) {
      onClose();
    }
  };

  useEffect(() => {
    const localEl = el.current

    document.querySelector("#dialog")?.appendChild(localEl);
    document.body.classList.add("no-scroll");
    
    return () => {
      document.querySelector("#dialog")?.removeChild(localEl);
      document.body.classList.remove("no-scroll");
    };
  }, []);

  useEffect(() => {
    window.document.addEventListener("keyup", handleDialogCloseViaEscape);

    return () =>
      window.document.removeEventListener("keyup", handleDialogCloseViaEscape);
  });

  return ReactDOM.createPortal(
    <div className="overlay" onClick={handleOverlayClick}>
      <div
        aria-labelledby="dialog-title"
        className="dialog"
        role="dialog"
      >
       
       {children}
      </div>
    </div>,
    el.current
  );
};
