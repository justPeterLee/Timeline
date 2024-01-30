import { useParams, useNavigate } from "react-router-dom";
import { current } from "../../tools/data";
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
  inputStyle?: { width?: number; height?: number };
  placeholder?: string;
  label: string;
  errorLabel?: string;

  // labelStyle: string;
}) {
  return (
    <div className="valid-input-container">
      <input
        className="valid-input"
        id={`${props.label}`}
        placeholder={props.placeholder}
      />
      <label className="valid-label" htmlFor={`${props.label}`}>
        {props.label}
      </label>
    </div>
  );
}

export function Backdrop({ onClose }: { onClose: () => void }) {
  // const closeBackdrop = () => {
  //   onClose
  // };
  return <div className={"backdrop"} onClick={onClose} />;
}
