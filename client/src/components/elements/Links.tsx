import { useParams, useNavigate } from "react-router-dom";
import { current } from "../../tools/data";
import ReactDOM from "react-dom";
import { ReactNode } from "react";

export function ViewLinks({ page }: { page: string }) {
  const navigate = useNavigate();
  const { year, month, mode } = useParams();

  const yearRoute = `/year/${year || current.year}/${
    mode === undefined ? "create" : mode === "view" ? "create" : "view"
  }`;
  const monthRouter = `/month/${year || current.year}/${
    month || current.today.month + 1
  }/${mode === undefined ? "create" : mode === "view" ? "create" : "view"}`;

  return (
    <div className="linkButton">
      <button
        onClick={() => {
          navigate(page === "year" ? yearRoute : monthRouter);
        }}
        className="viewAllLink Link"
      >
        mode : {mode || "view"}
      </button>
      {month !== "0" ? (
        month !== undefined ? (
          <button
            onClick={() => {
              navigate(`/year/${year || current.year}/${mode}`);
            }}
            className="viewAllLink Link"
          >
            view all
          </button>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </div>
  );
}

export function ValidInput(props: {
  value: string;
  setValue: (value: string) => void;
  inputStyle?: {
    width?: string;
    height?: string;
    fontSize?: string;
    color?: string;
  };
  placeholder?: string;
  label: string;

  error?: {
    label: string;
    state: boolean;
  };
}) {
  return (
    <div className="valid-input-container">
      <input
        value={props.value}
        onChange={(e) => {
          props.setValue(e.target.value);
        }}
        style={props.inputStyle}
        className="valid-input"
        id={`${props.label}`}
        placeholder={props.placeholder}
      />
      <label
        className="valid-label"
        htmlFor={`${props.label}`}
        style={{
          transform: props.value.replace(/\s+/g, "") ? "translateY(16px)" : "",
        }}
      >
        {props.label}
      </label>

      {props.error && props.error.state ? (
        <label className="error-label" htmlFor={`${props.label}`}>
          {`* ${props.error.label}`}
        </label>
      ) : (
        <></>
      )}
    </div>
  );
}

export function Backdrop({
  onClose,
  backdropStyle = {},
}: {
  onClose: () => void;
  backdropStyle?: {};
}) {
  // const closeBackdrop = () => {
  //   onClose
  // };
  const portalRoot = document.getElementById("portal-modal");
  if (!portalRoot) {
    return <div>Portal root not found!</div>;
  }
  return (
    <div
      className={"backdrop"}
      style={{ ...backdropStyle }}
      onClick={() => {
        onClose();
        console.log("click");
      }}
    />
  );
}

import { animated, useSpring } from "react-spring";
import { useRef } from "react";
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
