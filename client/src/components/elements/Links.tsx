import { useParams, useNavigate } from "react-router-dom";
import { current } from "../../tools/data";
import ReactDOM from "react-dom";
import { ReactNode } from "react";
export function GlobalLinks({ page }: { page: string }) {
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
  inputStyle?: { width?: string; height?: string };
  placeholder?: string;
  label: string;
  errorLabel?: string;

  error?: { custom: boolean };
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

      {props.errorLabel && props.error?.custom ? (
        <label className="error-label" htmlFor={`${props.label}`}>
          {`* ${props.errorLabel}`}
        </label>
      ) : (
        <></>
      )}
    </div>
  );
}

export function Backdrop({ onClose }: { onClose: () => void }) {
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
      onClick={() => {
        onClose();
        console.log("click");
      }}
    />
  );
}

import { useRef } from "react";
export function Modal(props: { children: ReactNode; onClose: () => void }) {
  const backdropClick = useRef(true);

  const portalRoot = document.getElementById("portal-modal");
  if (!portalRoot) return <>Portal Root Not Found!</>;

  return ReactDOM.createPortal(
    <div
      className="modal-background"
      onClick={() => {
        if (backdropClick.current) {
          props.onClose();
        }
      }}
    >
      <div
        className="modal"
        onMouseEnter={() => {
          backdropClick.current = false;
        }}
        onMouseLeave={() => {
          backdropClick.current = true;
        }}
      >
        {props.children}
      </div>
    </div>,
    portalRoot
  );
}
