import { animated, useSpring } from "react-spring";
import { ReactNode, useRef } from "react";
import ReactDOM from "react-dom";

export function InvisibleBackdrop({ onClose }: { onClose: () => void }) {
  const portalRoot = document.getElementById("portal-modal");
  if (!portalRoot) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <div onClick={onClose} className={"invisible-backdrop"}></div>,
    portalRoot
  );
}

export function Modal(props: {
  children: ReactNode;
  onClose: () => void;
  styles?: { minWidth: string };
  backdropStyle?: {};
}) {
  const backdropClick = useRef(true);
  const heldInModal = useRef(false);
  const wasClickedInModal = useRef(false);
  const backgroundSpring = useSpring({
    from: { backgroundColor: "rgba(0,0,0,0)" },
    to: { backgroundColor: "rgba(0,0,0,.4)" },
    config: { duration: 150 },
  });

  const modalSpring = useSpring({
    from: { y: "-40%", x: "-50%", opacity: 0 },
    to: { y: "-50%", x: "-50%", opacity: 1 },
    config: { duration: 200 },
  });

  const portalRoot = document.getElementById("portal-modal");
  if (!portalRoot) return <>Portal Root Not Found!</>;

  return ReactDOM.createPortal(
    <animated.div
      style={{ ...backgroundSpring, ...props.backdropStyle }}
      className="modal-background"
      onClick={() => {
        if (backdropClick.current && !wasClickedInModal.current) {
          props.onClose();
        }
        wasClickedInModal.current = false;
      }}
    >
      <animated.div
        style={{ ...modalSpring, ...props.styles }}
        className="modal"
        onMouseEnter={() => {
          backdropClick.current = false;
        }}
        onMouseLeave={() => {
          backdropClick.current = true;

          if (heldInModal.current) {
            wasClickedInModal.current = true;
          } else {
            wasClickedInModal.current = false;
          }
          heldInModal.current = false;
        }}
        onMouseDown={() => {
          heldInModal.current = true;
        }}
        onMouseUp={() => {
          heldInModal.current = false;
        }}
      >
        {props.children}
      </animated.div>
    </animated.div>,
    portalRoot
  );
}
